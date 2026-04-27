import { Component, ElementRef, output, ViewChild } from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";

@Component({
    selector: 'gneric-delelemdialog',
    templateUrl: './delelemmodal.component.html',
    imports: [TranslatePipe]
})
export class GNericDelElemModal {

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
        this.dialog.nativeElement.close();
    }
}