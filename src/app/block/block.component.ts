import { Component, ElementRef, inject, output, signal, ViewChild, viewChildren } from "@angular/core";
import { GnericTextfield } from "../textfield/textfield.component";
import { GNericTable } from "../table/table.component";
import { GNericRessourcePointsManager } from "../ressourcepoints/rpm.component";
import { GNericItemList } from "../itemlist/itemlist.component";
import { GNericCheckboxList } from "../checkboxes/checkboxes.component";
import { ElemModel } from "./elemmodel";
import { ElemTypes } from "../elemtypes";
import { ValidatorService } from "../../services/validator";

@Component({
    selector: 'gneric-block',
    templateUrl: './block.component.html',
    imports: [GnericTextfield, GNericTable, GNericRessourcePointsManager, GNericItemList, GNericCheckboxList]
})
export class GNericBlock {
    
    private id: string = 'comp-0';
    private idCounter = 0;
    @ViewChild('block', {static: true}) block!: ElementRef<HTMLDivElement>;
    textfields = viewChildren(GnericTextfield);
    tables = viewChildren(GNericTable);
    rpms = viewChildren(GNericRessourcePointsManager);
    itemlists = viewChildren(GNericItemList);
    checkboxes = viewChildren(GNericCheckboxList);

    editable = signal(true);
    gNericElemChangedEvent = output<object>();
    validator = inject(ValidatorService)
  
    elems: ElemModel[] = [
        new ElemModel(this.id+'-0', ElemTypes.textfield),
        new ElemModel(this.id+'-1', ElemTypes.table),
        new ElemModel(this.id+'-2', ElemTypes.rpm),
        new ElemModel(this.id+'-3', ElemTypes.itemlist),
        new ElemModel(this.id+'-4', ElemTypes.checkboxes),
    ];

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
        this.textfields().forEach(elem => {
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

    deleteElement(elemId: string): void {
        console.log('deleting '+elemId);
    }

    reactOnChange(json: object): void {
        const model = {
            id: this.id,
            type: ElemTypes.blockupdate,
            model: json
        }
        this.gNericElemChangedEvent.emit(model);
    }

    validateModel(model: any): boolean {
        if(!this.validator.isModel(model)) {
            return false;
        }

        if(!this.validator.hasNonEmptyStringProperty('id', model)) {
            return false;
        }

        if(model.id !== this.id) {
            return false;
        }

        if(!this.validator.hasNonEmptyStringProperty('type', model)) {
            return false;
        }

        return true;
    }

    setModel(model: any): void {
        if(!this.validateModel(model)) {
            return;
        }

        if(model.type === ElemTypes.blockupdate) {
            this.updateContentModel(model.model ?? undefined);
        }
        else if(model.type === ElemTypes.blockalteration) {
            // TBD
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
    alterBlock(): void {

    }
}