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

    // _______________  receive changes  _______________

    validateBaseModel(model: any):boolean {
        if(!ValidatorService.isModel(model)) {
            return false;
        }

        if(!ValidatorService.isForMe(this.pageModel.getId(), ElemTypes.page, model)) {
            return false;
        }

        if(!ValidatorService.hasNonEmptyStringProperty('action', model)) {
            return false;
        }

        return true;
    }

    validatePageModel(model: any): boolean {
        if(!model.hasOwnProperty('content') || !Array.isArray(model.content)) {
            return false;
        }

        const idsInUse: Set<string> = new Set();
        for (const block of model.content) {
            if(typeof block !== 'object') {
                return false;
            }
            if(!ValidatorService.hasNonEmptyStringProperty('id', block)) {
                return false;
            }
            if(idsInUse.has(block.id)) {
                return false;
            }
            idsInUse.add(block.id);
        }

        return true;
    }

    setModel(model: any): void {
        if(!this.validateBaseModel(model)) {
            return;
        }

        if(model.action === ActionTypes.blockupdate) {
            if(model.hasOwnProperty('model') && model.model && typeof model.model === 'object') {
                this.updateBlock(model.model);
            }
        }
        else if(model.action == ActionTypes.pageupdate) {
            this.updatePage(model);
        }
    }

    updateBlock(model: any): void {
        if(!ValidatorService.hasNonEmptyStringProperty('id', model)) {
            return;
        }

        for (const block of this.pageModel.getBlocks()) {
            if(block.getId() === model.id) {
                block.updateModel(model);
                return;
            }
        }
    }

    updatePage(model: any): void {
        if(!this.validatePageModel(model)) {
            return;
        }

        const newBlocks: GNericBlockModel[] = [];
        for (const block of model.content) {
            newBlocks.push(
                new GNericBlockModel(block.id)
            );
        }

        try {
            this.ngZone.runGuarded(() => {
                this.pageModel.setBlocks(newBlocks);
                setTimeout(() => this.setEditable(this.editable()));
            });
        } catch (error) {
            console.log('GNeric Char Sheet: error when updating a page of a sheet');
        }
    }

}