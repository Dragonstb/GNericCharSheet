export class GNericDamage {
    private dmg: number[] = [0,0,0,0,0,0];
    
    constructor(dmg: number[] = [0,0,0,0,0,0]) {
        for (let idx = 0; idx < Math.min(dmg.length, this.dmg.length); idx++) {
            this.dmg[idx] = Math.max(dmg[idx], 0);
        }
    }

    private setDmg(idx: number, damage: number): void {
        if(idx > -1 && idx < this.dmg.length) {
            this.dmg[idx] = Math.max(damage);
        }
    }

    addDamage(damage: GNericDamage): void {
        for (let idx = 0; idx < this.dmg.length; idx++) {
            const newDamage = this.dmg[idx] + damage.dmg[idx];
            this.setDmg(idx, newDamage);
        }
    }

    getTieredDamage(tier: number): number {
        if(tier > 0 && tier <= this.dmg.length) {
            return this.dmg[tier-1];
        }
        else {
            return 0;
        }
    }

    getNumTiers(): number {
        return this.dmg.length;
    }
}