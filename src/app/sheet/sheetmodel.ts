import { ValidatorService } from "../../services/validator";
import { ActionTypes } from "../ActionTypes";
import { ElemTypes } from "../elemtypes";
import { GNericPageModel } from "../sheetpage/pagemodel";

export class GNericSheetModel {

    private id: string;
    private charname: string;
    private pages: GNericPageModel[] = [];

    constructor(id: string, charname: string | undefined = undefined) {
        this.id = id;
        this.charname = charname ?? this.id;
        this.pages = [
            new GNericPageModel('page-0', 'General'),
            new GNericPageModel('page-1', 'Items'),
            new GNericPageModel('page-2', 'Spells')
        ]
    }

    getId(): string {
        return this.id;
    }

    getCharName(): string {
        return this.charname;
    }

    getPages(): GNericPageModel[] {
        return this.pages;
    }

    addPage(page: GNericPageModel): void {
        this.pages.push(page);
    }

    getModel(): object {
        const pageModels: object[] = [];
        this.pages.forEach(page => {
            pageModels.push(page.getModel());
        });

        return {
            id: this.id,
            name: this.charname,
            type: ElemTypes.sheet,
            content: pageModels
        }
    }

    // _______________ update _______________

    updateModel(model: any): boolean {
        if(!this.validateBaseModel(model)) {
            return false;
        }

        let ok = false;
        if(model.action === ActionTypes.pageupdate) {
            if(model.hasOwnProperty('model') && model.model && typeof model.model === 'object') {
                ok = this.updatePage(model.model);
            }
        }
        else if(model.action == ActionTypes.sheetupdate) {
            ok = this.updateSheet(model);
        }

        return ok;
    }

    updatePage(model: any): boolean {
        if(!ValidatorService.hasNonEmptyStringProperty('id', model)) {
            return false;
        }

        for (const page of this.pages) {
            if(page.getId() === model.id) {
                return page.updateModel(model);
            }
        }

        return true;
    }

    updateSheet(model: any): boolean {
        if(!this.validateSheetModelLevel(model)) {
            return false;
        }

        const newPages: GNericPageModel[] = [];
        for (const block of model.content) {
            const mod = {...block, action: ActionTypes.blockupdate};
            const newPage = new GNericPageModel(mod.id, undefined);
            const ok = newPage.updateModel(mod);
            if(!ok) {
                return false;
            }
            newPages.push(newPage);
        }

        this.pages = newPages;
        return true;
    }

    // _______________ validate _______________

    validateBaseModel(model: any):boolean {
        if(!ValidatorService.isModel(model)) {
            return false;
        }

        if(!ValidatorService.isForMe(this.getId(), ElemTypes.sheet, model)) {
            return false;
        }

        if(!ValidatorService.hasNonEmptyStringProperty('action', model)) {
            return false;
        }

        return true;
    }

    validateSheetModelLevel(model: any): boolean {
        if(!model.hasOwnProperty('content') || !Array.isArray(model.content)) {
            return false;
        }

        if(!ValidatorService.hasStringProperty('name', model)) {
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