import { Component, inject, viewChildren } from '@angular/core';
import { GnericTextfield } from './textfield/textfield.component';
import OBR from '@owlbear-rodeo/sdk';
import { BroadCaster } from '../services/broadcaster';
import { GNericTable } from './table/table.component';
import { ElemTypes } from './elemtypes';
import { GNericRessourcePointsManager } from './ressourcepoints/rpm.component';
import { GNericItemList } from './itemlist/itemlist.component';
import { GNericCheckboxList } from './checkboxes/checkboxes.component';
import { GNericBlock } from './block/block.component';
import { ValidatorService } from '../services/validator';

@Component({
  selector: 'app-root',
  imports: [GNericBlock],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class GNericMainComponent {
  title = 'GNericCharSheet';
  broadcaster: BroadCaster = inject(BroadCaster);
  blocks = viewChildren(GNericBlock);
  private validator = inject(ValidatorService);

  setElemsEditable(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const checked: boolean = checkbox.checked;

    this.blocks().forEach(block => {
      block.setEditable(checked);
    });

  }

  reactOnChange(json: object) {
    console.dir(json);
    // this.broadcaster.handleOutgoingMessage(json);
  }

  setModel(model: any) {
    if(this.validator.hasNonEmptyStringProperty('id', model)) {
      if(this.blocks().length > 0) {
        this.blocks()[0].setModel(model);
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
