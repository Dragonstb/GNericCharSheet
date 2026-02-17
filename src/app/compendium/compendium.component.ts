import { Component, computed, ElementRef, inject, Input, output, Signal, signal, ViewChild, WritableSignal } from "@angular/core";
import { GNericCompChapter } from "../compchapter/compchapter.component";
import { GNericCompendiumModel } from "./compendiummodel";
import { FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { GNericCompChapterModel } from "../compchapter/compchaptermodel";
import { Utils } from "../../services/utils";
import { ActionTypes } from "../ActionTypes";
import { GNericDeletionModal } from "../deletionmodal/delmodal.component";
import { ElemTypes } from "../elemtypes";

@Component({
    selector: 'gneric-compendium',
    templateUrl: './compendium.component.html',
    imports: [GNericCompChapter, GNericDeletionModal, ReactiveFormsModule]
})
export class GNericCompendium {

    @Input() editable: boolean = true;
    @Input() isGM: boolean = false;
    @Input() compModel: GNericCompendiumModel = new GNericCompendiumModel();
    chapterSelect = new FormControl();
    newChapterInput = new FormControl('', [Validators.required, Validators.minLength(1)])
    @ViewChild('dialog') dialog!: GNericDeletionModal;

    currentChapter: WritableSignal<GNericCompChapterModel|undefined> = signal(undefined);
    gNericElemChangedEvent = output<object>();

    utils = inject(Utils);
    private idCounter = 0;
    private idKey = this.utils.getRandomString(4);

    selectChapter(): void {
        const id = this.chapterSelect.value ?? '';
        this.currentChapter.set(this.compModel.getChapterById(id));
    }

    createChapter(): void {
        const name = this.newChapterInput.value ?? '';
        const id = this.getNextId();
        const newChapter = new GNericCompChapterModel(id, name);
        this.compModel.addChapter(newChapter);
        this.newChapterInput.setValue('');
        this.chapterSelect.setValue(id);
        this.currentChapter.set(newChapter);
        this.fireCompendiumChangeEvent();
    }

    openDeleteDialog(): void {
        if(!this.currentChapter || !this.isGM) {
            return;
        }

        this.dialog.openDialog();
    }

    deleteChapter(): void {
        if(!this.currentChapter || !this.isGM) {
            return;
        }

        if(this.compModel.deleteChapterById(this.currentChapter()!.getId())) {
            if(this.compModel.chapters.length > 0) {
                const now = this.compModel.chapters[0];
                this.chapterSelect.setValue(now.getId());
                this.currentChapter.set(now);
            }
            else {
                this.chapterSelect.setValue(undefined);
                this.currentChapter.set(undefined);
            }

            this.fireCompendiumChangeEvent();
        }
    }

    checkCurrentChapter(): void {
        const chap = this.currentChapter();
        if(!chap) {
            return;
        }

        const chapId = chap.getId();
        let needsUpdate: boolean = true;
        for (const chapter of this.compModel.chapters) {
            if(chapter.getId() === chapId) {
                needsUpdate = false; // currently displayed chapter still exists
                break;
            }
        }

        if(needsUpdate) {
            this.chapterSelect.setValue(undefined);
            this.currentChapter.set(undefined);
        }
    }

    getNextId(): string {
        const num = this.idCounter++;
        return 'compchapter-'+this.idKey+'-'+String(num);
    }

    fireCompendiumChangeEvent(): void {
        const model = this.compModel.getModel();
        const json = {...model, action: ActionTypes.compendiumupdate}
        this.gNericElemChangedEvent.emit(json);
    }

    reactOnChange(content: object): void {
        const json = {
            type: ElemTypes.compendium,
            action: ActionTypes.compchapterupdate,
            model: content
        }

        this.gNericElemChangedEvent.emit(json);
    }
}