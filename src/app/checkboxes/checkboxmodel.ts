import { ValidatorService } from "../../services/validator";
import { ElemModel } from "../block/elemmodel";
import { ElemTypes } from "../elemtypes";
import { GNericBoxRowModel } from "./boxrowmodel";

export class CheckboxModel extends ElemModel {

    rows: GNericBoxRowModel[] = [
        new GNericBoxRowModel()
    ]

    constructor(id: string, title: string = '') {
        super(id, title ?? '', ElemTypes.checkboxes);
    }

    addRow(): void {
        this.rows.push(new GNericBoxRowModel());
    }

    removeRow(): boolean {
        if(this.rows.length<2) {
            return false;
        }
        this.rows.splice(this.rows.length-1);
        return true;
    }

    override getModel(): object {
        const arr: object[] = [];
        this.rows.forEach(row => {
            arr.push({
                text: row.getText(),
                checked: row.getChecked()
            });
        });

        return {
            id: this.getId(),
            type: ElemTypes.checkboxes,
            title: this.getTitle(),
            rows: arr
        };
    }

    override updateModel(model: any): boolean {
        if(!this.validateModel(model)) {
            return false;
        }

        
        while(this.rows.length > model.rows.length) {
            this.removeRow();
        }
        
        while(this.rows.length < model.rows.length) {
            this.addRow();
        }
        
        this.title.setValue(model.title);
        for (let idx = 0; idx < model.rows.length; idx++) {
            const target = this.rows[idx];
            const source = model.rows[idx];
            target.setChecked(source.checked);
            target.setText(source.text);
        }

        return true;
    }

    // _______________ validation _______________

    private validateModel(model: any): boolean {
        if(!ValidatorService.isModel(model)) {
            return false;
        }

        if(!ValidatorService.isForMe(this.getId(), this.getType(), model)) {
            return false;
        }

        if(!ValidatorService.hasStringProperty('title', model)) {
            return false;
        }

        if(!model.hasOwnProperty('rows') || !model.rows || typeof model.rows !== 'object' || !Array.isArray(model.rows)) {
            return false;
        }

        if(model.rows.length < 1) {
            return false;
        }

        for (const row of model.rows) {
            if(typeof row !== 'object') {
                return false;
            }
            if(!ValidatorService.hasStringProperty('text', row)) {
                return false;
            }
            if(!row.hasOwnProperty('checked') || typeof row.checked !== 'boolean') {
                return false;
            }
        }

        return true;
    }

}