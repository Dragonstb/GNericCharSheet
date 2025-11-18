import { Component, signal, ViewChild } from "@angular/core";
import { GNericItemEntry } from "./itementry.component";
import { GNericItemModel } from "./itemmodel";
import { FormControl } from "@angular/forms";
import { GNericAddItemModal } from "./additemmodal.component";

@Component({
    selector: 'gneric-itemlist',
    templateUrl: './itemlist.component.html',
    imports: [GNericItemEntry, GNericAddItemModal]
})
export class GNericItemList {

    @ViewChild('modal') modal!: GNericAddItemModal;

    items: GNericItemModel[] = [
        new GNericItemModel('1', 'Sword', 'Attack + 2\nAttack speed: 3\nDamage: 2d6'),
        new GNericItemModel('2', 'Axe', 'Attack + 4\nAttack speed: 1\nDamage: 2d6+3'),
        new GNericItemModel('3', 'Shield', 'Defense + 2\nAttack speed: -1'),
    ];

    listname = new FormControl('Items');

    editable = signal(true);
    expanded = signal(true);

    setEditable(editable: boolean): void {
        this.editable.set(editable);
    }

    toggleExpansion(): void {
        this.expanded.update(val => !val);
    }

    handleAddNewEntry(): void {
        this.modal.openDialog();
    }

    addNewItem(item: GNericItemModel): void {
        this.items.push(item);
    }

    deleteItem(itemId: string): void {
        for (let idx = 0; idx < this.items.length; idx++) {
            const item = this.items[idx];
            if(item.getId() === itemId) {
                this.items.splice(idx, 1);
                break;
            }
        }
    }
}