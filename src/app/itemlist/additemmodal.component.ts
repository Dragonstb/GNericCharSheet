import { Component, ElementRef, inject, Input, output, ViewChild } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { GNericItemModel } from "./itemmodel";
import { GNericRoCompendium } from "../ROCompendium/rocompendium.component";
import { ValidatorService } from "../../services/validator";
import { Utils } from "../../services/utils";
import { TranslateDirective, TranslatePipe } from "@ngx-translate/core";

@Component({
    selector: 'gneric-additemmodal',
    templateUrl: './additemmodal.component.html',
    imports: [GNericRoCompendium, ReactiveFormsModule, TranslatePipe, TranslateDirective]
})
export class GNericAddItemModal {

    @Input() showCompendium: boolean = true;
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

    displayCompendium = new FormControl(false);

    utils = inject(Utils);

    constructor() {
        this.idKey = this.utils.getRandomString(6);
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
            const itemId = 'item-'+this.idKey + '-' + String(this.counter++);
            const item = new GNericItemModel(itemId, name, text);
            this.form.setValue({name: '', text: ''});
            this.newItemEvent.emit(item);
        }
        this.dialog.nativeElement.close();
    }

    reactOnSelectItemEvent(json: any): void {
        if(!json || !ValidatorService.hasStringProperty('name', json) || !ValidatorService.hasStringProperty('text', json)) {
            return;
        }

        this.form.setValue(json);
    }
}