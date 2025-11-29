import { Component, inject, viewChildren, ViewChild, output, signal, NgZone } from "@angular/core";
import { GNericBlockModel } from "./blockmodel";
import { GNericBlock } from "../block/block.component";
import { Utils } from "../../services/utils";
import { GNericDeletionModal } from "../deletionmodal/delmodal.component";
import { ElemTypes } from "../elemtypes";
import { ActionTypes } from "../ActionTypes";
import { ValidatorService } from "../../services/validator";
import { EmitFlags, ModifierFlags } from "typescript";

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
    validator = inject(ValidatorService);
    ngZone = inject(NgZone);

    idCounter: number = 0;
    idKey = this.utils.getRandomString(4);
    nextToBeDeleted: string | undefined = undefined;

    blocks: GNericBlockModel[] = [];

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

    validateBaseModel(model: any):boolean {
        if(!this.validator.isModel(model)) {
            return false;
        }

        if(!this.validator.isForMe(this.id, ElemTypes.page, model)) {
            return false;
        }

        if(!this.validator.hasNonEmptyStringProperty('action', model)) {
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
            if(!this.validator.hasNonEmptyStringProperty('id', block)) {
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
        if(!this.validator.hasNonEmptyStringProperty('id', model)) {
            return;
        }

        for (const block of this.blockElems()) {
            if(block.getId() === model.id) {
                block.setModel(model);
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
                this.blocks = newBlocks;
                setTimeout(() => this.setEditable(this.editable()));
            });
        } catch (error) {
            console.log('GNeric Char Sheet: error when updating a page of a sheet');
        }
    }

}