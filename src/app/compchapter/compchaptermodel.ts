import { FormControl } from "@angular/forms";
import { ItemListModel } from "../itemlist/itemlistmodel";

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
}