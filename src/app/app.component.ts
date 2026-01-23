import { Component, inject, NgZone } from '@angular/core';
import OBR from '@owlbear-rodeo/sdk';
import { BroadCaster } from '../services/broadcaster';
import { ValidatorService } from '../services/validator';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { GNericSheetCollection } from './sheetcollection/sheetcollection.component';
import { GNericSheetCollectionModel } from './sheetcollection/sheetcollectionmodel';
import { ActionTypes } from './ActionTypes';

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

  sheets = new GNericSheetCollectionModel();

  reactOnChange(json: object) {
    console.dir(json);
    this.storeSheets();
    // this.broadcaster.handleOutgoingMessage(json);
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

  ngOnInit() {
    this.broadcaster.setApp(this);
    this.loadSheets();
    OBR.onReady(
      ()=>{
        this.broadcaster.setReady();
      }
    );
  }

  // TODO: call clearSheets when needed or switch to session storage
}
