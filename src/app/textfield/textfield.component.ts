import { Component, ElementRef, inject, Input, output, ViewChild } from "@angular/core";
import { ElemTypes } from "../elemtypes";
import { ReactiveFormsModule } from "@angular/forms";
import { ValidatorService } from "../../services/validator";
import { TextfieldModel } from "./textfieldmodel";
import { ElemModel } from "../block/elemmodel";

@Component({
    selector: 'gneric-textfield',
    templateUrl: './textfield.component.html',
    imports: [ReactiveFormsModule]
})
export class GnericTextfield {

    elemModel: TextfieldModel = new TextfieldModel("comp-01-01");

    @Input()
    set elem(val: ElemModel) {
        if(val instanceof TextfieldModel) {
            this.elemModel = val;
        }
    }
    editable: boolean = true;

    deleteCoreElemEvent = output<string>();
    gNericElemChangedEvent = output<object>();

    @ViewChild('fieldSet', {static: true}) fieldSet!: ElementRef<HTMLFieldSetElement>;

    addRow() {
        this.elemModel.changeRowsBy(1);
        this.fireElemChangedEvent();
    }

    deleteRow() {
        if(this.elemModel.getRows() > 1) {
            this.elemModel.changeRowsBy(-1);
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
        const json = this.elemModel.getModel();
        this.gNericElemChangedEvent.emit(json);
    }

    deleteTextfield() {
        this.deleteCoreElemEvent.emit(this.elemModel.getId());
    }

    getId(): string {
        return this.elemModel.getId();
    }

    hasTitle(): boolean {
        return Boolean(this.elemModel.getTitle());
    }

    getType(): ElemTypes {
        return ElemTypes.textfield;
    }
}