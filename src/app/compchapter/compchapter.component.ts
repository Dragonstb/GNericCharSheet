import { Component, inject, Input, output, signal, ViewChild, WritableSignal } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { GNericCompChapterModel } from "./compchaptermodel";
import { GNericItemList } from "../itemlist/itemlist.component";
import { ActionTypes } from "../ActionTypes";
import { Utils } from "../../services/utils";
import { ItemListModel } from "../itemlist/itemlistmodel";
import { ElemTypes } from "../elemtypes";
import { GNericDeletionModal } from "../deletionmodal/delmodal.component";

@Component({
    selector: 'gneric-compchapter',
    templateUrl: './compchapter.component.html',
    imports: [ReactiveFormsModule, GNericItemList, GNericDeletionModal]
})
export class GNericCompChapter {

    @Input() editable: boolean = true;
    @Input() isGM: boolean = false;
    @Input() chapter: GNericCompChapterModel | undefined = undefined;

    utils = inject(Utils);
    private idCounter = 0;
    private idKey = this.utils.getRandomString(4);

    gNericElemChangedEvent = output<object>();

    toBeDeleted: WritableSignal<ItemListModel | undefined> = signal(undefined);
    @ViewChild('dialog') dialog!: GNericDeletionModal;

    addItemList(): void {
        if(!this.chapter || !this.isGM) {
            return;
        }

        const id = this.getNextId();
        const list = new ItemListModel(id, 'untitled');
        this.chapter.addNewList(list);
        this.fireChapterUpdateEvent();
    }

    openDeleteListDialog(listId: string): void {
        if(!this.chapter || !this.isGM) {
            return;
        }

        this.toBeDeleted.set(this.chapter.getListById(listId));
        if(this.toBeDeleted()) {
            this.dialog.openDialog();
        }
    }
    
    deleteItemList(): void {
        if(!this.chapter || !this.isGM || !this.toBeDeleted()) {
            return;
        }

        const listId = this.toBeDeleted()!.getId();
        this.toBeDeleted.set(undefined);
        let ok = this.chapter.deleteById(listId);
        if(ok) {
            this.fireChapterUpdateEvent();
        }
    }

    getNextId(): string {
        const num = this.idCounter++;
        return 'compendium-'+this.idKey+'-'+String(num);
    }

    getToBeDeletedTitle(): string {
        return this.toBeDeleted() ? this.toBeDeleted()!.getTitle() : '';
    }

    fireChapterPatchEvent(): void {
        if(!this.chapter) {
            return;
        }

        const json = {
            id: this.chapter.getId(),
            type: ElemTypes.compchapter,
            name: this.chapter.getName(),
            action: ActionTypes.compchapterpatch
        }

        this.gNericElemChangedEvent.emit(json);
    }

    fireChapterUpdateEvent(): void {
        if(!this.chapter) {
            return;
        }

        const model = this.chapter.getModel();
        const json = {...model, action: ActionTypes.compchapterupdate}
        this.gNericElemChangedEvent.emit(json);
    }

    reactOnChange(model: object) {
        if(!this.chapter) {
            return;
        }

        const json = {
            id: this.chapter.getId(),
            type: ElemTypes.compchapter,
            action: ActionTypes.elemupdate,
            model: model
        }

        this.gNericElemChangedEvent.emit(json);
    }
}