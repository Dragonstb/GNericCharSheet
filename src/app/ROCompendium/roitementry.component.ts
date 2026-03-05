import { Component, Input, output, signal } from "@angular/core";
import { GNericItemModel } from "../itemlist/itemmodel";

@Component({
    selector: 'gneric-ro-itementry',
    templateUrl: './roitementry.component.html'
})
export class GNericRoItemEntry {

    @Input() item: GNericItemModel | null = null;
    selectItemEvent = output<object>();

    expanded = signal(false);

    toggleExpansion(): void {
        this.expanded.update(val => !val);
    }

    selectThis(): void {
        if(!this.item) {
            return;
        }

        const json = {
            name: this.item.name.value ?? '',
            text: this.item.text.value ?? ''
        }

        this.selectItemEvent.emit(json);
    }
}