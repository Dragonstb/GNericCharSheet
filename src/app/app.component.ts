import { Component, inject, NgZone, signal, ViewChild } from '@angular/core';
import OBR, { Player } from '@owlbear-rodeo/sdk';
import { BroadCaster } from '../services/broadcaster';
import { ValidatorService } from '../services/validator';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { GNericSheetCollection } from './sheetcollection/sheetcollection.component';
import { GNericSheetCollectionModel } from './sheetcollection/sheetcollectionmodel';
import { ActionTypes } from './ActionTypes';
import { GNericSheetPlayerAssignment } from '../services/sheetPlayerAssignment';
import { Tab, TabContent, TabList, TabPanel, Tabs } from '@angular/aria/tabs';
import { GNericCompChapter } from './compchapter/compchapter.component';

@Component({
  selector: 'app-root',
  imports: [GNericSheetCollection, GNericCompChapter, ReactiveFormsModule, TabList, Tab, Tabs, TabPanel, TabContent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class GNericMainComponent {
  private LOCAL_STORAGE_BASE: string = 'GNericCharSheet_';
  private SHEET_STORAGE: string = this.LOCAL_STORAGE_BASE + 'sheets';
  private ASSIGNMENT_STORAGE: string = this.LOCAL_STORAGE_BASE + 'assignments';

  title = 'GNericCharSheet';
  broadcaster: BroadCaster = inject(BroadCaster);
  ngZone = inject(NgZone);
  editableCheckbox = new FormControl(true);

  @ViewChild('sheetCollection') sheetCollectionElem: GNericSheetCollection | undefined; 

  sheets = new GNericSheetCollectionModel();
  otherPlayers: Player[] = [];
  // TODO: assignment shall survive page reloads
  // TODO: Broadcast changes in the assignments among the GMs
  sheetAssignments = new Map<string, string>; // assignment sheet id -> player id
  isGM = signal(!false);

  reactOnChange(json: any) {
    console.dir(json);
    this.storeSheets();
    this.broadcaster.handleOutgoingMessage(this.broadcaster.getGmGeneralChannel(), json);
    if(this.isGM() && ValidatorService.hasNonEmptyStringProperty('action', json) && json.action === ActionTypes.sheetupdate) {
      // also send the update to the player who plays this character
      const sheetId = json.model.id;
      const playerId = this.sheetAssignments.get(sheetId);
      if(playerId) {
        const channel = this.broadcaster.getPersonalChannelById(playerId);
        this.broadcaster.handleOutgoingMessage(channel, json);
      }
    }
  }

  reactOnPlayerSelection(assignment: GNericSheetPlayerAssignment): void {
    const oldPlayerId: string | undefined = this.sheetAssignments.get(assignment.getSheetId());
    const newPlayerId: string = assignment.getPlayerId();

    if(newPlayerId.length > 0) {
      if(oldPlayerId === newPlayerId) {
        return;
      }

      // assign new player
      this.sheetAssignments.set(assignment.getSheetId(), newPlayerId);
      this.storeAssignments();
      this.updatePlayersSheets(newPlayerId);
      if(oldPlayerId) {
        this.updatePlayersSheets(oldPlayerId);
      }
    }
    else if(oldPlayerId) {
      this.sheetAssignments.delete(assignment.getSheetId());
      this.storeAssignments();
      // notify old player that he/she is losing control now
      this.updatePlayersSheets(oldPlayerId);
    }
  }

  updatePlayersSheets(playerId: string) {
    const sheetIds: Set<string> = new Set();
    this.sheetAssignments.forEach((plrId, sheetId) => {
      if(this.sheetAssignments.get(sheetId) === playerId) {
        sheetIds.add(sheetId);
      }
    });
    
    const fullModel = this.sheets.getModelRestrainedToSheets(sheetIds);
    const json = {...fullModel, action: ActionTypes.collectionupdate};
    const channel = this.broadcaster.getPersonalChannelById(playerId);
    this.broadcaster.handleOutgoingMessage(channel, json);
  }

  setModel(model: any) {
    if(!ValidatorService.isModel(model)) {
      console.log('GNeric Char Sheet: received invalid model.');
      return;
    }

    try {
      this.ngZone.runGuarded(()=>{
        const ok = this.sheets.updateModel(model);
        if(ok) {
          if(this.sheetCollectionElem) {
            this.sheetCollectionElem.checkCurrentSheet();
          }
          this.storeSheets();
        }
      });
    } catch (error) {
      console.log('GNeric Char Sheet: error when updating character sheets.');
    }
  }

  storeSheets(): void {
    localStorage.setItem(this.SHEET_STORAGE, JSON.stringify(this.sheets.getModel()));
  }

  loadSheets(): void {
    try {
      const sheetModel: string | null = localStorage.getItem(this.SHEET_STORAGE);
      if(sheetModel) {
        const json = {...JSON.parse(sheetModel), action: ActionTypes.collectionupdate};
        this.sheets.updateModel(json);
      }
    } catch (error) {
      console.log('GNeric Char Sheet: Error when loading sheet data from local storage.');
    }
  }

  clearSheetStorage(): void {
    localStorage.removeItem(this.SHEET_STORAGE);
  }

  storeAssignments(): void {
    const json: any = {};
    this.sheetAssignments.forEach((val, key) => {
      json[key] = val;
    });
    localStorage.setItem(this.ASSIGNMENT_STORAGE, JSON.stringify(json));
  }

  loadAssignments(): void {
    const rawAssignments: string | null = localStorage.getItem(this.ASSIGNMENT_STORAGE);
    if(rawAssignments) {
      this.sheetAssignments.clear();
      const json = JSON.parse(rawAssignments);
      for (const key in json) {
        if (json.hasOwnProperty(key)) {
          this.sheetAssignments.set(key, json[key]);
        }
      }
    }
  }

  clearAssignmentStorage(): void {
    localStorage.removeItem(this.ASSIGNMENT_STORAGE);
  }

  updatePlayers(party: Player[]): void {
    if(!this.isGM()) {
      return;
    }

    try {
      this.ngZone.runGuarded(() => {
        // TODO: unassign sheets that are assigned to a player who becomes promoted to GM
        const playerIds: Set<string> = new Set();
        party.forEach(player => playerIds.add(player.id));
        this.sheetAssignments.forEach((playerId, sheetId) => {
          if(!playerIds.has(playerId)) {
            this.sheetAssignments.delete(sheetId);
          }
        });

        this.otherPlayers = party;
      });
    } catch (error) {
      console.log('GNeric Char Sheet: Error when updating the players.');
    }
  }

  ngOnInit() {
    this.broadcaster.setApp(this);
    this.loadSheets();
    this.loadAssignments();
    OBR.onReady(
      ()=>{
        this.broadcaster.setReady();
        OBR.player.getId().then(id => {
          this.broadcaster.setPersonalChannelById(id);
        });
        // TODO: also set 'isGM' when the role changes later on
        // TODO: Show alert that multi-GM support hsa not been implemented yet (until this feature becomes true)
        // TODO: send all sheets to a player when he/she becomes promoted to GM
        OBR.player.getRole().then(role => {
          this.isGM.set(role === 'GM');
        });
        OBR.party.getPlayers().then(party => {
          this.updatePlayers(party);
        });
        OBR.party.onChange(party => {
          this.updatePlayers(party);
        });
      }
    );
  }

  // TODO: call clearSheets and clearAssignments when needed or switch to session storage
}
