import { Component, ElementRef, ViewChild } from "@angular/core";

@Component({
    selector: 'gneric-additemmodal',
    templateUrl: './additemmodal.component.html'
})
export class GNericAddItemModal {

    @ViewChild('dialog') dialog!: ElementRef<HTMLDialogElement>;
    
    openDialog(): void {
        this.dialog.nativeElement.showModal();
    }

    cancel(): void {
        this.dialog.nativeElement.close();
    }

    addNewItem(): void {
        this.dialog.nativeElement.close();
    }

}