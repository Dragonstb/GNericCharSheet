import { ElemTypes } from "../elemtypes";

export class ElemModel {

    id: string;
    private type: ElemTypes;

    constructor(id: string, type: ElemTypes) {
        this.id = id;
        this.type = type;
    }

    getId(): string {
        return this.id;
    }

    getType(): ElemTypes {
        return this.type;
    }

    getModel(): object {
        return {
            id: this.id,
            type: this.type
        }
    }
}