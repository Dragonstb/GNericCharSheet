import { FormControl } from "@angular/forms";
import { ItemListModel } from "../itemlist/itemlistmodel";
import { ElemTypes } from "../elemtypes";
import { ActionTypes } from "../ActionTypes";
import { ValidatorService } from "../../services/validator";

export class GNericCompChapterModel {

    private id : string;
    name = new FormControl('');
    lists: ItemListModel[] = [];

    constructor(id: string, name: string | undefined) {
        this.id = id;
        this.name.setValue(name ?? id);
        
        let list: ItemListModel;
        list = new ItemListModel(id+'_level-0', 'Level 0 spells');
        this.lists.push(list);

        list = new ItemListModel(id+'_level-1', 'Level 1 spells');
        this.lists.push(list);

        list = new ItemListModel(id+'_level-2', 'Level 2 spells');
        this.lists.push(list);

    }

    getId(): string {
        return this.id;
    }

    getName(): string {
        return this.name.value ?? '';
    }

    addNewList(list: ItemListModel): void {
        // TODO: duplicate key check
        this.lists.push(list);
    }

    deleteById(listId: string): boolean {
        for (let idx = 0; idx < this.lists.length; idx++) {
            const list = this.lists[idx];
            if(list.getId() === listId) {
                this.lists.splice(idx, 1);
                return true;
            }
        }

        return false;
    }

    getModel(): object {
        const arr: object[] = [];
        this.lists.forEach(list => {
            const mdl = list.getModel();
            arr.push(mdl);
        });

        return {
            id: this.getId(),
            name: this.getName(),
            type: ElemTypes.compchapter,
            lists: arr
        }
    }

    // _______________  update  _______________

    updateModel(model: any): boolean {
        if(!this.validateBaseModel(model)) {
            return false;
        }

        let ok = false;
        if(model.action === ActionTypes.compchapterupdate) {
            ok = this.updateCompChapter(model);
        }
        else if(model.action === ActionTypes.compchapterpatch) {
            ok = this.patchCompChapter(model);
        }
        else if(model.action === ActionTypes.elemupdate) {
            if(model.hasOwnProperty('model') && model.model && typeof model.model === 'object') {
                ok = this.updateItemList(model.model);
            }
        }

        return ok;
    }

    updateCompChapter(model: any): boolean {
        if(!this.validateChapterLevelModel(model)) {
            return false;
        }

        const newLists: ItemListModel[] = [];
        for (const list of model.lists) {
            const mod = {...list, action: ActionTypes.sheetupdate};
            const newList = new ItemListModel(mod.id);
            const ok = newList.updateModel(mod);
            if(!ok) {
                return false;
            }
            newLists.push(newList);
        }

        this.lists = newLists;
        return true;
    }

    patchCompChapter(model: any): boolean {
        if(!this.validateChapterPatchModel(model)) {
            return false;
        }

        this.name.setValue(model.name);
        return true;
    }

    updateItemList(model: any): boolean {
        if(!ValidatorService.hasNonEmptyStringProperty('id', model)) {
            return false;
        }

        for (const list of this.lists) {
            if(list.getId() === model.id) {
                return list.updateModel(model);
            }
        }

        return false;
    }

    // _______________  validate  _______________

    validateBaseModel(model: any): boolean {
        if(!ValidatorService.isModel(model)) {
            return false;
        }

        if(!ValidatorService.hasNonEmptyStringProperty('type', model)) {
            return false;
        }

        if(model.type !== ElemTypes.compchapter) {
            return false;
        }

        if(!ValidatorService.hasNonEmptyStringProperty('action', model)) {
            return false;
        }

        return true;
    }

    validateChapterPatchModel(model: any): boolean {
        if(!ValidatorService.hasNonEmptyStringProperty('name', model)) {
            return false;
        }

        return true;
    }

    validateChapterLevelModel(model: any): boolean {
        if(!this.validateChapterPatchModel(model)) {
            return false;
        }

        if(!model.hasOwnProperty('lists') || !Array.isArray(model.lists)) {
            return false;
        }

        const idsInUse: Set<string> = new Set();
        for (const list of model.lists) {
            if(typeof list !== 'object') {
                return false;
            }
            if(!ValidatorService.hasNonEmptyStringProperty('id', list)) {
                return false;
            }
            if(idsInUse.has(list.id)) {
                return false;
            }
            idsInUse.add(list.id);
        }

        return true;
    }

}