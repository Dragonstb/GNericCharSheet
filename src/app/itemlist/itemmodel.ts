import { FormControl } from "@angular/forms";

export class GNericItemModel {

    private id: string;
    name = new FormControl('Hello Model');
    text = new FormControl('Descriptive yet funny text');

    constructor(id: string, name: string = "Insert item name", text: string = "Insert item description") {
        this.id = id;
        this.name.setValue(name);
        this.text.setValue(text);
    }

    getId(): string {
        return this.id;
    }
}