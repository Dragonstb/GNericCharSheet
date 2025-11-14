import { Component, ViewChild, ElementRef } from "@angular/core";
import { GNericRPMRow } from "./rpmrow.component";
import { GNericDamage } from "./damage";
import { GNericRPRowStats } from "./rprowstatus";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { GNericDmgConfModal } from "./dmgconfmodal.component";

@Component({
    selector: 'gneric-rpm',
    templateUrl: './rpm.component.html',
    imports: [GNericRPMRow, GNericDmgConfModal, ReactiveFormsModule]
})
export class GNericRessourcePointsManager {

    id = "comp-03-03";
    fullId = "ressource-points-"+this.id;

    pattern = /^[+\-=]?([A-Za-z]?\d+)([A-Za-z]\d+)*$/;
    dmgInput: FormControl = new FormControl('');
    rows: GNericRPRowStats[] = [
        new GNericRPRowStats(0, 4),
        new GNericRPRowStats(1, 4),
        new GNericRPRowStats(2, 4),
    ];
    damage = new GNericDamage();
    editable: boolean = true;
    @ViewChild('fieldSet', {static: true}) fieldSet!: ElementRef<HTMLFieldSetElement>;
    @ViewChild('checkmark') checkmark: ElementRef | undefined;
    @ViewChild('modal') modal!: GNericDmgConfModal;

    tierMap: Map<string, number> = new Map();

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

    onDmgInput() {
        if(!this.checkmark) {
            return;
        }
        
        // TODO: toggle info also for screen readers, not only visually
        const ok = this.pattern.test(this.dmgInput.value.toLowerCase());
        const isHidden = this.checkmark.nativeElement.classList.contains('hidden');
        if(ok && isHidden) {
            this.checkmark.nativeElement.classList.remove('hidden');
        }
        else if(!ok && !isHidden) {
            this.checkmark.nativeElement.classList.add('hidden');
        }
    }

    onSubmitDamage() {
        const inString = this.dmgInput.value.toLowerCase();
        if(!this.pattern.test(inString)) {
            return;
        }

        const regex = /[^+\-=]+/;
        const use = inString.match(regex)[0];

        const splitPattern = /([A-Za-z]?\d+)/g;
        let groups = [];
        let matches;
        while((matches = splitPattern.exec(use)) !== null) {
            groups.push(matches[0]);
        }

        const checkPattern = /^\d/;
        const delta = new GNericDamage();
        for (const grp of groups) {
            let key = grp[0];
            if(checkPattern.test(grp)) {
                key = '';
            }

            const damageString = grp.substring(key.length);
            const damageNumber = Number(damageString);
            if(!damageNumber) {
                // TODO: log
                continue;
            }
            
            const damageTier = this.tierMap.get(key);
            if(!damageTier) {
                // TODO: log
                continue;
            }

            delta.setTieredDamage(damageTier, damageNumber);
        }


        switch(inString[0]) {
            case '-':
                this.damage.addDamage(delta);
                break;
            case '=':
                this.damage = delta;
                break;
            default:
                this.damage.subtractDamage(delta);
        }
        this.redistributeDamage();

        this.dmgInput.setValue('');
        if(this.checkmark) {
            this.checkmark.nativeElement.classList.add('hidden');
        }
    }

    mapDamageTier(key: string, tier: number): void {
        if((!key && key !== '') || key.length > 1) {
            return;
        }

        if(!tier || tier < 1 || tier > this.damage.getNumTiers()) {
            return;
        }

        // unmap former letter
        for (const [oldKey, val] of this.tierMap) {
            if(val === tier) {
                this.tierMap.delete(oldKey);
                break;
            }            
        }

        this.tierMap.set(key.toLowerCase(), tier);
    }

    updateRegexPattern() {
        let arr: string[] = ['^[+\\-=]?(['];
        for (const key of this.tierMap.keys()) {
            arr.push(key);
        }
        arr.push(']?\\d+)([');
        for (const key of this.tierMap.keys()) {
            arr.push(key);
        }
        arr.push(']\\d+)*$');

        const str = arr.join('');
        this.pattern = new RegExp(str);
    }

    updateDmgConfig(newMap: Map<string, number>): void {
        // set damage of now obsolete tiers to 0
        forloop:
        for (const oldVal of this.tierMap.values()) {
            for (const newVal of newMap.values()) {
                if(newVal === oldVal) {
                    continue forloop;
                }
            }
            this.damage.setTieredDamage(oldVal, 0);
        }

        this.tierMap = newMap;
        this.updateRegexPattern();
        this.redistributeDamage();
    }

    ngOnInit() {
        this.mapDamageTier('c', 3);
        this.mapDamageTier('m', 2);
        this.mapDamageTier('', 1);
        this.updateRegexPattern();
    }

}