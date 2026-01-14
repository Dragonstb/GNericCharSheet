import { ActionTypes } from "../ActionTypes";
import { ElemTypes } from "../elemtypes";
import { GNericBlockModel } from "../block/blockmodel";
import { ValidatorService } from "../../services/validator";

export class GNericPageModel {

    private id: string;
    private title: string;
    private blocks: GNericBlockModel[] = [];

    constructor(id: string, title: string | undefined) {
        this.id = id;
        this.title = title ?? id;
    }

    getId(): string {
        return this.id;
    }

    getTitle(): string {
        return this.title;
    }

    setTitle(title: string): void {
        this.title = title;
    }

    addBlock(block: GNericBlockModel): void {
        this.blocks.push(block);
    }

    getBlocks(): GNericBlockModel[] {
        return this.blocks;
    }

    setBlocks(newBlocks: GNericBlockModel[]): void {
        this.blocks = newBlocks;
    }

    deleteBlockById(blockId: string): void {
        for (let idx = 0; idx < this.blocks.length; idx++) {
            const block = this.blocks[idx];
            if(block.getId() === blockId) {
                this.blocks.splice(idx, 1);
                break;
            }
        }
    }

    getModel(): object {
        const arr: object[] = [];
        this.blocks.forEach(block => {
            arr.push(
                block.getModel()
            );
        });

        const json = {
            id: this.getId(),
            type: ElemTypes.page,
            title: this.title,
            content: arr
        };

        return json;
    }

    // _______________ update _______________

    updateModel(model: any): boolean {
        if(!this.validateBaseModel(model)) {
            return false;
        }

        let ok = false;
        if(model.action === ActionTypes.blockupdate) {
            if(model.hasOwnProperty('model') && model.model && typeof model.model === 'object') {
                ok = this.updateBlock(model.model);
            }
        }
        else if(model.action == ActionTypes.pageupdate) {
            ok = this.updatePage(model);
        }

        return ok;
    }

    updateBlock(model: any): boolean {
        if(!ValidatorService.hasNonEmptyStringProperty('id', model)) {
            return false;
        }

        for (const block of this.blocks) {
            if(block.getId() === model.id) {
                return block.updateModel(model);
            }
        }

        return true;
    }

    updatePage(model: any): boolean {
        if(!this.validatePageModelLevel(model)) {
            return false;
        }

        const newBlocks: GNericBlockModel[] = [];
        for (const block of model.content) {
            const mod = {...block, action: ActionTypes.blockupdate};
            const newBlock = new GNericBlockModel(mod.id);
            const ok = newBlock.updateModel(mod);
            if(!ok) {
                return false;
            }
            newBlocks.push(newBlock);
        }

        this.blocks = newBlocks;
        this.title = model.title;
        return true;
    }

    // _______________ validate _______________

    validateBaseModel(model: any):boolean {
        if(!ValidatorService.isModel(model)) {
            return false;
        }

        if(!ValidatorService.isForMe(this.getId(), ElemTypes.page, model)) {
            return false;
        }

        if(!ValidatorService.hasNonEmptyStringProperty('action', model)) {
            return false;
        }

        return true;
    }

    validatePageModelLevel(model: any): boolean {
        if(!model.hasOwnProperty('content') || !Array.isArray(model.content)) {
            return false;
        }

        if(!ValidatorService.hasNonEmptyStringProperty('title', model)) {
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

}