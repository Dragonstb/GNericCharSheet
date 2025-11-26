import { signal, WritableSignal } from "@angular/core";
import { ElemTypes } from "../elemtypes";

export class ElemModel {

    id: WritableSignal<string>;
    private type: ElemTypes;

    constructor(id: string, type: ElemTypes) {
        this.id = signal(id);
        this.type = type;
    }

    getId(): WritableSignal<string> {
        return this.id;
    }

    getType(): ElemTypes {
        return this.type;
    }
}