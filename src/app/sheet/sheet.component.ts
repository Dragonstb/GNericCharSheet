import { Component, inject } from "@angular/core";
import { GNericPageModel } from "../sheetpage/pagemodel";
import { Utils } from "../../services/utils";
import { GNericSheetPage } from "../sheetpage/sheetpage.component";
import { GNericSheetModel } from "./sheetmodel";

@Component({
    selector: 'gneric-sheet',
    templateUrl: './sheet.component.html',
    imports: [GNericSheetPage]
})
export class GNericSheet {

    sheetModel: GNericSheetModel = new GNericSheetModel('char-0', 'Alex Anyone');

    utils = inject(Utils);
    private idCounter: number = 0;
    idKey = this.utils.getRandomString(4);

    curPageId: string | null = this.sheetModel.getPages().length > 0 ? this.sheetModel.getPages()[0].getId() : null;

    getNextId(): string {
        const num = this.idCounter++;
        return this.sheetModel.getId()+'-'+this.idKey+'-'+String(num);
    }

    showPage(pageId: string) {
        if(pageId) {
            this.curPageId = pageId;
        }
    }
}