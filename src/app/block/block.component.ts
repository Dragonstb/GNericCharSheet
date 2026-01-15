import { Component, ElementRef, inject, Input, NgZone, output, signal, ViewChild, viewChildren } from "@angular/core";
import { GnericTextfield } from "../textfield/textfield.component";
import { GNericTable } from "../table/table.component";
import { GNericRessourcePointsManager } from "../ressourcepoints/rpm.component";
import { GNericItemList } from "../itemlist/itemlist.component";
import { GNericCheckboxList } from "../checkboxes/checkboxes.component";
import { ElemModel } from "./elemmodel";
import { ElemTypes } from "../elemtypes";
import { Utils } from "../../services/utils";
import { GNericDelElemModal } from "./delelemmodal.component";
import { ActionTypes } from "../ActionTypes";
import { GNericBlockModel } from "./blockmodel";
import { TextfieldModel } from "../textfield/textfieldmodel";
import { TableModel } from "../table/tablemodel";
import { RPMModel } from "../ressourcepoints/rpmmodel";
import { ItemListModel } from "../itemlist/itemlistmodel";
import { CheckboxModel } from "../checkboxes/checkboxmodel";

@Component({
    selector: 'gneric-block',
    templateUrl: './block.component.html',
    imports: [GnericTextfield, GNericTable, GNericRessourcePointsManager, GNericItemList, GNericCheckboxList, GNericDelElemModal]
})
export class GNericBlock {
    
    @Input() blockModel: GNericBlockModel = new GNericBlockModel('block-0');
    private idCounter = 0;
    @ViewChild('modal') modal!: GNericDelElemModal;
    textfields = viewChildren(GnericTextfield);
    tables = viewChildren(GNericTable);
    rpms = viewChildren(GNericRessourcePointsManager);
    itemlists = viewChildren(GNericItemList);
    checkboxes = viewChildren(GNericCheckboxList);

    @Input() editable: boolean = true;
    gNericElemChangedEvent = output<object>();
    utils = inject(Utils);
    ngZone = inject(NgZone);

    private idKey = this.utils.getRandomString(4);
    private nextToDelete: string | undefined = undefined;

    openDeleteElemDialog(elemId: string): void {
        this.nextToDelete = elemId;
        this.modal.openDialog();
    }

    deleteElement(): void {
        if(!this.nextToDelete) {
            return;
        }
        const elemId = this.nextToDelete;
        this.nextToDelete = undefined;

        this.blockModel.deleteElemById(elemId);
        this.reactOnBlockChange();
    }

    reactOnElementChange(json: object): void {
        const model = {
            id: this.blockModel.getId(),
            type: ElemTypes.block,
            action: ActionTypes.elemupdate,
            model: json
        }
        this.gNericElemChangedEvent.emit(model);
    }

    reactOnBlockChange(): void {
        const model = this.blockModel.getModel() as object;
        const json = {...model, action: ActionTypes.blockupdate};

        this.gNericElemChangedEvent.emit(json);
    }

    getNextId(): string {
        const num = this.idCounter++;
        return this.blockModel.getId()+'-'+this.idKey+'-'+String(num);
    }

    addElement(newElem: ElemModel): void {
        this.blockModel.addElem(newElem);
        this.reactOnBlockChange();
    }

    addTextfield(): void {
        const elemId = this.getNextId();
        const newElem = new TextfieldModel(elemId);
        this.addElement(newElem);
    }

    addTable(): void {
        const elemId = this.getNextId();
        const newElem = new TableModel(elemId);
        this.addElement(newElem);
    }

    addRPM(): void {
        const elemId = this.getNextId();
        const newElem = new RPMModel(elemId);
        this.addElement(newElem);
    }

    addItemlist(): void {
        const elemId = this.getNextId();
        const newElem = new ItemListModel(elemId);
        this.addElement(newElem);
    }
    
    addCheckboxes(): void {
        const elemId = this.getNextId();
        const newElem = new CheckboxModel(elemId);
        this.addElement(newElem);
    }

    // _______________ stuff _______________

    getId(): string {
        return this.blockModel.getId();
    }

    getIdKey(): string {
        return this.idKey;
    }
}