import { Component, ViewChild, ElementRef, computed, ViewChildren, viewChildren, output } from "@angular/core";
import { GNericRPMRow } from "./rpmrow.component";
import { GNericDamage } from "./damage";
import { GNericRPRowStats } from "./rprowstatus";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { GNericDmgConfModal } from "./dmgconfmodal.component";
import { ElemTypes } from "../elemtypes";
import { map } from "rxjs";

@Component({
    selector: 'gneric-rpm',
    templateUrl: './rpm.component.html',
    imports: [GNericRPMRow, GNericDmgConfModal, ReactiveFormsModule]
})
export class GNericRessourcePointsManager {

    id = "comp-03-03";
    fullId = "ressource-points-"+this.id;

    showTextsCheckbox = new FormControl(true);
    textVisible = Boolean(this.showTextsCheckbox.value);

    absorbCheckbox = new FormControl();

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

    deleteRPMEvent = output<string>();
    gNericElemChangedEvent = output<object>();

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
        this.silentlyAddRow();
        this.redistributeDamage();
        this.fireElemChangeEvent();
    }

    silentlyAddRow(): void {
        this.rows.push(new GNericRPRowStats(this.rows.length, this.getPointsPerRow()));
    }

    removeRow(): void {
        if(this.silentlyRemoveRow()) {
            this.redistributeDamage();
            this.fireElemChangeEvent();
        }
    }

    silentlyRemoveRow(): boolean {
        const doIt = this.rows.length > 1;
        if(doIt) {
            this.rows.splice(this.rows.length-1, 1);
        }
        return doIt;
    }

    addCol(): void {
        this.silentlyAddCol();
        this.redistributeDamage();
        this.fireElemChangeEvent();
    }

    silentlyAddCol(): void {
        this.rows.forEach(row => {
            row.addPoint();    
        });
    }
    
    removeCol(): void {
        if(this.silentlyRemoveCol()) {
            this.redistributeDamage();
            this.fireElemChangeEvent();
        }
    }

    silentlyRemoveCol(): boolean {
        if(this.getPointsPerRow() < 2) {
            return false;
        }
        
        this.rows.forEach(row => {
            row.removePoint();
        });
        return true;
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

        if(Boolean(this.absorbCheckbox.value)) {
            delta.absorb();
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

        this.fireElemChangeEvent();
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
        this.fireElemChangeEvent();
    }

    updateTextVisibility(): void {
        this.textVisible = Boolean(this.showTextsCheckbox.value);
        this.fireElemChangeEvent();
    }

    fireDeleteRPMEvent(): void {
        this.deleteRPMEvent.emit(this.id);
    }

    fireElemChangeEvent(): void {
        const mapping: any = {};
        for (const [key, val] of this.tierMap) {
            mapping[String(key)] = val;
        }

        const texts: string[] = [];
        this.rows.forEach(row => {
            texts.push(row.getText());
        });

        const model = {
            id: this.id,
            type: ElemTypes.rpm,
            rows: this.rows.length,
            cols: this.getPointsPerRow(),
            showTexts: this.textVisible,
            useAbsorbtion: Boolean(this.absorbCheckbox.value),
            tierMap: mapping,
            texts: texts,
            damage: this.damage.getValues()
        };

        this.gNericElemChangedEvent.emit(model);
    }

    setModel(model: any): void {

        // TODO: validate input

        // adapt number of rows and cols
        let ok: boolean = true;
        while(this.getPointsPerRow() > model.cols && ok) {
            ok = this.silentlyRemoveCol();
        }
        while(this.getPointsPerRow() < model.cols) {
            this.silentlyAddCol();
        }

        ok = true;
        while(this.rows.length > model.rows && ok) {
            ok = this.silentlyRemoveRow();
        }
        while(this.rows.length < model.rows) {
            this.silentlyAddRow();
        }

        // adapt damage and tier mapping
        if(!this.damage.isEqualDamage(model.damage)) {
            this.damage = new GNericDamage(model.damage);
        }
        this.tierMap = new Map<string, number>();
        for (const key in model.tierMap) {
            this.tierMap.set(key, model.tierMap[key]);
        }

        // adapt settings
        this.showTextsCheckbox.setValue(model.showTexts);
        this.textVisible = model.showTexts;
        this.absorbCheckbox.setValue(model.useAbsorbtion);
        for (let idx = 0; idx < this.rows.length; idx++) {
            this.rows[idx].setText(model.texts[idx]);
        }

        // update
        this.updateRegexPattern();
        this.redistributeDamage();
    }

    ngOnInit() {
        this.mapDamageTier('', 3);
        this.updateRegexPattern();
    }

}