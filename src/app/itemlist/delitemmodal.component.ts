import { Component, ElementRef, output, ViewChild } from "@angular/core";

@Component({
    selector: 'gneric-delitemdialog',
    templateUrl: './delitemmodal.component.html'
})
export class GNericDelItemModal {

    @ViewChild('dialog') dialog!: ElementRef<HTMLDialogElement>;

    acceptDeletionEvent = output();

    openDialog(): void {
        this.dialog.nativeElement.showModal();
    }

    cancelDialog(): void {
        this.dialog.nativeElement.close();
    }

    acceptDialog(): void {
        this.acceptDeletionEvent.emit();
    }
}