import { Component, inject, signal, viewChildren } from "@angular/core";
import { Utils } from "../../services/utils";
import { GNericSheetPage } from "../sheetpage/sheetpage.component";
import { GNericSheetModel } from "./sheetmodel";
import { FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { GNericPageModel } from "../sheetpage/pagemodel";
import { timeout } from "rxjs";

@Component({
    selector: 'gneric-sheet',
    templateUrl: './sheet.component.html',
    imports: [GNericSheetPage, ReactiveFormsModule]
})
export class GNericSheet {

    sheetModel: GNericSheetModel = new GNericSheetModel('char-0', 'Alex Anyone');

    utils = inject(Utils);
    private idCounter: number = 0;
    idKey = this.utils.getRandomString(4);

    newPageTitle = new FormControl('', [Validators.required, Validators.minLength(1)]);
    curPageId: string | null = this.sheetModel.getPages().length > 0 ? this.sheetModel.getPages()[0].getId() : null;

    editable = signal(true);
    pages = viewChildren(GNericSheetPage);

    getNextId(): string {
        const num = this.idCounter++;
        return this.sheetModel.getId()+'-'+this.idKey+'-'+String(num);
    }

    showPage(pageId: string) {
        if(pageId) {
            this.curPageId = pageId;
            // TODO: pass editable as @Input to the pages
            setTimeout(()=>{
                this.pages().forEach(page => {
                    page.setEditable(this.editable());
                });
            });
        }
    }

    setEditable(editable: boolean): void {
        this.editable.set(editable);
        this.pages().forEach(page => {
            page.setEditable(this.editable());
        });
    }

    // _______________ change sheet _______________

    addPage(): void {
        const title = this.newPageTitle.value;
        if(!title) {
            return;
        }

        const id = this.getNextId();
        const page = new GNericPageModel(id, title);
        this.sheetModel.addPage(page);
        if(this.sheetModel.getPages().length == 1) {
            this.showPage(this.sheetModel.getPages()[0].getId()); 
        }
    }
}