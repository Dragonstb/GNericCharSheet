import { Component, inject } from "@angular/core";
import { GNericPageModel } from "../sheetpage/pagemodel";
import { Utils } from "../../services/utils";
import { GNericSheetPage } from "../sheetpage/sheetpage.component";

@Component({
    selector: 'gneric-sheet',
    templateUrl: './sheet.component.html',
    imports: [GNericSheetPage]
})
export class GNericSheet {

    id: string = 'sheet-0';
    utils = inject(Utils);

    private idCounter: number = 0;
    idKey = this.utils.getRandomString(4);

    pages: GNericPageModel[] = [
        new GNericPageModel(this.getNextId(), 'General'),
        new GNericPageModel(this.getNextId(), 'Items'),
        new GNericPageModel(this.getNextId(), 'Spells'),
    ]

    curPageId: string = this.pages[0].getId();

    getNextId(): string {
        const num = this.idCounter++;
        return this.id+'-'+this.idKey+'-'+String(num);
    }

    showPage(pageId: string) {
        this.curPageId = pageId;
    }
}