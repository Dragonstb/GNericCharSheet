import { Component, inject, NgZone, signal, ViewChild } from '@angular/core';
import OBR, { Player } from '@owlbear-rodeo/sdk';
import { BroadCaster } from '../services/broadcaster';
import { ValidatorService } from '../services/validator';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { GNericSheetCollection } from './sheetcollection/sheetcollection.component';
import { GNericSheetCollectionModel } from './sheetcollection/sheetcollectionmodel';
import { ActionTypes } from './ActionTypes';
import PlayerApi from '@owlbear-rodeo/sdk/lib/api/PlayerApi';
import { GNericSheetPlayerAssignment } from '../services/sheetPlayerAssignment';
import { setSyntheticLeadingComments } from 'typescript';

@Component({
  selector: 'app-root',
  imports: [GNericSheetCollection, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class GNericMainComponent {  
  private SHEET_STORAGE: string = 'sheet_storage';

  title = 'GNericCharSheet';
  broadcaster: BroadCaster = inject(BroadCaster);
  ngZone = inject(NgZone);
  editableCheckbox = new FormControl(true);

  @ViewChild('sheetCollection') sheetCollectionElem: GNericSheetCollection | undefined; 

  sheets = new GNericSheetCollectionModel();
  otherPlayers: Player[] = [];
  // assignment sheet id -> player id
  private sheetAssignments = new Map<string, string>;
  isGM = signal(!false);

  reactOnChange(json: any) {
    console.dir(json);
    this.storeSheets();
    this.broadcaster.handleOutgoingMessage(this.broadcaster.getGmGeneralChannel(), json);
    if(this.isGM() && ValidatorService.hasNonEmptyStringProperty('action', json) && json.action === ActionTypes.sheetupdate) {
      // also send to the player who plays this character whose sheet is getting an update
      const sheetId = json.model.id;
      const playerId = this.sheetAssignments.get(sheetId);
      if(playerId) {
        const channel = this.broadcaster.getPersonalChannelById(playerId);
        this.broadcaster.handleOutgoingMessage(channel, json);
      }
    }
  }

  reactOnPlayerSelection(assignment: GNericSheetPlayerAssignment): void {
    console.log('reacting on player selection: '+assignment.getPlayerId());
    const oldPlayerId: string | undefined = this.sheetAssignments.get(assignment.getSheetId());
    const newPlayerId: string = assignment.getPlayerId();

    if(newPlayerId.length > 0) {
      if(oldPlayerId === newPlayerId) {
        return;
      }

      // assign new player
      this.sheetAssignments.set(assignment.getSheetId(), newPlayerId);
      this.updatePlayersSheets(newPlayerId);
      if(oldPlayerId) {
        this.updatePlayersSheets(oldPlayerId);
      }
    }
    else if(oldPlayerId) {
      this.sheetAssignments.delete(assignment.getSheetId());
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
    console.log('updating player sheets for '+playerId);
    console.dir(json);
    this.broadcaster.handleOutgoingMessage(channel, json);
  }

  setModel(model: any) {
    console.dir(model);
    if(!ValidatorService.isModel(model)) {
      console.log('GNeric Char Sheet: received model without id.');
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
      console.log('GNeric Char Sheet: error when updating character sheets');
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
      console.log('GNeric Char Sheet: Error when loading sheet data from local storage');
    }
  }

  clearSheets(): void {
    localStorage.removeItem(this.SHEET_STORAGE);
  }

  updatePlayers(party: Player[]): void {
    if(!this.isGM) {
      return;
    }

    // TODO: unassign sheets that are assigned to players that do not exist in 'party' anymore
    this.otherPlayers = party;
  }

  ngOnInit() {
    this.broadcaster.setApp(this);
    this.loadSheets();
    OBR.onReady(
      ()=>{
        this.broadcaster.setReady();
        OBR.player.getId().then(id => {
          this.broadcaster.setPersonalChannelById(id);
        });
        // TODO: also set 'isGM' when the role changes later on
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

  // TODO: call clearSheets when needed or switch to session storage
}
