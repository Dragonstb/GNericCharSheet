import { Component, inject, Input } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { GNericCompChapterModel } from "./compchaptermodel";
import { GNericItemList } from "../itemlist/itemlist.component";
import { ActionTypes } from "../ActionTypes";
import { Utils } from "../../services/utils";
import { ItemListModel } from "../itemlist/itemlistmodel";
import { ElemTypes } from "../elemtypes";

@Component({
    selector: 'gneric-compchapter',
    templateUrl: './compchapter.component.html',
    imports: [ReactiveFormsModule, GNericItemList]
})
export class GNericCompChapter {

    @Input() editable: boolean = true;
    @Input() isGM: boolean = false;
    chapterSelect = new FormControl();

    chapters: GNericCompChapterModel[] = [
        new GNericCompChapterModel('chapter 0', 'Fire spells'),
        new GNericCompChapterModel('chapter 1', 'Cold spells'),
    ]

    currentChapter: GNericCompChapterModel | undefined = undefined;
    utils = inject(Utils);
    private idCounter = 0;
    private idKey = this.utils.getRandomString(4);

    selectChapter(): void {
        const id = this.chapterSelect.value ?? '';
        for (const chapter of this.chapters) {
            if(chapter.getId() === id) {
                this.currentChapter = chapter;
                return;
            }
        }

        this.currentChapter = undefined;
    }

    addItemList(): void {
        if(!this.currentChapter || !this.isGM) {
            return;
        }

        const id = this.getNextId();
        const list = new ItemListModel(id, 'untitled');
        this.currentChapter.addNewList(list);
        this.fireChapterUpdateEvent();
    }

    deleteItemList(listId: string): void {
        if(!this.currentChapter || !this.isGM) {
            return;
        }

        console.log('deleting list '+listId);
        let ok = this.currentChapter.deleteById(listId);
        if(ok) {
            this.fireChapterUpdateEvent();
        }
    }

    getNextId(): string {
        const num = this.idCounter++;
        return 'compendium-'+this.idKey+'-'+String(num);
    }

    fireChapterUpdateEvent(): void {
        if(!this.currentChapter) {
            return;
        }

        const json = this.currentChapter.getModel();
        const model = {...json, action: ActionTypes.compchapterupdate}
        console.log('new model:');
        console.dir(model);
        // TODO: send model upwards for broadcasting
    }

    reactOnChange(model: object) {
        if(!this.currentChapter || !this.isGM) {
            return;
        }

        const json = {
            id: this.currentChapter.getId(),
            type: ElemTypes.compchapter,
            action: ActionTypes.elemupdate,
            content: model
        }
        // TODO: send upwards for broadcasting
        console.dir(json);
    }
}