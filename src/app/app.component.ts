import { Component, inject, viewChildren } from '@angular/core';
import OBR from '@owlbear-rodeo/sdk';
import { BroadCaster } from '../services/broadcaster';
import { ValidatorService } from '../services/validator';
import { GNericSheetPage } from './sheetpage/sheetpage.component';
import { GNericSheet } from './sheet/sheet.component';

@Component({
  selector: 'app-root',
  imports: [GNericSheet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class GNericMainComponent {
  title = 'GNericCharSheet';
  broadcaster: BroadCaster = inject(BroadCaster);
  sheets = viewChildren(GNericSheet);
  private validator = inject(ValidatorService);

  setElemsEditable(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const checked: boolean = checkbox.checked;

    // this.pages().forEach(page => {
    //   page.setEditable(checked);
    // });

  }

  reactOnChange(json: object) {
    console.dir(json);
    // this.broadcaster.handleOutgoingMessage(json);
  }

  setModel(model: any) {
    if(this.validator.hasNonEmptyStringProperty('id', model)) {
      if(this.sheets().length > 0) {
        // this.pages()[0].setModel(model);
      }
    }
    else {
      console.log('GNeric Char Sheet: received model without id.');
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
