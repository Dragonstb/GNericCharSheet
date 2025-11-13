import { Component, ViewChild, ElementRef } from "@angular/core";
import { GNericRPMRow } from "./rpmrow.component";
import { GNericDamage } from "./damage";
import { GNericRPRowStats } from "./rprowstatus";

@Component({
    selector: 'gneric-rpm',
    templateUrl: './rpm.component.html',
    imports: [GNericRPMRow]
})
export class GNericRessourcePointsManager {

    id = "comp-03-03";
    fullId = "ressource-points-"+this.id;

    rows: GNericRPRowStats[] = [
        new GNericRPRowStats(0, 4),
        new GNericRPRowStats(1, 4),
        new GNericRPRowStats(2, 4),
    ];
    damage = new GNericDamage();
    editable: boolean = true;
    @ViewChild('fieldSet', {static: true}) fieldSet!: ElementRef<HTMLFieldSetElement>;

    setEditable(editable: boolean): void {
        this.editable = editable;
        if(editable) {
            this.fieldSet.nativeElement.classList.add('editable');
        }
        else {
            this.fieldSet.nativeElement.classList.remove('editable');
        }
    }

    addRow(): void {
        this.rows.push(new GNericRPRowStats(this.rows.length, this.getPointsPerRow()));
        this.redistributeDamage();
    }

    removeRow(): void {
        if(this.rows.length > 1) {
            this.rows.splice(this.rows.length-1, 1);
        }
        this.redistributeDamage();
    }

    addCol(): void {
        this.rows.forEach(row => {
            row.addPoint();    
        });

        this.redistributeDamage();
    }
    
    removeCol(): void {
        if(this.rows[0].getNumPoints() < 2) {
            return;
        }
        
        this.rows.forEach(row => {
            row.removePoint();
        });
        
        this.redistributeDamage();
    }

    redistributeDamage(): void {
        let useDmg = this.damage;
        this.rows.forEach(row =>{
            useDmg = row.distributeDamage(useDmg);
        });
    }

    getPointsPerRow() {
        return this.rows[0].getNumPoints();
    }
}