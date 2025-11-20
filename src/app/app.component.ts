import { Component, inject, viewChildren } from '@angular/core';
import { GnericTextfield } from './textfield/textfield.component';
import OBR from '@owlbear-rodeo/sdk';
import { BroadCaster } from '../services/broadcaster';
import { GNericTable } from './table/table.component';
import { ElemTypes } from './elemtypes';
import { GNericRessourcePointsManager } from './ressourcepoints/rpm.component';
import { GNericItemList } from './itemlist/itemlist.component';
import { GNericCheckboxList } from './checkboxes/checkboxes.component';

@Component({
  selector: 'app-root',
  imports: [GNericCheckboxList],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class GNericMainComponent {
  title = 'GNericCharSheet';
  broadcaster: BroadCaster = inject(BroadCaster);
  textfields = viewChildren(GnericTextfield);
  tables = viewChildren(GNericTable);
  rpms = viewChildren(GNericRessourcePointsManager);
  itemlists = viewChildren(GNericItemList);
  checkboxes = viewChildren(GNericCheckboxList);

  setElemsEditable(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const checked: boolean = checkbox.checked;

    this.textfields().forEach(tf => {
      tf.setEditable(checked);
    });

    this.tables().forEach(tbl => {
      tbl.setEditable(checked);
    });

    this.rpms().forEach(rpm => {
      rpm.setEditable(checked);
    });

    this.itemlists().forEach(list => {
      list.setEditable(checked);
    });

    this.checkboxes().forEach(box => {
      box.setEditable(checked);
    });
  }

  reactOnChange(json: object) {
    console.dir(json);
    // this.broadcaster.handleOutgoingMessage(json);
  }

  deleteTextfield(elemId: string) {
    console.log(elemId);
  }
  
  deleteTable(elemId: string) {
    console.log('deleting '+elemId);
  }

  deleteRPM(elemId: string) {
    console.log('deleting '+elemId);
  }

  deleteItemList(elemId: string) {
    console.log('deleting item list '+elemId);
  }
  
  deleteCheckboxes(elemId: string) {
    console.log('deleting checkboxes '+elemId);
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
        case ElemTypes.rpm:
          if(this.rpms().length > 0) {
            this.rpms()[0].setModel(model);
          }
          break;
          case ElemTypes.itemlist:
            if(this.itemlists().length > 0) {
              this.itemlists()[0].setModel(model);
            }
          break;
          case ElemTypes.itementry:
            if(this.itemlists().length > 0) {
              this.itemlists()[0].setModel(model);
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
