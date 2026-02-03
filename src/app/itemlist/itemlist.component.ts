import { Component, Input, output, signal, ViewChild } from "@angular/core";
import { GNericItemEntry } from "./itementry.component";
import { GNericItemModel } from "./itemmodel";
import { ReactiveFormsModule } from "@angular/forms";
import { GNericAddItemModal } from "./additemmodal.component";
import { ElemTypes } from "../elemtypes";
import { ItemListModel } from "./itemlistmodel";
import { ElemModel } from "../block/elemmodel";

@Component({
    selector: 'gneric-itemlist',
    templateUrl: './itemlist.component.html',
    imports: [GNericItemEntry, GNericAddItemModal, ReactiveFormsModule]
})
export class GNericItemList {

    elemModel: ItemListModel = new ItemListModel("comp-04-04");

    @Input()
    set elem(val: ElemModel) {
        if(val instanceof ItemListModel) {
            this.elemModel = val;
        }
    }
    @ViewChild('modal') modal!: GNericAddItemModal;

    deleteCoreElemEvent = output<string>();
    gNericElemChangedEvent = output<object>();

    @Input() editable: boolean = true;
    @Input() extendable: boolean = true;
    expanded = signal(false);

    toggleExpansion(): void {
        this.expanded.update(val => !val);
    }

    handleAddNewEntry(): void {
        this.modal.openDialog();
    }

    addNewItem(item: GNericItemModel): void {
        this.elemModel.addNewItem(item);
        this.fireListChangeEvent();
    }

    deleteItem(itemId: string): void {
        const deleted = this.elemModel.deleteItem(itemId);
        if(deleted) {
            this.fireListChangeEvent();
        }
    }

    fireDeleteItemlistEvent(): void {
        this.deleteCoreElemEvent.emit(this.elemModel.getId());
    }

    fireEntryChangeEvent(json: object) {
        this.gNericElemChangedEvent.emit(json);
    }

    fireListChangeEvent(): void {
        const model = this.elemModel.getModel();
        this.gNericElemChangedEvent.emit(model);
    }

    getType(): ElemTypes {
        return ElemTypes.itemlist;
    }

    getId(): string {
        return this.elemModel.getId();
    }

    getTitle(): string {
        return this.elemModel.getTitle();
    }

    getBackupedTitle(): string {
        const title = this.elemModel.getTitle();
        return title && title.length > 0 ? title : 'list';
    }
}