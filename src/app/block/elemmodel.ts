import { FormControl } from "@angular/forms";
import { ElemTypes } from "../elemtypes";

export abstract class ElemModel {

    private id: string;
    private type: ElemTypes;
    title = new FormControl('Element title');

    constructor(id: string, title: string, type: ElemTypes) {
        this.id = id;
        this.title.setValue(title);
        this.type = type;
    }

    getId(): string {
        return this.id;
    }

    getTitle(): string {
        return this.title.value ?? '';
    }

    getType(): ElemTypes {
        return this.type;
    }

    abstract getModel(): object;

    abstract validateModel(model: any): boolean;
}