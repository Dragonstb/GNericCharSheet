import { Component, ElementRef, inject, output, ViewChild } from "@angular/core";
import { ElemTypes } from "../elemtypes";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { ValidatorService } from "../../services/validator";

@Component({
    selector: 'gneric-textfield',
    templateUrl: './textfield.component.html',
    imports: [ReactiveFormsModule]
})
export class GnericTextfield {

    id: string = "comp-01-01";
    fullId: string = "textfield-"+this.id;
    rows: number = 10;
    editable: boolean = true;

    deleteTextfieldEvent = output<string>();
    gNericElemChangedEvent = output<object>();

    @ViewChild('fieldSet', {static: true}) fieldSet!: ElementRef<HTMLFieldSetElement>;

    text = new FormControl('Insert text');
    validator = inject(ValidatorService);

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
        this.editable = editable;
        if(editable) {
            if(!this.fieldSet.nativeElement.classList.contains('editable')) {
                this.fieldSet.nativeElement.classList.add('editable');
            }
        }
        else {
            if(this.fieldSet.nativeElement.classList.contains('editable')) {
                this.fieldSet.nativeElement.classList.remove('editable');
            }
        }
    }

    fireElemChangedEvent() {
        const json = {
            id: this.id,
            type: ElemTypes.textfield,
            text: this.text.value ?? '',
            rows: this.rows
        };
        this.gNericElemChangedEvent.emit(json);
    }

    deleteTextfield() {
        this.deleteTextfieldEvent.emit(this.id);
    }

    validateModel(model: any): boolean {
        if(!this.validator.isModel(model)) {
            return false;
        }

        if(!this.validator.isForMe(this.id, ElemTypes.textfield, model)) {
            return false;
        }

        if(!this.validator.hasStringProperty('text', model)) {
            return false;
        }

        if(!this.validator.hasFiniteIntegerProperty('rows', model)) {
            return false;
        }

        if(model.rows < 1) {
            return false;
        }

        return true;
    }

    setModel(model: any) {
        if(!this.validateModel(model)) {
            return;
        }

        this.rows = model.rows;
        this.text.setValue(model.text);
    }

    getId(): string {
        return this.id;
    }
}