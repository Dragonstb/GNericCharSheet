import { Component, inject, output, signal, ViewChild } from "@angular/core";
import { GNericItemEntry } from "./itementry.component";
import { GNericItemModel } from "./itemmodel";
import { FormControl } from "@angular/forms";
import { GNericAddItemModal } from "./additemmodal.component";
import { ElemTypes } from "../elemtypes";
import { ValidatorService } from "../../services/validator";

@Component({
    selector: 'gneric-itemlist',
    templateUrl: './itemlist.component.html',
    imports: [GNericItemEntry, GNericAddItemModal]
})
export class GNericItemList {

    id: string = 'comp-04-04';
    fullId: string = 'itemlist-'+this.id;

    @ViewChild('modal') modal!: GNericAddItemModal;

    deleteItemListEvent = output<string>();
    gNericElemChangedEvent = output<object>();

    validator = inject(ValidatorService);

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

    fireDeleteItemlistEvent(): void {
        this.deleteItemListEvent.emit(this.id);
    }

    fireEntryChangeEvent(json: object) {
        this.gNericElemChangedEvent.emit(json);
    }

    fireListChangeEvent(): void {
        let items: object[] = [];
        this.items.forEach(item => {
            items.push(item.getModel());
        });
        const listname = this.listname.value ?? '';

        const model = {
            id: this.id,
            type: ElemTypes.itemlist,
            listname: listname,
            items: items
        }

        // TODO: fire event
    }

    validateInput(model: any): boolean {
        if(!this.validator.isModel(model) || !this.validator.isForMe(this.id, ElemTypes.itemlist, model)) {
            return false;
        }

        if(!model.hasOwnProperty('listname') || (!model.listname && model.listname !== '') || typeof model.listname !== 'string') {
            return false;
        }

        // TODO: validate items

        return true;
    }

    setModel(model: any): void {
        if(!this.validator.isModel(model)) {
            return;
        }

        if(!model.hasOwnProperty('type') || typeof model.type !== 'string') {
            return;
        }

        switch(model.type) {
            case ElemTypes.itemlist: break;
            case ElemTypes.itementry: break;
            // everything else: do nothing
        }
    }

    setListModel(model: any) {

    }

    setEntryModel(model: any) {
        // id === '' is not ok here
        if(!model.hasOwnProperty('id') || !model.type || typeof model.type !== 'string') {
            // TODO: log
            return;
        }

        for (const item of this.items) {
            if(item.getId() == model.id) {
                const name = model.name ?? '';
                const text = model.text ?? '';
                item.setNameAndText(name, text);
                break;
            }
        }
    }
}