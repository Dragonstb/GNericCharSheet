import { ElemModel } from "./elemmodel";

export class GNericBlockModel {

    private id: string;
    private elems: ElemModel[] = [];

    constructor(id: string) {
        this.id = id;
    }

    getId(): string {
        return this.id;
    }

    addElem(elemModel: ElemModel): void {
        this.elems.push(elemModel);
    }

    deleteElemById(elemId: string): void {
        for (let idx = 0; idx < this.elems.length; idx++) {
            const elem = this.elems[idx];
            if(elem.getId() === elemId) {
                this.elems.splice(idx, 1);
                break;
            }
        }
    }

    getElems(): ElemModel[] {
        return this.elems;
    }
    setElems(newElems: ElemModel[]): void {
        this.elems = newElems;
    }

    getModel(): object {
        return {
            id: this.id
        }
    }
}