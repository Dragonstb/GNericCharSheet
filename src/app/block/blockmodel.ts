import { ValidatorService } from "../../services/validator";
import { ActionTypes } from "../ActionTypes";
import { ElemTypes } from "../elemtypes";
import { TextfieldModel } from "../textfield/textfieldmodel";
import { ElemModel } from "./elemmodel";

export class GNericBlockModel {

    private id: string;
    private elems: ElemModel[] = [];

    constructor(id: string) {
        this.id = id;
    }

    getId(): string {
        return this.id;
    }

    addElem(elemModel: ElemModel): void {
        this.elems.push(elemModel);
    }

    deleteElemById(elemId: string): void {
        for (let idx = 0; idx < this.elems.length; idx++) {
            const elem = this.elems[idx];
            if(elem.getId() === elemId) {
                this.elems.splice(idx, 1);
                break;
            }
        }
    }

    getElems(): ElemModel[] {
        return this.elems;
    }
    setElems(newElems: ElemModel[]): void {
        this.elems = newElems;
    }

    getModel(): object {
        const elemModels: object[] = [];
        this.elems.forEach(elem => {
            const mod = elem.getModel();
            elemModels.push(mod);
        });
        return {
            id: this.id,
            type: ElemTypes.block,
            content: elemModels
        }
    }

    // _______________ update _______________

    updateModel(model: any): boolean {
        if(!this.validateBaseModel(model)) {
            return false;
        }

        let ok: boolean = false;
        if(model.action === ActionTypes.elemupdate) {
            ok = this.updateElement(model.model ?? undefined);
        }
        else if(model.action === ActionTypes.blockupdate) {
            ok = this.updateBlock(model);
        }
        // otherwise do nothing
        return ok;
    }

    /** Updates the model of an existing child element.
     * 
     * @param model New model
     * @returns None
     */
    updateElement(model: any): boolean {
        if(!ValidatorService.isModel(model) || !ValidatorService.hasNonEmptyStringProperty('id', model)) {
            return false;
        }
        const targetId = model.id;

        for (const elem of this.elems) {
            if(elem.getId() === targetId()) {
                return elem.updateModel(model);
            }
        }

        return true;
    }

    /** Adds or removes child elements.
     * 
     */
    updateBlock(model: any): boolean {
        if(!this.validateEntireModelLevel(model)) {
            return false;
        }

        const newElems: ElemModel[] = [];
        for (const entry of model.content) {
            switch(entry.type) {
                case ElemTypes.textfield:
                    const newElem = new TextfieldModel(entry.id);
                    const ok = newElem.updateModel(entry);
                    if(!ok) {
                        return false; // invalid model, ignore entire update
                    }
                    newElems.push(newElem);
                    break;
            }
        }

        this.elems = newElems;
        return true;
    }

    // _______________ validate _______________

    validateBaseModel(model: any): boolean {
        if(!ValidatorService.isModel(model)) {
            return false;
        }

        if(!ValidatorService.isForMe(this.getId(), ElemTypes.block, model)) {
            return false;
        }

        if(!ValidatorService.hasNonEmptyStringProperty('action', model)) {
            return false;
        }

        return true;
    }

    validateEntireModelLevel(model: any): boolean {
        if(!model.hasOwnProperty('content') || !model.content || !Array.isArray(model.content)) {
            return false;
        }

        for (const entry of model.content) {
            if(typeof entry !== 'object') {
                return false;
            }
            if(!ValidatorService.hasNonEmptyStringProperty('id', entry)) {
                return false;
            }
            if(!ValidatorService.hasNonEmptyStringProperty('type', entry)) {
                return false;
            }
            if(!ValidatorService.isCoreElemType(entry.type)) {
                return false;
            }
        }

        return true;
    }

}