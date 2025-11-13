import { Component, Input, signal, Signal } from "@angular/core";
import { GNericCross1 } from "./cross1.component";
import { GNericCross2 } from "./cross2.component";
import { GNericCross3 } from "./cross3.component";
import { GNericCross4 } from "./cross4.component";
import { GNericCross5 } from "./cross5.component";
import { GNericCross6 } from "./cross6.component";
import { RPStatus } from "./rpstatus";
import { GNericDamage } from "./damage";
import { GNericRPRowStats } from "./rprowstatus";

@Component ({
    selector: 'gneric-rpmrow',
    imports: [GNericCross1, GNericCross2, GNericCross3, GNericCross4, GNericCross5, GNericCross6],
    templateUrl: './rpmrow.component.html',
    standalone: true
})
export class GNericRPMRow {

    // @Input() points: number = 3;
    @Input() status: RPStatus[] = [];

    // constructor() {
    //     while(this.status.length < this.points) {
    //         this.addPoint();
    //     }
    // }

    addPoint(): void {
        this.status.push(new RPStatus(this.status.length));
    }

    removePoint(): void {
        this.status.pop();
    }

    getNumPoints(): number {
        return this.status.length;
    }

    distributeDamage(damage: GNericDamage): GNericDamage {
        if(damage.isNoDamage()) {
            this.status.forEach(entry => {
                entry.tier = 0;
            });
            return damage;
        }

        let remainder = new GNericDamage();
        let openPointsLeft = this.getNumPoints();
        let startAt = 0;

        for (let tier = damage.getNumTiers(); tier >= 1; tier--) {
            const toDistribute = damage.getTieredDamage(tier);
            const actuallyDistributed = Math.min(toDistribute, openPointsLeft);
            for (let idx = startAt; idx < Math.min(startAt+actuallyDistributed, this.status.length); idx++) {
                this.status[idx].tier = tier;
            }
            openPointsLeft -= actuallyDistributed;
            startAt += actuallyDistributed;
            remainder.setTieredDamage(tier, toDistribute-actuallyDistributed);
        }
        
        if(openPointsLeft > 0) {
            for (let idx = startAt; idx < this.status.length; idx++) {
                this.status[idx].tier = 0;
            }
        }

        return remainder;
    }
}