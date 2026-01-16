import { Component, Input, output } from "@angular/core";
import { GNericSheetCollectionModel } from "./sheetcollectionmodel";
import { GNericSheet } from "../sheet/sheet.component";
import { GNericSheetModel } from "../sheet/sheetmodel";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { ElemTypes } from "../elemtypes";
import { ActionTypes } from "../ActionTypes";

@Component({
    selector: 'gneric-sheetcollection',
    templateUrl: './sheetcollection.component.html',
    imports: [GNericSheet, ReactiveFormsModule]
})
export class GNericSheetCollection {

    @Input() sheets: GNericSheetCollectionModel = new GNericSheetCollectionModel();
    @Input() editable: boolean = true;
    sheetSelect = new FormControl();
    currentSheet: GNericSheetModel | undefined = undefined;
    gNericElemChangedEvent = output<object>();

    selectSheet(): void {
        const id = this.sheetSelect.value ?? '';
        this.currentSheet = this.sheets.getSheetById(id);
    }

    // _______________ broadcast changes _______________

    reactOnSheetUpdate(model: object): void {
        const json = {
            type: ElemTypes.sheetcollection,
            action: ActionTypes.sheetupdate,
            model: model
        }
        this.gNericElemChangedEvent.emit(json);
    }

    reactOnCollectionUpdate(): void {
        const model = this.sheets.getModel();
        const json = {...model, action: ActionTypes.collectionupdate};
        this.gNericElemChangedEvent.emit(json);
    }

}