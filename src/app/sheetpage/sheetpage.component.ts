import { Component, inject, viewChildren, ViewChild, output, signal, NgZone, Input } from "@angular/core";
import { GNericBlockModel } from "../block/blockmodel";
import { GNericBlock } from "../block/block.component";
import { Utils } from "../../services/utils";
import { GNericDeletionModal } from "../deletionmodal/delmodal.component";
import { ElemTypes } from "../elemtypes";
import { ActionTypes } from "../ActionTypes";
import { ValidatorService } from "../../services/validator";
import { GNericPageModel } from "./pagemodel";

@Component({
    selector: 'gneric-sheetpage',
    templateUrl: './sheetpage.component.html',
    imports: [GNericBlock, GNericDeletionModal]
})
export class GNericSheetPage {

    @Input() pageModel: GNericPageModel = new GNericPageModel('page-0', 'Page 0');
    blockElems = viewChildren(GNericBlock);
    editable = signal(true);
    @ViewChild('dialog') dialog!: GNericDeletionModal;

    utils = inject(Utils);
    ngZone = inject(NgZone);

    idCounter: number = 0;
    idKey = this.utils.getRandomString(4);
    nextToBeDeleted: string | undefined = undefined;

    gNericElemChangedEvent = output<object>();

    setEditable(editable: boolean) {
        this.editable.set(editable);
        this.blockElems().forEach(block => {
            block.setEditable(editable);
        });
    }

    getNextId(): string {
        const num = this.idCounter++;
        return this.pageModel.getId()+'-'+this.idKey+'-'+String(num);
    }

    // _______________  change page  _______________

    addBlock(): void {
        const newId = this.getNextId();
        const newBlock = new GNericBlockModel(newId);
        this.pageModel.addBlock(newBlock);
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

        this.pageModel.deleteBlockById(blockId);
        this.reactOnPageUpdate();
    }

    // _______________  broadcast changes  _______________

    reactOnBlockUpdate(model: object):void {
        const json = {
            id: this.pageModel.getId(),
            type: ElemTypes.page,
            action: ActionTypes.blockupdate,
            model: model
        }
        this.gNericElemChangedEvent.emit(json);
    }

    reactOnPageUpdate(): void {
        const model = this.pageModel.getModel();
        const json = {...model, action: ActionTypes.pageupdate};

        this.gNericElemChangedEvent.emit(json);
    }

}