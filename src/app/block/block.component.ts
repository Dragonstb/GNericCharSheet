import { Component, ElementRef, inject, Input, NgZone, output, signal, ViewChild, viewChildren } from "@angular/core";
import { GnericTextfield } from "../textfield/textfield.component";
import { GNericTable } from "../table/table.component";
import { GNericRessourcePointsManager } from "../ressourcepoints/rpm.component";
import { GNericItemList } from "../itemlist/itemlist.component";
import { GNericCheckboxList } from "../checkboxes/checkboxes.component";
import { ElemModel } from "./elemmodel";
import { ElemTypes } from "../elemtypes";
import { ValidatorService } from "../../services/validator";
import { Utils } from "../../services/utils";
import { GNericDelElemModal } from "./delelemmodal.component";
import { ActionTypes } from "../ActionTypes";
import { GNericBlockModel } from "./blockmodel";
import { TextfieldModel } from "../textfield/textfieldmodel";

@Component({
    selector: 'gneric-block',
    templateUrl: './block.component.html',
    imports: [GnericTextfield, GNericTable, GNericRessourcePointsManager, GNericItemList, GNericCheckboxList, GNericDelElemModal]
})
export class GNericBlock {
    
    @Input() blockModel: GNericBlockModel = new GNericBlockModel('block-0');
    private idCounter = 0;
    @ViewChild('block', {static: true}) blockElement!: ElementRef<HTMLDivElement>;
    @ViewChild('modal') modal!: GNericDelElemModal;
    textfields = viewChildren(GnericTextfield);
    tables = viewChildren(GNericTable);
    rpms = viewChildren(GNericRessourcePointsManager);
    itemlists = viewChildren(GNericItemList);
    checkboxes = viewChildren(GNericCheckboxList);

    editable = signal(true);
    gNericElemChangedEvent = output<object>();
    utils = inject(Utils);
    ngZone = inject(NgZone);

    private idKey = this.utils.getRandomString(4);
    private nextToDelete: string | undefined = undefined;

    setEditable(editable: boolean): void {
        this.editable.set(editable);

        this.textfields().forEach(elem => {
            elem.setEditable(editable);
        });
        this.tables().forEach(elem => {
            elem.setEditable(editable);
        });
        this.rpms().forEach(elem => {
            elem.setEditable(editable);
        });
        this.itemlists().forEach(elem => {
            elem.setEditable(editable);
        });
        this.checkboxes().forEach(elem => {
            elem.setEditable(editable);
        });

        const classname = 'blockbox';
        const hasBorder = this.blockElement.nativeElement.classList.contains(classname);
        if(editable && !hasBorder) {
            this.blockElement.nativeElement.classList.add(classname);
        }
        else if(!editable && hasBorder) {
            this.blockElement.nativeElement.classList.remove(classname);
        }
    }

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

    /*
    addTable(): void {
        this.addElement(ElemTypes.table);
    }

    addRPM(): void {
        this.addElement(ElemTypes.rpm);
    }

    addItemlist(): void {
        this.addElement(ElemTypes.itemlist);
    }

    addCheckboxes(): void {
        this.addElement(ElemTypes.checkboxes);
    }
    */

    // _______________ stuff _______________

    getId(): string {
        return this.blockModel.getId();
    }

    getIdKey(): string {
        return this.idKey;
    }
}