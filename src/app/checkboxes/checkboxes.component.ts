import { Component, output, signal } from "@angular/core";
import { GNericBoxRowModel } from "./boxrowmodel";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { ElemTypes } from "../elemtypes";

@Component({
    selector: 'gneric-checkboxes',
    templateUrl: './checkboxes.component.html',
    imports: [ReactiveFormsModule]
})
export class GNericCheckboxList {

    id: string = 'comp-05-05';
    fullId: string = "checkboxes-"+this.id;
    editable = signal(true);

    title = new FormControl('');

    deleteCheckboxesEvent = output<string>();
    gNericElemChangedEvent = output<object>();

    rows: GNericBoxRowModel[] = [
        new GNericBoxRowModel(),
        new GNericBoxRowModel(),
        new GNericBoxRowModel()
    ]

    setEditable(editable: boolean) {
        this.editable.set(editable);
    }

    hasTitle(): boolean {
        return Boolean(this.title.value);
    }

    addRow(): void {
        this.silentlyAddRow();
        this.fireElemChangeEvent();
    }

    silentlyAddRow(): void {
        this.rows.push(new GNericBoxRowModel());
    }
    
    removeRow(): void {
        if(this.rows.length<2) {
            return;
        }
        this.silentlyRemoveRow();
        this.fireElemChangeEvent();
    }

    silentlyRemoveRow(): void {
        if(this.rows.length<2) {
            return;
        }
        this.rows.splice(this.rows.length-1);
    }

    fireDeleteCheckboxesEvent() {
        this.deleteCheckboxesEvent.emit(this.id);
    }

    fireElemChangeEvent(): void {
        const arr: object[] = [];
        this.rows.forEach(row => {
            arr.push({
                text: row.getText(),
                checked: row.getChecked()
            });
        });

        const model = {
            id: this.id,
            type: ElemTypes.checlboxes,
            title: this.title.value ?? '',
            rows: arr
        };

        this.gNericElemChangedEvent.emit(model);
    }
}