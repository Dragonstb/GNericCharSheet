import { Component, Input } from "@angular/core";
import { GNericItemModel } from "./itemmodel";
import { ReactiveFormsModule } from "@angular/forms";

@Component({
    selector: 'gneric-itementry',
    templateUrl: './itementry.component.html',
    imports: [ReactiveFormsModule]
})
export class GNericItemEntry {

    @Input() model: GNericItemModel = new GNericItemModel('0');
    @Input() editable: boolean = false;
    expanded: boolean = false;

    toggleExpansion(): void {
        this.expanded = !this.expanded;
    }
}