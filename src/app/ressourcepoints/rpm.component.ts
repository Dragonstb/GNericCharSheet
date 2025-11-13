import { Component, ElementRef, ViewChildren, viewChildren } from "@angular/core";
import { GNericRPMRow } from "./rpmrow.component";
import { isReadonlyKeywordOrPlusOrMinusToken } from "typescript";

@Component({
    selector: 'gneric-rpm',
    templateUrl: './rpm.component.html',
    imports: [GNericRPMRow]
})
export class GNericRessourcePointsManager {

    moreThanOnePoint: boolean = true;
    rowNos: number[] = [0,1,2];
    rows = viewChildren(GNericRPMRow);

    addRow(): void {
        this.rowNos.push(this.rowNos.length);
    }

    removeRow(): void {
        if(this.rowNos.length > 1) {
            this.rowNos.splice(this.rowNos.length-1, 1);
        }
    }

    addCol(): void {
        this.rows().forEach(row => {
            row.addPoint();    
        });

        this.moreThanOnePoint = true;
    }
    
    removeCol(): void {
        if(this.rows()[0].getNumPoints() < 2) {
            return;
        }

        this.rows().forEach(row => {
            row.removePoint();
        });

        this.moreThanOnePoint = this.rows()[0].getNumPoints() > 1;
    }
}