import { Component, signal } from "@angular/core";
import { GNericItemEntry } from "./itementry.component";

@Component({
    selector: 'gneric-itemlist',
    templateUrl: './itemlist.component.html',
    imports: [GNericItemEntry]
})
export class GNericItemList {

    editable = signal(true);

    setEditable(editable: boolean): void {
        this.editable.set(editable);
    } 
}