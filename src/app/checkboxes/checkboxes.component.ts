import { Component, Input, output} from "@angular/core";
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
    @Input() editable: boolean = true;

    deleteCoreElemEvent = output<string>();
    gNericElemChangedEvent = output<object>();

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