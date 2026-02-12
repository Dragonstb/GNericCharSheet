import { Component, Input, output, ViewChild } from "@angular/core";
import { GNericItemModel } from "./itemmodel";
import { ReactiveFormsModule } from "@angular/forms";
import { GNericDelItemModal } from "./delitemmodal.component";

@Component({
    selector: 'gneric-itementry',
    templateUrl: './itementry.component.html',
    imports: [GNericDelItemModal, ReactiveFormsModule]
})
export class GNericItemEntry {

    @Input() model: GNericItemModel = new GNericItemModel('0');
    @Input() editable: boolean = false;
    @Input() deletable: boolean = true;
    expanded: boolean = false;

    deleteEntryEvent = output();
    gNericElemChangedEvent = output<object>();
    @ViewChild('modal') modalDialog!: GNericDelItemModal;

    toggleExpansion(): void {
        this.expanded = !this.expanded;
    }

    requestDeletionOfEntry(): void {
        this.modalDialog.openDialog();
    }

    fireDeleteEntryEvent(): void {
        this.deleteEntryEvent.emit();
    }

    fireElemChangeEvent(): void {
        this.gNericElemChangedEvent.emit(this.model.getModel());
    }
}