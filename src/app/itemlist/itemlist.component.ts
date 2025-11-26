import { Component, ElementRef, inject, NgZone, output, signal, ViewChild } from "@angular/core";
import { GNericItemEntry } from "./itementry.component";
import { GNericItemModel } from "./itemmodel";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { GNericAddItemModal } from "./additemmodal.component";
import { ElemTypes } from "../elemtypes";
import { ValidatorService } from "../../services/validator";

@Component({
    selector: 'gneric-itemlist',
    templateUrl: './itemlist.component.html',
    imports: [GNericItemEntry, GNericAddItemModal, ReactiveFormsModule]
})
export class GNericItemList {

    id: string = 'comp-04-04';
    fullId: string = 'itemlist-'+this.id;

    @ViewChild('modal') modal!: GNericAddItemModal;
    @ViewChild('fieldSet', {static: true}) fieldSet!: ElementRef<HTMLFieldSetElement>;

    deleteItemListEvent = output<string>();
    gNericElemChangedEvent = output<object>();

    validator = inject(ValidatorService);
    ngZone = inject(NgZone);

    items: GNericItemModel[] = [];

    listname = new FormControl('Items '+this.id);

    editable = signal(true);
    expanded = signal(true);

    setEditable(editable: boolean): void {
        this.editable.set(editable);

        const hasClassEditable = this.fieldSet.nativeElement.classList.contains('editable');
        if(editable && !hasClassEditable) {
            this.fieldSet.nativeElement.classList.add('editable');
        }
        else if(!editable && hasClassEditable) {
            this.fieldSet.nativeElement.classList.remove('editable');
        }
    }

    toggleExpansion(): void {
        this.expanded.update(val => !val);
    }

    handleAddNewEntry(): void {
        this.modal.openDialog();
    }

    addNewItem(item: GNericItemModel): void {
        this.items.push(item);
        this.fireListChangeEvent();
    }

    deleteItem(itemId: string): void {
        for (let idx = 0; idx < this.items.length; idx++) {
            const item = this.items[idx];
            if(item.getId() === itemId) {
                this.items.splice(idx, 1);
                this.fireListChangeEvent();
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

        this.gNericElemChangedEvent.emit(model);
    }

    validateListModel(model: any): boolean {
        if(!this.validator.isForMe(this.id, ElemTypes.itemlist, model)) {
            return false;
        }

        if(!this.validator.hasNonEmptyStringProperty('listname', model)) {
            return false;
        }

        if(!model.hasOwnProperty('items') || !model.items || typeof model.items !== 'object' || !Array.isArray(model.items)) {
            return false;
        }

        const arr = model.items;
        const duplicateKeyCheck: Set<string> = new Set();
        for (const item of arr) {
            if(!item) {
                return false;
            }

            if(!this.validateEntryModel(item)) {
                return false;
            }

            const itemId = item.id;
            if(duplicateKeyCheck.has(itemId)) {
                return false;
            }
            duplicateKeyCheck.add(itemId);

        }

        return true;
    }

    validateEntryModel(model: any): boolean {
        // id === '' is not ok here
        if(!model.hasOwnProperty('id') || !model.id || typeof model.id !== 'string') {
            return false;
        }

        if(!model.hasOwnProperty('type') || model.type !== ElemTypes.itementry) {
            return false;
        }

        if(!model.hasOwnProperty('name') || typeof model.name !== 'string') {
            return false;
        }

        if(!model.hasOwnProperty('text') || typeof model.text !== 'string') {
            return false;
        }

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
            case ElemTypes.itemlist: this.setListModel(model); break;
            case ElemTypes.itementry: this.setEntryModel(model); break;
            // everything else: do nothing
        }
    }

    setListModel(model: any) {
        if(!this.validateListModel(model)) {
            return;
        }

        const newItems: GNericItemModel[] = [];
        for (const item of model.items) {
            const name = item.name ?? '';
            const text = item.text ?? '';
            const newItem = new GNericItemModel(item.id, name, text);
            newItems.push(newItem);
        }

        try {
            this.ngZone.runGuarded(() => {
                this.items = newItems;
            });
        } catch (error) {
            console.log('GNeric Char Sheet: error on model update in Item List');
        }

        this.listname.setValue(model.listname);
    }

    setEntryModel(model: any) {
        if(!this.validateEntryModel(model)) {
            // TODO: log
            return;
        }

        for (const item of this.items) {
            if(item.getId() == model.id) {
                try {
                    this.ngZone.runGuarded(() => {
                        item.setNameAndText(model.name, model.text);
                    });
                } catch (error) {
                    console.log('GNeric Char Sheet: error on model update in Item List Entry');
                }
                break;
            }
        }
    }
}