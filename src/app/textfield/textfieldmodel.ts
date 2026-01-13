import { FormControl } from "@angular/forms";
import { ElemModel } from "../block/elemmodel";
import { ElemTypes } from "../elemtypes";
import { ValidatorService } from "../../services/validator";

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

    override updateModel(model: any): boolean {
        if(!this.validateModel(model)) {
            return false;
        }
        this.rows = model.rows;
        this.text.setValue(model.text);
        this.title.setValue(model.title);
        return true;
    }

    // _______________ validation _______________

    validateModel(model: any): boolean {
        if(!ValidatorService.isModel(model)) {
            return false;
        }

        if(!ValidatorService.isForMe(this.getId(), ElemTypes.textfield, model)) {
            return false;
        }

        if(!ValidatorService.hasStringProperty('text', model)) {
            return false;
        }

        if(!ValidatorService.hasStringProperty('title', model)) {
            return false;
        }

        if(!ValidatorService.hasFiniteIntegerProperty('rows', model)) {
            return false;
        }

        if(model.rows < 1) {
            return false;
        }

        return true;
    }
}