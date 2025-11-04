import { Component, ElementRef, output, ViewChild } from "@angular/core";

@Component({
    selector: 'gneric-textfield',
    templateUrl: './textfield.component.html',
    styleUrl: './textfield.component.less'
})
export class GnericTextfield {

    id: string = "comp-01-01";
    fullId: string = "Textfield-"+this.id;
    rows: number = 10;
    textEditable: boolean = true;
    deleteTextfieldEvent = output<string>();
    @ViewChild('textPanel', {static: true}) textPanel!: ElementRef<HTMLTextAreaElement>;
    @ViewChild('editPanel', {static: true}) editPanel!: ElementRef<HTMLDivElement>;
    @ViewChild('fieldSet', {static: true}) fieldSet!: ElementRef<HTMLFieldSetElement>;
    @ViewChild('legend', {static: true}) legend!: ElementRef<HTMLLegendElement>;

    addRow() {
        ++this.rows;
    }

    deleteRow() {
        if(this.rows > 1) {
            --this.rows;
        }
    }

    setEditable(editable: boolean) {
        this.textEditable = editable;
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

    deleteTextfield() {
        this.deleteTextfieldEvent.emit(this.id);
    }

    getId(): string {
        return this.id;
    }
}