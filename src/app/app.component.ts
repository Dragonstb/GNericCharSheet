import { Component, inject, viewChildren } from '@angular/core';
import { GnericTextfield } from './textfield/textfield.component';
import OBR from '@owlbear-rodeo/sdk';
import { BroadCaster } from '../services/broadcaster';
import { GNericTable } from './table/table.component';
import { ElemTypes } from './elemtypes';
import { GNericRessourcePointsManager } from './ressourcepoints/rpm.component';

@Component({
  selector: 'app-root',
  imports: [GNericRessourcePointsManager],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class GNericMainComponent {
  title = 'GNericCharSheet';
  broadcaster: BroadCaster = inject(BroadCaster);
  textfields = viewChildren(GnericTextfield);
  tables = viewChildren(GNericTable);
  rpms = viewChildren(GNericRessourcePointsManager);

  setElemsEditable(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const checked: boolean = checkbox.checked;

    this.textfields().forEach(tf => {
      tf.setEditable(checked);
    });

    this.tables().forEach(tbl => {
      tbl.setEditable(checked);
    });
  }

  reactOnChange(json: object) {
    this.broadcaster.handleOutgoingMessage(json);
  }

  deleteTextfield(elemId: string) {
    console.log(elemId);
  }
  
  deleteTable(elemId: string) {
    console.log('deleting '+elemId);
  }

  setModel(model: any) {
    if(model.type){
      switch(model.type) {
        case ElemTypes.textfield:
          if(this.textfields().length > 0) {
            this.textfields()[0].setModel(model);
          }
          break;
        case ElemTypes.table:
          if(this.tables().length > 0) {
            this.tables()[0].setModel(model);
          }
          break;
        default:
          console.log('received model of unexpected type');
          break;
      }
    }
    else{
      console.log('received model without type');
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
