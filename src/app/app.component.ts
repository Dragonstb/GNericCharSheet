import { Component, inject, NgZone, viewChildren } from '@angular/core';
import OBR from '@owlbear-rodeo/sdk';
import { BroadCaster } from '../services/broadcaster';
import { ValidatorService } from '../services/validator';
import { GNericSheet } from './sheet/sheet.component';
import { GNericSheetModel } from './sheet/sheetmodel';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [GNericSheet, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class GNericMainComponent {
  title = 'GNericCharSheet';
  broadcaster: BroadCaster = inject(BroadCaster);
  sheets = viewChildren(GNericSheet);

  ngZone = inject(NgZone);

  editableCheckbox = new FormControl(true);

  sheetModels: GNericSheetModel[] = [
    new GNericSheetModel('char-sheet-0', 'Alex Anyone')
  ]

  setElemsEditable(event: Event) {
    this.sheets().forEach(sheet => {
      setTimeout(() => {
        sheet.setEditable(Boolean(this.editableCheckbox.value));
      });
    });
  }

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

    if(!ValidatorService.hasNonEmptyStringProperty('id', model)) {
      console.log('GNeric Char Sheet: received model without id.');
      return;
    }

    for (const sheet of this.sheetModels) {
      if(sheet.getId() === model.id) {
        try {
          this.ngZone.runGuarded(()=>{
            sheet.updateModel(model);
            // TODO: bug: new elements start as editable even when sheet is not editable
          });
        } catch (error) {
          console.log('GNeric Char Sheet: error when updating character sheet');
        }
        return;
      }
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
