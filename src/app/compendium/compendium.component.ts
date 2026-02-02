import { Component, computed, Input, Signal, signal, WritableSignal } from "@angular/core";
import { GNericCompChapter } from "../compchapter/compchapter.component";
import { GNericCompendiumModel } from "./compendiummodel";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { GNericCompChapterModel } from "../compchapter/compchaptermodel";

@Component({
    selector: 'gneric-compendium',
    templateUrl: './compendium.component.html',
    imports: [GNericCompChapter, ReactiveFormsModule]
})
export class GNericCompendium {

    @Input() editable: boolean = true;
    @Input() isGM: boolean = false;
    chapterSelect = new FormControl();

    compModel: GNericCompendiumModel = new GNericCompendiumModel();
    currentChapter: WritableSignal<GNericCompChapterModel|undefined> = signal(undefined);

    selectChapter(): void {
        const id = this.chapterSelect.value ?? '';
        this.currentChapter.set(this.compModel.getChapterById(id));
    }

    getChapterName(): string {
        let x = this.currentChapter();
        if(x) {
            return x.getName();
        }
        else {
            return '- none -';
        }
    }
}