import { Component, viewChildren } from '@angular/core';
import { GnericTextfield } from './textfield/textfield.component.js';

@Component({
  selector: 'app-root',
  imports: [GnericTextfield],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent {
  title = 'GNericCharSheet';
  textfields = viewChildren(GnericTextfield);

  setElemsEditable(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const checked: boolean = checkbox.checked;
    this.textfields().forEach(tf => {
      tf.setEditable(checked);
    });
  }

  deleteTextfield(elemId: string) {
    console.log(elemId);
  }
}
