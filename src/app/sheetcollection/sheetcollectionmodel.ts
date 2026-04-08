import { ValidatorService } from "../../services/validator";
import { ActionTypes } from "../ActionTypes";
import { ElemTypes } from "../elemtypes";
import { GNericSheetModel } from "../sheet/sheetmodel";

export class GNericSheetCollectionModel {

    // TODO: use map with ids as keys
    sheets: GNericSheetModel[] = [];

    // _______________  changes  _______________

    addSheet(newSheet: GNericSheetModel): void {
        this.sheets.push(newSheet);
    }

    removeSheet(id: string): boolean {
        for (let idx = 0; idx < this.sheets.length; idx++) {
            const sheet = this.sheets[idx];
            if(sheet.getId() === id) {
                this.sheets.splice(idx, 1);
                return true;
            }
        }

        return false;
    }

    // _______________  getters  _______________

    getSheetById(id: string): GNericSheetModel | undefined {
        for (const sheet of this.sheets) {
            if(sheet.getId() === id) {
                return sheet;
            }            
        }

        return undefined;
    }

    getModel(): object {
        const sheetModels: object[] = [];
        this.sheets.forEach(sheet => {
            const mdl = sheet.getModel();
            sheetModels.push(mdl);
        });

        return {
            type: ElemTypes.sheetcollection,
            content: sheetModels
        }
    }

    getModelRestrainedToSheets(sheetIds: Set<string>): object {
        const sheetModels: object[] = [];
        this.sheets.forEach(sheet => {
            const mdl = sheet.getModel() as any;
            if(ValidatorService.hasNonEmptyStringProperty('id', mdl) && sheetIds.has(mdl.id)) {
                sheetModels.push(mdl);
            }
        });

        return {
            type: ElemTypes.sheetcollection,
            content: sheetModels
        }
    }

    // _______________  update  _______________

    updateModel(model: any): boolean {
        if(!this.validateBaseModel(model)) {
            return false;
        }

        let ok = false;
        if(model.action === ActionTypes.collectionupdate) {
            ok = this.updateCollection(model);
        }
        else if(model.action === ActionTypes.sheetupdate) {
            if(model.hasOwnProperty('model') && model.model && typeof model.model === 'object') {
                ok = this.updateSheet(model.model);
            }
        }

        return ok;
    }

    updateCollection(model: any): boolean {
        if(!this.validateCollectionLevelModel(model)) {
            return false;
        }

        const newSheets: GNericSheetModel[] = [];
        for (const sheet of model.content) {
            const mod = {...sheet, action: ActionTypes.sheetupdate};
            const newSheet = new GNericSheetModel(mod.id);
            const ok = newSheet.updateModel(mod);
            if(!ok) {
                return false;
            }
            newSheets.push(newSheet);
        }

        this.sheets = newSheets;
        return true;
    }

    updateSheet(model: any): boolean {
        if(!ValidatorService.hasNonEmptyStringProperty('id', model)) {
            return false;
        }

        for (const sheet of this.sheets) {
            if(sheet.getId() === model.id) {
                return sheet.updateModel(model);
            }
        }

        return false;
    }

    // _______________  merge  _______________

    mergeSheets(model: any): boolean {
        if(!this.validateBaseModel(model)) {
            return false;
        }

        const newSheetsData: Array<any> = this.validateCollectionLevelModelIndividual(model);
        if(newSheetsData.length < 1) {
            return false;
        }

        let hadMerges = false;
        for (const sheet of newSheetsData) {
            const mod = {...sheet, action: ActionTypes.sheetupdate};
            const newSheet = new GNericSheetModel(mod.id);
            const ok = newSheet.updateModel(mod);
            if(!ok) {
                continue;
            }
            this.sheets.push(newSheet);
            hadMerges = true;
        }

        return hadMerges;
    }

    // _______________  validate  _______________

    validateBaseModel(model: any): boolean {
        if(!ValidatorService.isModel(model)) {
            return false;
        }

        if(!ValidatorService.hasNonEmptyStringProperty('type', model)) {
            return false;
        }

        if(model.type !== ElemTypes.sheetcollection) {
            return false;
        }

        if(!ValidatorService.hasNonEmptyStringProperty('action', model)) {
            return false;
        }

        return true;
    }

    validateCollectionLevelModel(model: any): boolean {
        if(!model.hasOwnProperty('content') || !Array.isArray(model.content)) {
            return false;
        }

        const idsInUse: Set<string> = new Set();
        for (const sheet of model.content) {
            if(typeof sheet !== 'object') {
                return false;
            }
            if(!ValidatorService.hasNonEmptyStringProperty('id', sheet)) {
                return false;
            }
            if(idsInUse.has(sheet.id)) {
                return false;
            }
            idsInUse.add(sheet.id);
        }

        return true;
    }

    validateCollectionLevelModelIndividual(model: any): Array<any> {
        // TODO: unit tests
        if(!model.hasOwnProperty('content') || !Array.isArray(model.content)) {
            return [];
        }

        // ids of existing sheets
        const idsInUse: Set<string> = new Set();
        this.sheets.forEach(sheet => {
            idsInUse.add(sheet.getId());
        });

        // get the new sheets we have to add
        const arr: Array<any> = [];
        for (const sheet of model.content) {
            if(typeof sheet !== 'object') {
                continue;
            }
            if(!ValidatorService.hasNonEmptyStringProperty('id', sheet)) {
                continue;
            }
            if(idsInUse.has(sheet.id)) {
                continue;
            }
            idsInUse.add(sheet.id);
            arr.push(sheet); // mark for further processing
        }

        return arr;
    }
}