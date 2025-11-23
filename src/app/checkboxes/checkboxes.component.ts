import { Component, inject, NgZone, output, signal } from "@angular/core";
import { GNericBoxRowModel } from "./boxrowmodel";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { ElemTypes } from "../elemtypes";
import { ValidatorService } from "../../services/validator";

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

    validator = inject(ValidatorService);
    ngZone = inject(NgZone);

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
            type: ElemTypes.checkboxes,
            title: this.title.value ?? '',
            rows: arr
        };

        this.gNericElemChangedEvent.emit(model);
    }

    validateModel(model: any): boolean {
        if(!this.validator.isModel(model)) {
            return false;
        }

        if(!this.validator.isForMe(this.id, ElemTypes.checkboxes, model)) {
            return false;
        }

        if(!this.validator.hasStringProperty('title', model)) {
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
            if(!this.validator.hasStringProperty('text', row)) {
                return false;
            }
            if(!row.hasOwnProperty('checked') || typeof row.checked !== 'boolean') {
                return false;
            }
        }

        return true;
    }

    setModel(model: any): void {
        if(!this.validateModel(model)) {
            return;
        }

        this.title.setValue(model.title);
        
        try {
            this.ngZone.runGuarded(()=>{
                while(this.rows.length > model.rows.length) {
                    this.silentlyRemoveRow();
                }

                while(this.rows.length < model.rows.length) {
                    this.silentlyAddRow();
                }
                
                for (let idx = 0; idx < model.rows.length; idx++) {
                    const target = this.rows[idx];
                    const source = model.rows[idx];
                    target.setChecked(source.checked);
                    target.setText(source.text);
                }
            });
        } catch (error) {
            console.log('GNeric Char Sheet: error on model update in Checkboxes');
        }

    }
}