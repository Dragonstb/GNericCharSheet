import { Component, ElementRef, output, ViewChild } from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";

@Component({
    selector: 'gneric-delitemdialog',
    templateUrl: './delitemmodal.component.html',
    imports: [TranslatePipe]
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