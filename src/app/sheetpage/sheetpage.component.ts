import { Component, inject, viewChildren } from "@angular/core";
import { GNericBlockModel } from "./blockmodel";
import { GNericBlock } from "../block/block.component";
import { Utils } from "../../services/utils";

@Component({
    selector: 'gneric-sheetpage',
    templateUrl: './sheetpage.component.html',
    imports: [GNericBlock]
})
export class GNericSheetPage {

    id: string = 'page-0';
    blockElems = viewChildren(GNericBlock);

    utils = inject(Utils);

    idCounter: number = 0;
    idKey = this.utils.getRandomString(4);

    blocks: GNericBlockModel[] = [
        new GNericBlockModel(this.getNextId()),
        new GNericBlockModel(this.getNextId())
    ];

    setEditable(editable: boolean) {
        this.blockElems().forEach(block => {
            block.setEditable(editable);
        });
    }

    getNextId(): string {
        const num = this.idCounter++;
        return this.id+'-'+this.idKey+'-'+String(num);
    }

}