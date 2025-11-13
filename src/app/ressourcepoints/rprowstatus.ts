import { RPStatus } from "./rpstatus";
import { GNericDamage } from "./damage";

export class GNericRPRowStats {

    id: number;
    status: RPStatus[] = [
        new RPStatus(0)
    ]

    constructor(id: number, points: number) {
        this.id = id;
        while(this.status.length < points) {
            this.status.push(new RPStatus(this.status.length));
        }
    }

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