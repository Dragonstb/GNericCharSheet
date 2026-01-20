import { Component, inject, NgZone } from '@angular/core';
import OBR from '@owlbear-rodeo/sdk';
import { BroadCaster } from '../services/broadcaster';
import { ValidatorService } from '../services/validator';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { GNericSheetCollection } from './sheetcollection/sheetcollection.component';
import { GNericSheetCollectionModel } from './sheetcollection/sheetcollectionmodel';

@Component({
  selector: 'app-root',
  imports: [GNericSheetCollection, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class GNericMainComponent {
  title = 'GNericCharSheet';
  broadcaster: BroadCaster = inject(BroadCaster);

  ngZone = inject(NgZone);

  editableCheckbox = new FormControl(true);

  sheets = new GNericSheetCollectionModel();

  reactOnChange(json: object) {
    console.dir(json);
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
        this.sheets.updateModel(model);
      });
    } catch (error) {
      console.log('GNeric Char Sheet: error when updating character sheets');
    }
  }

  ngOnInit() {
    this.broadcaster.setApp(this);
    OBR.onReady(
      ()=>{
        this.broadcaster.setReady();
      }
    );
  }
}
