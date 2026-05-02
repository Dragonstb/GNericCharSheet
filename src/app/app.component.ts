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
import { GNericCompendium } from './compendium/compendium.component';
import { CompendiumService } from '../services/compendium';
import { GNericSettings } from './settings/settings.component';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from './i18n/LanguageService';
import { GNericGMSettings } from './gm/gm.component';

@Component({
  selector: 'app-root',
  imports: [GNericSheetCollection, GNericCompendium, GNericSettings, GNericGMSettings, ReactiveFormsModule, TabList, Tab, Tabs, TabPanel, TabContent, TranslatePipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class GNericMainComponent {
  private LOCAL_STORAGE_BASE: string = 'GNericCharSheet_';
  private SHEET_STORAGE: string = this.LOCAL_STORAGE_BASE + 'sheets';
  private ASSIGNMENT_STORAGE: string = this.LOCAL_STORAGE_BASE + 'assignments';
  private SUBJECT_SHEETS: string = "sheets";
  private SUBJECT_COMPENDIUM: string = "compendium";
  private SUBJECT_MERGE: string = "merge";

  langService = inject(LanguageService);
  compService = inject(CompendiumService); // this also initializes the language settings

  title = 'GNericCharSheet';
  broadcaster: BroadCaster = inject(BroadCaster);
  ngZone = inject(NgZone);
  editableCheckbox = new FormControl(false);

  @ViewChild('sheetCollection') sheetCollectionElem: GNericSheetCollection | undefined;
  @ViewChild('compendiumElement') compendiumElem: GNericCompendium | undefined;

  sheets = new GNericSheetCollectionModel();
  otherPlayers: Player[] = []; // TODO: use a map: player id -> player
  // TODO: Broadcast changes in the assignments among the GMs
  sheetAssignments = new Map<string, string>; // assignment of sheet id -> player id
  isGM = signal(window.location.hostname === 'localhost');
  lightTheme = signal(!false);

  reactOnSheetChange(json: any) {
    const envelope = {} as any;
    envelope[this.SUBJECT_SHEETS] = json;
    this.storeSheets();
    this.broadcaster.handleOutgoingMessage(this.broadcaster.getGmGeneralChannel(), envelope);
    if(this.isGM() && ValidatorService.hasNonEmptyStringProperty('action', json) && json.action === ActionTypes.sheetupdate) {
      // also send the update to the player who plays this character
      const sheetId = json.model.id;
      const playerId = this.sheetAssignments.get(sheetId);
      if(playerId) {
        const channel = this.broadcaster.getPersonalChannelById(playerId);
        this.broadcaster.handleOutgoingMessage(channel, envelope);
      }
    }
  }

  reactOnCompendiumChange(json: object) {
    const envelope = {} as any;
    envelope[this.SUBJECT_COMPENDIUM] = json;
    this.compService.storeCompendium();
    this.broadcaster.handleOutgoingMessage(this.broadcaster.getBroadcastChannel(), envelope);
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
    const envelope = {} as any;
    envelope[this.SUBJECT_SHEETS] = json;
    this.broadcaster.handleOutgoingMessage(channel, envelope);
  }

  // _______________  receive and process model updates  _______________

  setModel(model: any) {
    if(!ValidatorService.isModel(model)) {
      console.log('GNeric Char Sheet: received invalid model.');
      return;
    }

    try {
      this.ngZone.runGuarded(()=>{
        if(model.hasOwnProperty(this.SUBJECT_SHEETS) && model[this.SUBJECT_SHEETS]) {
          this.updateSheetModels(model[this.SUBJECT_SHEETS]);
        }
        if(model.hasOwnProperty(this.SUBJECT_COMPENDIUM) && model[this.SUBJECT_COMPENDIUM]) {
          this.updateCompendiumModels(model[this.SUBJECT_COMPENDIUM]);
        }
        if(model.hasOwnProperty(this.SUBJECT_MERGE) && model[this.SUBJECT_MERGE]) {
          this.mergeUpload(model[this.SUBJECT_MERGE]);
        }
      });
    } catch (error) {
      console.log('GNeric Char Sheet: error when updating character sheets.');
    }
  }

  private updateSheetModels(model: any): void {
    const ok = this.sheets.updateModel(model);
    if(ok) {
      if(this.sheetCollectionElem) {
        this.sheetCollectionElem.checkCurrentSheet();
      }
      this.storeSheets();
    }
  }

  private updateCompendiumModels(model: any): void {
    const ok = this.compService.updateModel(model);
    if(ok) {
      if(this.compendiumElem) {
        this.compendiumElem.checkCurrentChapter();
      }
      this.compService.storeCompendium();
    }
  }

  // _______________  process model uploads  _______________

  mergeUpload(model: any, broadcast: boolean = false) {
    if(!ValidatorService.isModel(model)) {
      console.log('GNeric Char Sheet: uploaded invalid model.');
      return;
    }

    if(model.hasOwnProperty('sheets') && model.sheets) {
      const hasMerged = this.sheets.mergeSheets(model.sheets);
      if(hasMerged) {
        this.storeSheets();
        // TODO: broadcast to other GMs (once the multi GM feature becomes implemented in GNericCharSheet)
      }
    }

    if(model.hasOwnProperty('compendium') && model.compendium) {
      const json = {...model.compendium, action: ActionTypes.contentmerge};
      const diffModel = this.compService.mergeModel(json);
      if(diffModel !== null ) {
        this.compService.storeCompendium();
        if(broadcast) {
          const envelope = {} as any;
          envelope[this.SUBJECT_MERGE] = {
            compendium: diffModel
          }
          this.broadcaster.handleOutgoingMessage(this.broadcaster.getBroadcastChannel(), envelope);
        }
      }
    }
  }

  // _______________  storage management  _______________

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

  // _______________  player management and inti  _______________

  respondOnHello(id: string): void {
    // TODO: only one GM should respond to hello once the multi-GM feature is established
    if(!this.isGM()) {
      return;
    }

    for (const player of this.otherPlayers) {
      if(player.id === id) {
        const model = this.compService.getCompendium().getModel();
        const json = {...model, action: ActionTypes.compendiumupdate};
        const envelope = {} as any;
        envelope[this.SUBJECT_COMPENDIUM] = json;
        this.broadcaster.handleOutgoingMessage(this.broadcaster.getPersonalChannelById(player.id), envelope);
        return;
      }
    }
  
    // usually(!) this.otherPlayers has been updated already when a new player sends the hello request
    console.log('GNericCharSheet: an unknown player requested the compendium.');
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

        // unassign sheets that are assigned to players who are not in the party anymore (presumably on account of having left the session)
        this.sheetAssignments.forEach((playerId, sheetId) => {
          if(!playerIds.has(playerId)) {
            this.sheetAssignments.delete(sheetId);
          }
        });

        // update data structure
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
    this.compService.loadCompendium();
    OBR.onReady(
      ()=>{
        this.broadcaster.setReady();
        OBR.player.getId().then(id => {
          this.broadcaster.setPersonalChannelById(id);
        });
        // TODO: also set 'isGM' when the role changes later on
        // TODO: Show alert that multi-GM support has not been implemented yet (until this feature becomes true)
        // TODO: send all sheets to a player when he/she becomes promoted to GM
        OBR.player.getRole().then(role => {
          this.isGM.set(role === 'GM');
          if(this.isGM()) {
            this.broadcaster.addToAdminChannel();
          }
          else {
            // request compendium from an admin
            OBR.player.getId().then(id => {
              const channel = this.broadcaster.getGmHelloChannel();
              this.broadcaster.handleOutgoingMessage(channel, {id: id});
            });
          }
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
