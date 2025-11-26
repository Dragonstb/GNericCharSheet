import { Component, viewChildren } from "@angular/core";
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
    imports: [GnericTextfield, GNericTable]
})
export class GNericBlock {
    
    private id: string = 'comp-0';
    private idCounter = 0;
    textfields = viewChildren(GnericTextfield);
    tables = viewChildren(GNericTable);
    rpms = viewChildren(GNericRessourcePointsManager);
    itemlists = viewChildren(GNericItemList);
    checkboxes = viewChildren(GNericCheckboxList);
  
    elems: ElemModel[] = [
        new ElemModel(this.id+'-0', ElemTypes.textfield),
        new ElemModel(this.id+'-1', ElemTypes.table),
    ];

    setEditable(editable: boolean): void {
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
    }
}