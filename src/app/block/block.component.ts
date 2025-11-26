import { Component, ElementRef, output, signal, ViewChild, viewChildren } from "@angular/core";
import { GnericTextfield } from "../textfield/textfield.component";
import { GNericTable } from "../table/table.component";
import { GNericRessourcePointsManager } from "../ressourcepoints/rpm.component";
import { GNericItemList } from "../itemlist/itemlist.component";
import { GNericCheckboxList } from "../checkboxes/checkboxes.component";
import { ElemModel } from "./elemmodel";
import { ElemTypes } from "../elemtypes";

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
        this.gNericElemChangedEvent.emit(json);
    }

    setModel(model: any): void {
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
}