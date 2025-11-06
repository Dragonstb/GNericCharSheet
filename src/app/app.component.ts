import { Component, inject, viewChildren } from '@angular/core';
import { GnericTextfield } from './textfield/textfield.component';
import OBR from '@owlbear-rodeo/sdk';
import { BroadCaster } from '../services/broadcaster';
import { GNericTable } from './table/table.component';

@Component({
  selector: 'app-root',
  imports: [GNericTable],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class GNericMainComponent {
  title = 'GNericCharSheet';
  broadcaster: BroadCaster = inject(BroadCaster);
  textfields = viewChildren(GnericTextfield);
  tables = viewChildren(GNericTable);

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

  setModel(model: any) {
    if(this.textfields().length > 0) {
      this.textfields()[0].setModel(model);
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
