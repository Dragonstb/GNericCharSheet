import { Component, Input } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { GNericCompChapterModel } from "./compchaptermodel";
import { GNericItemList } from "../itemlist/itemlist.component";

@Component({
    selector: 'gneric-compchapter',
    templateUrl: './compchapter.component.html',
    imports: [ReactiveFormsModule, GNericItemList]
})
export class GNericCompChapter {

    @Input() editable: boolean = true;
    chapterSelect = new FormControl();

    chapters: GNericCompChapterModel[] = [
        new GNericCompChapterModel('chapter 0', 'Fire spells'),
        new GNericCompChapterModel('chapter 1', 'Cold spells'),
    ]

    currentChapter: GNericCompChapterModel | undefined = undefined;

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

    doNothingForNow(arg: any) {
        
    }
}