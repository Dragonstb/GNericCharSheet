import { Component, ElementRef, Input, output, ViewChild } from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";

@Component({
    selector: 'gneric-deldialog',
    templateUrl: './delmodal.component.html',
    imports: [TranslatePipe]
})
export class GNericDeletionModal {

    @Input() text: string = 'Delete?'
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