import { ValidatorService } from "../../services/validator";
import { ElemModel } from "../block/elemmodel";
import { ElemTypes } from "../elemtypes";
import { TableAlterer } from "./tablealterer";

export class TableModel extends ElemModel {

    alterer: TableAlterer = new TableAlterer();
    minWidth: number = 10;

    constructor(id: string, title: string = '') {
        super(id, title ?? '', ElemTypes.table);
    }

    override getModel(): object {
        const widths = this.alterer.getColumnWidths();
        let texts: string[][] = this.alterer.getContent();

        const json = {
            id: this.getId(),
            type: ElemTypes.table,
            widths: widths,
            minWidth: this.minWidth,
            texts: texts,
            title: this.title.value ?? ''
        }

        return json;
    }

    override updateModel(model: any): boolean {
        if(!this.validateModel(model)) {
            return false;
        }

        this.title.setValue(model.title);
        this.minWidth = model.minWidth;
        this.alterer.setContent(model);
        // this.alterer.setColumnWidths(model.widths);
        return true;
    }

    // _______________ validation _______________

    validateModel(model: any): boolean {
        if(!ValidatorService.isModel(model)) {
            return false;
        }

        if(!ValidatorService.isForMe(this.getId(), this.getType(), model)) {
            return false;
        }

        if(!this.isProperTexts(model)) {
            return false;
        }

        if(!this.isProperWidths(model)) {
            return false;
        }

        if(!ValidatorService.hasStringProperty('title', model)) {
            return false;
        }

        return true;
    }

    isProperWidths(model: any): boolean {
        if(!ValidatorService.hasNumberArray('widths', model)) {
            return false;
        }

        if(!ValidatorService.hasFiniteNumberProperty('minWidth', model)) {
            return false;
        }

        if(model.minWidth < 1) {
            return false;
        }

        let widths = model.widths;
        if(widths.length < 1) {
            return false;
        }

        let sum = 0;
        for (const x of widths) {
            if(x<model.minWidth || x>100) {
                return false;
            }
            sum += x;
        }

        if(sum !== 100) {
            return false;
        }

        return true;
    }

    isProperTexts(model: any): boolean {
        if(!model.hasOwnProperty('texts') || !model.texts){
            return false;
        }

        let texts = model.texts;
        if(typeof texts !== 'object' || !Array.isArray(texts) || texts.length < 1) {
            return false;
        }

        for (const row of texts) {
            if(!row || typeof row !== 'object' || !Array.isArray(row) || row.length === 0) {
                return false;
            }
        }

        const cols = texts[0].length;
        for (const row of texts) {
            if(row.length != cols) {
                return false;
            }

            for (const entry of row) {
                if((!entry && entry !== "") || typeof entry !== 'string') {
                    return false;
                }
            }
        }

        return true;
    }
}