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
        // TODO: get the complete block model by calling blockModel.getModel()
        // and extend it by adding the acyion type in this method
        const arr: object[] = [];
        this.blockModel.getElems().forEach(elem => {
            arr.push(elem.getModel());
        });

        const json = {
            id: this.blockModel.getId(),
            type: ElemTypes.block,
            action: ActionTypes.blockupdate,
            content: arr
        }

        this.gNericElemChangedEvent.emit(json);
    }

    validateBaseModel(model: any): boolean {
        if(!ValidatorService.isModel(model)) {
            return false;
        }

        if(!ValidatorService.isForMe(this.blockModel.getId(), ElemTypes.block, model)) {
            return false;
        }

        if(!ValidatorService.hasNonEmptyStringProperty('action', model)) {
            return false;
        }

        return true;
    }

    validateAlterationModel(model: any): boolean {
        if(!model.hasOwnProperty('content') || !model.content || !Array.isArray(model.content)) {
            return false;
        }

        for (const entry of model.content) {
            if(typeof entry !== 'object') {
                return false;
            }
            if(!ValidatorService.hasNonEmptyStringProperty('id', entry)) {
                return false;
            }
            if(!ValidatorService.hasNonEmptyStringProperty('type', entry)) {
                return false;
            }
            if(!ValidatorService.isCoreElemType(entry.type)) {
                return false;
            }
        }

        return true;
    }

    setModel(model: any): void {
        if(!this.validateBaseModel(model)) {
            return;
        }

        if(model.action === ActionTypes.elemupdate) {
            this.updateElement(model.model ?? undefined);
        }
        else if(model.action === ActionTypes.blockupdate) {
            this.updateBlock(model);
        }
        // otherwise do nothing
    }

    /** Updates the model of an existing child element.
     * 
     * @param model New model
     * @returns None
     */
    updateElement(model: any): void {
        if(!ValidatorService.isModel(model) || !ValidatorService.hasNonEmptyStringProperty('id', model)) {
            return;
        }
        const targetId = model.id;

        for (const elem of this.blockModel.getElems()) {
            if(elem.getId() === targetId()) {
                if(elem.validateModel(model)) {
                    elem.setModel(model);
                }
                break;
            }
        }
    }

    /** Adds or removes child elements.
     * 
     */
    updateBlock(model: any): void {
        if(!this.validateAlterationModel(model)) {
            return;
        }

        const newElems: ElemModel[] = [];
        for (const entry of model.content) {
            switch(entry.type) {
                case ElemTypes.textfield:
                    const newElem = new TextfieldModel(entry.id);
                    if(newElem.validateModel(entry)) {
                        newElem.setModel(entry);
                        newElems.push(newElem);
                    }
                    else {
                        return; // invalid model, ignore
                    }
                    break;
            }
        }

        try {
            this.ngZone.runGuarded(() => {
                this.blockModel.setElems(newElems);
                setTimeout(() => this.setEditable(this.editable()));
            });
        } catch (error) {
            console.log('GNeric Char Sheet: error when updating a content block');
        }
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