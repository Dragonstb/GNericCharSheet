import { Component, ElementRef, ViewChildren, viewChildren } from "@angular/core";
import { GNericRPMRow } from "./rpmrow.component";
import { isReadonlyKeywordOrPlusOrMinusToken } from "typescript";
import { GNericDamage } from "./damage";

@Component({
    selector: 'gneric-rpm',
    templateUrl: './rpm.component.html',
    imports: [GNericRPMRow]
})
export class GNericRessourcePointsManager {

    moreThanOnePoint: boolean = true;
    rowNos: number[] = [0,1,2];
    rows = viewChildren(GNericRPMRow);
    damage = new GNericDamage([4,2]);

    addRow(): void {
        this.rowNos.push(this.rowNos.length);
        this.redistributeDamage();
    }

    removeRow(): void {
        if(this.rowNos.length > 1) {
            this.rowNos.splice(this.rowNos.length-1, 1);
        }
        this.redistributeDamage();
    }

    addCol(): void {
        this.rows().forEach(row => {
            row.addPoint();    
        });

        this.moreThanOnePoint = true;
        this.redistributeDamage();
    }
    
    removeCol(): void {
        if(this.rows()[0].getNumPoints() < 2) {
            return;
        }

        this.rows().forEach(row => {
            row.removePoint();
        });

        this.moreThanOnePoint = this.rows()[0].getNumPoints() > 1;
        this.redistributeDamage();
    }

    redistributeDamage(): void {
        let useDmg = this.damage;
        this.rows().forEach(row =>{
            useDmg = row.distributeDamage(useDmg);
        });
    }
}