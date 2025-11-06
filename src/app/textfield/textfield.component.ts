import { Component, ElementRef, output, ViewChild } from "@angular/core";
import { ElemTypes } from "../elemtypes";

@Component({
    selector: 'gneric-textfield',
    templateUrl: './textfield.component.html'
})
export class GnericTextfield {

    id: string = "comp-01-01";
    fullId: string = "textfield-"+this.id;
    rows: number = 10;
    readOnly: boolean = false;

    deleteTextfieldEvent = output<string>();
    gNericElemChangedEvent = output<object>();

    @ViewChild('textPanel', {static: true}) textPanel!: ElementRef<HTMLTextAreaElement>;
    @ViewChild('editPanel', {static: true}) editPanel!: ElementRef<HTMLDivElement>;
    @ViewChild('fieldSet', {static: true}) fieldSet!: ElementRef<HTMLFieldSetElement>;
    @ViewChild('legend', {static: true}) legend!: ElementRef<HTMLLegendElement>;

    addRow() {
        ++this.rows;
        this.fireElemChangedEvent();
    }

    deleteRow() {
        if(this.rows > 1) {
            --this.rows;
            this.fireElemChangedEvent();
        }
    }

    setEditable(editable: boolean) {
        this.readOnly = !editable;
        if(editable) {
            this.editPanel.nativeElement.classList.remove('hidden');
            this.legend.nativeElement.classList.remove('hidden');
            this.fieldSet.nativeElement.classList.add('editable');
        }
        else {
            this.editPanel.nativeElement.classList.add('hidden');
            this.legend.nativeElement.classList.add('hidden');
            this.fieldSet.nativeElement.classList.remove('editable');
        }
    }

    fireElemChangedEvent() {
        const json = {
            id: this.id,
            type: ElemTypes.textfield,
            text: this.textPanel.nativeElement.value,
            rows: this.rows
        };
        this.gNericElemChangedEvent.emit(json);
    }

    deleteTextfield() {
        this.deleteTextfieldEvent.emit(this.id);
    }

    isTextfieldModelForMe(model: any): boolean {
        if(!model) {
            return false;
        }

        if(!model.hasOwnProperty('id') || !model.id || typeof model.id !== 'string' || model.id !== this.id) {
            return false;
        }

        if(!model.hasOwnProperty('type') || !model.type || typeof model.type !== 'string' || model.type !== ElemTypes.textfield) {
            return false;
        }

        if(!model.hasOwnProperty('rows') || !model.rows || typeof model.rows !== 'number' || model.rows < 1) {
            return false;
        }

        if(!model.hasOwnProperty('text') || (!model.text && model.text !== '') || typeof model.text !== 'string') {
            return false;
        }

        return true;
    }

    setModel(model: any) {
        if(!this.isTextfieldModelForMe(model)) {
            return;
        }

        this.rows = model.rows;
        this.textPanel.nativeElement.value = model.text;
    }

    getId(): string {
        return this.id;
    }
}