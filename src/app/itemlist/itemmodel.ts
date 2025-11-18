import { FormControl } from "@angular/forms";

export class GNericItemModel {

    private id: string;
    name = new FormControl('Hello Model');
    text = new FormControl('Descriptive yet funny text');

    constructor(id: string) {
        this.id = id;
    }

    getId(): string {
        return this.id;
    }
}