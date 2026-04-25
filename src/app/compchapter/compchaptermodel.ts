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

    getListById(listId: string): ItemListModel | undefined {
        for (const list of this.lists) {
            if(list.getId() == listId) {
                return list;
            }
        }

        return undefined;
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
            const mod = {...list, action: ActionTypes.elemupdate};
            const newList = new ItemListModel(mod.id);
            const ok = newList.updateModel(mod);
            if(!ok) {
                return false;
            }
            newLists.push(newList);
        }

        this.lists = newLists;
        this.name.setValue(model.name);
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

    // _______________  merge  _______________

    /** Merges data from 'model' into 'this'. If 'model' contains a list with an id that already exists in 'this', the data is
     * merge into this list. A list in 'model' with an id that does not exist in 'this' is simply added to 'this'.
     * 
     * @param model A comp chapter model as json. May or may not contain an action entry, as it is (over)written anyway.
     * @returns If and only if changes are made, the json representation of a copy of this but just containing the lists where something has
     * been changed or added. Else 'null'.
     */
    mergeModel(model: any): object | null {
        if(!this.validateBaseModel(model)) {
            return null;
        }

        if(!this.validateChapterLevelModel(model)) {
            return null;
        }

        // TODO: action check

        const idsInUse: Set<string> = new Set();
        this.lists.forEach(list => {
            idsInUse.add(list.getId());
        });

        const upsertedLists: Array<object> = [];

        for (const list of model.lists) {
            if(idsInUse.has(list.id)) {
                // merge into existing list
                for (const oldList of this.lists) {
                    // TODO: use a map
                    if(oldList.getId() === list.id) {
                        const diffListModel = oldList.mergeModel(list);
                        if(diffListModel !== null) {
                            upsertedLists.push(diffListModel);
                        }
                        break;
                    }
                }
            }
            else {
                // add new list
                const listModel = new ItemListModel(list.id);
                const json = {...list, action: ActionTypes.elemupdate};
                const ok = listModel.updateModel(list);
                if(ok) {
                    this.lists.push(listModel);
                    upsertedLists.push(listModel.getModel());
                }
            }
        }

        // data reduction to new and modified lists
        if(upsertedLists.length > 0) {
            let diffModel = this.getModel();
            diffModel = {...diffModel, lists: upsertedLists};
            return diffModel;
        }
        else {
            return null;
        }
    }

    // _______________  validate  _______________

    validateBaseModel(model: any): boolean {
        if(!ValidatorService.isModel(model)) {
            return false;
        }

        if(!ValidatorService.isForMe(this.id, ElemTypes.compchapter, model)) {
            return false;
        }

        if(!ValidatorService.hasNonEmptyStringProperty('action', model)) {
            return false;
        }

        return true;
    }

    validateChapterPatchModel(model: any): boolean {
        if(!ValidatorService.hasStringProperty('name', model)) {
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