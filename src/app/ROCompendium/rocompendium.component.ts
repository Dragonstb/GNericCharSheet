import { Component, inject, output, signal, WritableSignal } from "@angular/core";
import { CompendiumService } from "../../services/compendium";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { GNericCompChapterModel } from "../compchapter/compchaptermodel";
import { ItemListModel } from "../itemlist/itemlistmodel";
import { GNericRoItemlist } from "./roitemlist.component";
import { TranslatePipe } from "@ngx-translate/core";

@Component({
    selector: 'gneric-ro-compendium',
    templateUrl: './rocompendium.component.html',
    imports: [ReactiveFormsModule, GNericRoItemlist, TranslatePipe]
})
export class GNericRoCompendium {

    /* Cant't use a Compendium in the AddItemModal: would introduce circular dependency
     * As quick-and-dirty solution comes this read-only compendium
     * Once I have more time again, I'll come up with a better solution.
     */

    compModel = inject(CompendiumService).getCompendium();
    chapterSelect = new FormControl();
    currentChapter: WritableSignal<GNericCompChapterModel|undefined> = signal(undefined);
    selectItemEvent = output<object>();

    selectChapter(): void {
        const id = this.chapterSelect.value ?? '';
        this.currentChapter.set(this.compModel.getChapterById(id));
    }

    getCurrentChapterLists(): ItemListModel[] {
        return this.currentChapter() ? this.currentChapter()!.lists : [];
    }

    bubbleSelectItemEvent(json: object): void {
        this.selectItemEvent.emit(json);
    }

}