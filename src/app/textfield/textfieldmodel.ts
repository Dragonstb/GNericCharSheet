import { ElemModel } from "../block/elemmodel";
import { ElemTypes } from "../elemtypes";

export class TextfieldModel extends ElemModel {

    rows: number;

    constructor(id: string, rows: number = 10) {
        super(id, ElemTypes.textfield);
        this.rows = rows && rows > 0 && Number.isInteger(rows) ? rows : 10;
    }

    override getModel(): object {
        return {
            id: this.id,
            type: ElemTypes.textfield,
            rows: this.rows
        }
    }
}