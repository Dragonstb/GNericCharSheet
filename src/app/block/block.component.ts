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

@Component({
    selector: 'gneric-block',
    templateUrl: './block.component.html',
    imports: [GnericTextfield, GNericTable, GNericRessourcePointsManager, GNericItemList, GNericCheckboxList, GNericDelElemModal]
})
export class GNericBlock {
    
    @Input() id: string = 'comp-0';
    private idCounter = 0;
    @ViewChild('block', {static: true}) block!: ElementRef<HTMLDivElement>;
    @ViewChild('modal') modal!: GNericDelElemModal;
    textfields = viewChildren(GnericTextfield);
    tables = viewChildren(GNericTable);
    rpms = viewChildren(GNericRessourcePointsManager);
    itemlists = viewChildren(GNericItemList);
    checkboxes = viewChildren(GNericCheckboxList);

    editable = signal(true);
    gNericElemChangedEvent = output<object>();
    validator = inject(ValidatorService);
    utils = inject(Utils);
    ngZone = inject(NgZone);

    private idKey = this.utils.getRandomString(4);
    private nextToDelete: string | undefined = undefined;
  
    elems: ElemModel[] = [];

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
        const hasBorder = this.block.nativeElement.classList.contains(classname);
        if(editable && !hasBorder) {
            this.block.nativeElement.classList.add(classname);
        }
        else if(!editable && hasBorder) {
            this.block.nativeElement.classList.remove(classname);
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

        for (let idx = 0; idx < this.elems.length; idx++) {
            const elem = this.elems[idx];
            if(elem.getId() === elemId) {
                this.elems.splice(idx, 1);
                break;
            }
        }

        this.reactOnAlteration();
    }

    reactOnChange(json: object): void {
        const model = {
            id: this.id,
            type: ElemTypes.block,
            action: ActionTypes.elemupdate,
            model: json
        }
        this.gNericElemChangedEvent.emit(model);
    }

    reactOnAlteration(): void {
        const arr: object[] = [];
        this.elems.forEach(elem => {
            arr.push(elem.getModel());
        });

        const json = {
            id: this.id,
            type: ElemTypes.block,
            action: ActionTypes.blockupdate,
            content: arr
        }

        this.gNericElemChangedEvent.emit(json);
    }

    validateBaseModel(model: any): boolean {
        if(!this.validator.isModel(model)) {
            return false;
        }

        if(!this.validator.isForMe(this.id, ElemTypes.block, model)) {
            return false;
        }

        if(!this.validator.hasNonEmptyStringProperty('action', model)) {
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
            if(!this.validator.hasNonEmptyStringProperty('id', entry)) {
                return false;
            }
            if(!this.validator.hasNonEmptyStringProperty('type', entry)) {
                return false;
            }
            if(!this.validator.isCoreElemType(entry.type)) {
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
            this.updateContentModel(model.model ?? undefined);
        }
        else if(model.action === ActionTypes.blockupdate) {
            this.alterBlock(model);
        }
        // otherwise do nothing
    }

    /** Updates the model of an existing child element.
     * 
     * @param model New model
     * @returns None
     */
    updateContentModel(model: any): void {
        if(!this.validator.isModel(model) || !this.validator.hasNonEmptyStringProperty('id', model)) {
            return;
        }
        const targetId = model.id;

        this.textfields().forEach(elem => {
            if(elem.getId() === targetId) {
                elem.setModel(model);
                return;
            }
        });
        this.tables().forEach(elem => {
            if(elem.getId() === targetId) {
                elem.setModel(model);
                return;
            }
        });
        this.rpms().forEach(elem => {
            if(elem.getId() === targetId) {
                elem.setModel(model);
                return;
            }
        });
        this.textfields().forEach(elem => {
            if(elem.getId() === targetId) {
                elem.setModel(model);
                return;
            }
        });
        this.checkboxes().forEach(elem => {
            if(elem.getId() === targetId) {
                elem.setModel(model);
                return;
            }
        });
    }

    /** Adds or removes child elements.
     * 
     */
    alterBlock(model: any): void {
        if(!this.validateAlterationModel(model)) {
            return;
        }

        const newElems: ElemModel[] = [];
        for (const entry of model.content) {
            newElems.push(
                new ElemModel(entry.id, entry.type)
            );
        }

        try {
            this.ngZone.runGuarded(() => {
                this.elems = newElems;
                setTimeout(() => this.setEditable(this.editable()));
            });
        } catch (error) {
            console.log('GNeric Char Sheet: error when updating a content block');
        }
    }

    getNextId(): string {
        const num = this.idCounter++;
        return this.id+'-'+this.idKey+'-'+String(num);
    }

    addElement(type: ElemTypes): void {
        const elemId = this.getNextId();
        const newElem = new ElemModel(elemId, type);
        this.elems.push(newElem);

        this.reactOnAlteration();
    }

    addTextfield(): void {
        this.addElement(ElemTypes.textfield);
    }

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

    getId(): string {
        return this.id;
    }

    getIdKey(): string {
        return this.idKey;
    }
}