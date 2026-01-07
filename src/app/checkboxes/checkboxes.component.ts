import { Component, ElementRef, Input, output, signal, ViewChild } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { ElemTypes } from "../elemtypes";
import { CheckboxModel } from "./checkboxmodel";
import { ElemModel } from "../block/elemmodel";

@Component({
    selector: 'gneric-checkboxes',
    templateUrl: './checkboxes.component.html',
    imports: [ReactiveFormsModule]
})
export class GNericCheckboxList {

    elemModel: CheckboxModel = new CheckboxModel("comp-05-05");

    @Input()
    set elem(val: ElemModel) {
        if(val instanceof CheckboxModel) {
            this.elemModel = val;
        }
    }
    editable = signal(true);

    @ViewChild('fieldSet', {static: true}) fieldSet!: ElementRef<HTMLFieldSetElement>;
    deleteCoreElemEvent = output<string>();
    gNericElemChangedEvent = output<object>();

    setEditable(editable: boolean) {
        this.editable.set(editable);
        const hasClassEditable = this.fieldSet.nativeElement.classList.contains('editable');
        if(editable && !hasClassEditable) {
            this.fieldSet.nativeElement.classList.add('editable');
        }
        else if(!editable && hasClassEditable) {
            this.fieldSet.nativeElement.classList.remove('editable');
        }
    }

    hasTitle(): boolean {
        return Boolean(this.elemModel.getTitle());
    }

    addRow(): void {
        this.elemModel.addRow();
        this.fireElemChangeEvent();
    }

    removeRow(): void {
        if(this.elemModel.removeRow()) {
            this.fireElemChangeEvent();
        }
    }

    fireDeleteCheckboxesEvent() {
        this.deleteCoreElemEvent.emit(this.elemModel.getId());
    }

    fireElemChangeEvent(): void {
        const model = this.elemModel.getModel();
        this.gNericElemChangedEvent.emit(model);
    }

    getType(): ElemTypes {
        return this.elemModel.getType();
    }

    getId(): string {
        return this.elemModel.getId();
    }
}