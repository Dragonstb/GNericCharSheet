import { FormControl } from "@angular/forms";
import { ItemListModel } from "../itemlist/itemlistmodel";
import { ElemTypes } from "../elemtypes";

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
}