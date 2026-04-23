import { ValidatorService } from "../../services/validator";
import { ElemModel } from "../block/elemmodel";
import { ElemTypes } from "../elemtypes";
import { GNericItemModel } from "./itemmodel";

export class ItemListModel extends ElemModel {

    items: GNericItemModel[] = [];

    constructor(id: string, title: string = '') {
        super(id, title ?? '', ElemTypes.itemlist);
    }

    override getModel(): object {
        let itemModels: object[] = [];
        this.items.forEach(item => {
            itemModels.push(item.getModel());
        });

        return {
            id: this.getId(),
            type: ElemTypes.itemlist,
            listname: this.getTitle(),
            items: itemModels
        }
    }

    // _______________ change items _______________

    addNewItem(item: GNericItemModel): void {
        this.items.push(item);
    }

    deleteItem(itemId: string): boolean {
        for (let idx = 0; idx < this.items.length; idx++) {
            const item = this.items[idx];
            if(item.getId() === itemId) {
                this.items.splice(idx, 1);
                return true;
            }
        }

        return false;
    }

    // _______________ update _______________

    override updateModel(model: any): boolean {
        if(!ValidatorService.isModel(model)) {
            return false;
        }

        if(!model.hasOwnProperty('type') || typeof model.type !== 'string') {
            return false;
        }

        let ok = false;
        switch(model.type) {
            case ElemTypes.itemlist: ok = this.setListModel(model); break;
            case ElemTypes.itementry: ok = this.setEntryModel(model); break;
            // everything else: do nothing
        }
        return ok;
    }

    private setListModel(model: any): boolean {
        if(!this.validateListModel(model)) {
            return false;
        }

        const newItems: GNericItemModel[] = [];
        for (const item of model.items) {
            const name = item.name ?? '';
            const text = item.text ?? '';
            const newItem = new GNericItemModel(item.id, name, text);
            newItems.push(newItem);
        }

        this.items = newItems;
        this.title.setValue(model.listname);
        return true;
    }

    private setEntryModel(model: any): boolean {
        if(!this.validateEntryModel(model)) {
            return false;
        }

        for (const item of this.items) {
            if(item.getId() == model.id) {
                item.setNameAndText(model.name, model.text);
                return true;
            }
        }
        return false;
    }

    // _______________  merge  _______________

    /** Adds each item from 'model' to this where teh ID is not in use.
     * 
     * @param model An item list model as json.
     * @returns If and only if additions take place: a json representation of a copy of 'this' just with the items added.
     * Else 'null'.
     */
    mergeModel(model: any): object | null {
        if(!this.validateListModel(model)) {
            return null;
        }

        // TODO: check action

        const idsInUse: Set<string> = new Set();
        this.items.forEach(item => {
            idsInUse.add(item.getId());
        });

        const itemsAdded: Array<any> = [];

        for (const item of model.items) {
            if(!this.validateEntryModel(item)) {
                continue;
            }

            if(!idsInUse.has(item.id)) {
                const itemModel: GNericItemModel = new GNericItemModel(item.id);
                itemModel.setNameAndText(item.name, item.text);
                this.items.push(itemModel);
                itemsAdded.push(item);
            }
        }

        // data reduction to new entries
        if(itemsAdded.length > 0) {
            let diffModel: object = this.getModel();
            diffModel = {...diffModel, items: itemsAdded};
            return diffModel;
        }
        else{
            return null;
        }
    }

    // _______________ validation _______________

    validateListModel(model: any): boolean {
        if(!ValidatorService.isForMe(this.getId(), this.getType(), model)) {
            return false;
        }

        if(!ValidatorService.hasStringProperty('listname', model)) {
            return false;
        }

        if(!model.hasOwnProperty('items') || !model.items || typeof model.items !== 'object' || !Array.isArray(model.items)) {
            return false;
        }

        const arr = model.items;
        const duplicateKeyCheck: Set<string> = new Set();
        for (const item of arr) {
            if(!item) {
                return false;
            }

            if(!this.validateEntryModel(item)) {
                return false;
            }

            const itemId = item.id;
            if(duplicateKeyCheck.has(itemId)) {
                return false;
            }
            duplicateKeyCheck.add(itemId);

        }

        return true;
    }

    validateEntryModel(model: any): boolean {
        // id === '' is not ok here
        if(!model.hasOwnProperty('id') || !model.id || typeof model.id !== 'string') {
            return false;
        }

        if(!model.hasOwnProperty('type') || model.type !== ElemTypes.itementry) {
            return false;
        }

        if(!model.hasOwnProperty('name') || typeof model.name !== 'string') {
            return false;
        }

        if(!model.hasOwnProperty('text') || typeof model.text !== 'string') {
            return false;
        }

        return true;
    }

}