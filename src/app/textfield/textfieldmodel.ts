import { FormControl } from "@angular/forms";
import { ElemModel } from "../block/elemmodel";
import { ElemTypes } from "../elemtypes";

export class TextfieldModel extends ElemModel {

    rows: number;
    text = new FormControl('Insert text');

    constructor(id: string, title: string = '', rows: number = 10) {
        super(id, title ?? id, ElemTypes.textfield);
        this.rows = rows && rows > 0 && Number.isInteger(rows) ? rows : 10;
    }

    changeRowsBy(diff: number): void {
        if(Number.isInteger(diff)) {
            this.rows = Math.max(this.rows+diff, 0);
        }
    }

    getRows(): number {
        return this.rows;
    }

    override getModel(): object {
        return {
            id: this.getId(),
            type: ElemTypes.textfield,
            title: this.getTitle(),
            text: this.text.value ?? '',
            rows: this.rows
        };
    }

    setModel(model: any) {
        this.rows = model.rows;
        this.text.setValue(model.text);
        this.title.setValue(model.title);
    }
}