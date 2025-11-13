import { Component, ElementRef, ViewChildren, viewChildren } from "@angular/core";
import { GNericRPMRow } from "./rpmrow.component";
import { GNericDamage } from "./damage";
import { GNericRPRowStats } from "./rprowstatus";

@Component({
    selector: 'gneric-rpm',
    templateUrl: './rpm.component.html',
    imports: [GNericRPMRow]
})
export class GNericRessourcePointsManager {

    points: number = 4;
    moreThanOnePoint: boolean = true;
    rowNos: GNericRPRowStats[] = [
        new GNericRPRowStats(0, this.points),
        new GNericRPRowStats(1, this.points),
        new GNericRPRowStats(2, this.points),
    ];
    rows = viewChildren(GNericRPMRow);
    damage = new GNericDamage([4,2]);

    addRow(): void {
        this.rowNos.push(new GNericRPRowStats(this.rowNos.length, this.points));
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
        this.points = this.rows()[0].getNumPoints();
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
        this.points = this.rows()[0].getNumPoints();
    }

    redistributeDamage(): void {
        let useDmg = this.damage;
        this.rows().forEach(row =>{
            useDmg = row.distributeDamage(useDmg);
        });
    }
}