import { Component, inject, viewChildren, ViewChild, output, signal } from "@angular/core";
import { GNericBlockModel } from "./blockmodel";
import { GNericBlock } from "../block/block.component";
import { Utils } from "../../services/utils";
import { GNericDeletionModal } from "../deletionmodal/delmodal.component";
import { ElemTypes } from "../elemtypes";
import { ActionTypes } from "../ActionTypes";

@Component({
    selector: 'gneric-sheetpage',
    templateUrl: './sheetpage.component.html',
    imports: [GNericBlock, GNericDeletionModal]
})
export class GNericSheetPage {

    id: string = 'page-0';
    blockElems = viewChildren(GNericBlock);
    editable = signal(true);
    @ViewChild('dialog') dialog!: GNericDeletionModal;

    utils = inject(Utils);

    idCounter: number = 0;
    idKey = this.utils.getRandomString(4);
    nextToBeDeleted: string | undefined = undefined;

    blocks: GNericBlockModel[] = [
        new GNericBlockModel(this.getNextId()),
        new GNericBlockModel(this.getNextId())
    ];

    gNericElemChangedEvent = output<object>();

    setEditable(editable: boolean) {
        this.editable.set(editable);
        this.blockElems().forEach(block => {
            block.setEditable(editable);
        });
    }

    getNextId(): string {
        const num = this.idCounter++;
        return this.id+'-'+this.idKey+'-'+String(num);
    }

    // _______________  change page  _______________

    addBlock(): void {
        const newId = this.getNextId();
        const newBlock = new GNericBlockModel(newId);
        this.blocks.push(newBlock);
        this.reactOnPageUpdate();
    }

    openDeleteDialog(blockId: string) {
        this.nextToBeDeleted = blockId;
        this.dialog.openDialog();
    }

    deleteBlock(): void {
        if(!this.nextToBeDeleted) {
            return;
        }

        const blockId: string = this.nextToBeDeleted;
        this.nextToBeDeleted = undefined;

        for (let idx = 0; idx < this.blocks.length; idx++) {
            const block = this.blocks[idx];
            if(block.getId() === blockId) {
                this.blocks.splice(idx, 1);
                break;
            }
        }
        this.reactOnPageUpdate();
    }

    // _______________  broadcast changes  _______________

    reactOnBlockUpdate(model: object):void {
        const json = {
            id: this.id,
            type: ElemTypes.page,
            action: ActionTypes.blockupdate,
            model: model
        }
        this.gNericElemChangedEvent.emit(json);
    }

    reactOnPageUpdate(): void {
        const arr: object[] = [];
        this.blocks.forEach(block => {
            arr.push(
                block.getModel()
            );
        });

        const json = {
            id: this.id,
            type: ElemTypes.page,
            action: ActionTypes.pageupdate,
            content: arr
        };

        this.gNericElemChangedEvent.emit(json);
    }

    // _______________  receive changes  _______________


}