import { Component, ElementRef, output, ViewChild } from "@angular/core";

@Component({
    selector: 'gneric-textfield',
    templateUrl: './textfield.component.html',
    styleUrl: './textfield.component.less'
})
export class GnericTextfield {

    id: string = "abc";
    rows: number = 10;
    textEditable: boolean = true;
    deleteTextfieldEvent = output<string>();
    @ViewChild('textPanel', {static: true}) textPanel!: ElementRef<HTMLTextAreaElement>;
    @ViewChild('editPanel', {static: true}) editPanel!: ElementRef<HTMLDivElement>;

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
        }
        else {
            this.editPanel.nativeElement.classList.add('hidden');
        }
    }

    deleteTextfield() {
        this.deleteTextfieldEvent.emit(this.id);
    }

    getId(): string {
        return this.id;
    }
}