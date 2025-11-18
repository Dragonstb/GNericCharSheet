import { Component, ElementRef, Input, output, ViewChild } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { GNericItemModel } from "./itemmodel";

@Component({
    selector: 'gneric-additemmodal',
    templateUrl: './additemmodal.component.html',
    imports: [ReactiveFormsModule]
})
export class GNericAddItemModal {

    @Input() listname: string | null = 'list';
    newItemEvent = output<GNericItemModel>();
    counter: number = 0;
    idKey: string;

    @ViewChild('dialog') dialog!: ElementRef<HTMLDialogElement>;

    // TODO: validators for allowed characters
    form = new FormGroup({
        name: new FormControl('', [Validators.required, Validators.minLength(1)]),
        text: new FormControl('', [Validators.required, Validators.minLength(1)])
    });

    constructor() {
        const pool = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let symbols: string[] = [];
        for (let _ = 0; _ < 5; _++) {
            const idx = Math.floor(Math.random()*pool.length);
            symbols.push(pool.charAt(idx));
        }
        this.idKey = symbols.join('');
    }
    
    openDialog(): void {
        this.dialog.nativeElement.showModal();
    }

    cancel(): void {
        this.dialog.nativeElement.close();
    }

    addNewItem(): void {
        const name = this.form.value.name;
        const text = this.form.value.text;
        if(name && text) {
            const itemId = this.idKey + '-' + String(this.counter++);
            const item = new GNericItemModel(itemId, name, text);
            this.form.setValue({name: '', text: ''});
            this.newItemEvent.emit(item);
        }
        this.dialog.nativeElement.close();
    }

}