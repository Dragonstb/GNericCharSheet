import { Component, Input, output, signal } from "@angular/core";
import { ItemListModel } from "../itemlist/itemlistmodel";
import { GNericRoItemEntry } from "./roitementry.component";

@Component({
    selector: 'gneric-ro-itemlist',
    templateUrl: './roitemlist.component.html',
    imports: [GNericRoItemEntry]
})
export class GNericRoItemlist {

    @Input() listModel: ItemListModel | null = null;
    selectItemEvent = output<object>();

    expanded = signal(false);

    toggleExpansion(): void {
        this.expanded.update(val => !val);
    }

    getTitle(): string {
        return this.listModel ? this.listModel.getTitle() : 'list';
    }

    bubbleSelectItemEvent(json: object): void {
        this.selectItemEvent.emit(json);
    }
}