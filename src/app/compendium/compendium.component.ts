import { Component, computed, inject, Input, Signal, signal, WritableSignal } from "@angular/core";
import { GNericCompChapter } from "../compchapter/compchapter.component";
import { GNericCompendiumModel } from "./compendiummodel";
import { FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { GNericCompChapterModel } from "../compchapter/compchaptermodel";
import { Utils } from "../../services/utils";
import { ActionTypes } from "../ActionTypes";

@Component({
    selector: 'gneric-compendium',
    templateUrl: './compendium.component.html',
    imports: [GNericCompChapter, ReactiveFormsModule]
})
export class GNericCompendium {

    @Input() editable: boolean = true;
    @Input() isGM: boolean = false;
    chapterSelect = new FormControl();
    newChapterInput = new FormControl('', [Validators.required, Validators.minLength(1)])

    compModel: GNericCompendiumModel = new GNericCompendiumModel();
    currentChapter: WritableSignal<GNericCompChapterModel|undefined> = signal(undefined);

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

    getNextId(): string {
        const num = this.idCounter++;
        return 'compchapter-'+this.idKey+'-'+String(num);
    }

    fireCompendiumChangeEvent(): void {
        const model = this.compModel.getModel();
        const json = {...model, action: ActionTypes.compendiumupdate}
        // TODO: fire update
        console.log('compendium update');
        console.dir(json);
    }
}