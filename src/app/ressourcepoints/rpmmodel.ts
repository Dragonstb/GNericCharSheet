import { FormControl } from "@angular/forms";
import { ElemModel } from "../block/elemmodel";
import { ElemTypes } from "../elemtypes";
import { GNericRPRowStats } from "./rprowstatus";
import { GNericDamage } from "./damage";
import { ValidatorService } from "../../services/validator";

export class RPMModel extends ElemModel {

    private tierMap: Map<string, number> = new Map();
    absorbCheckbox = new FormControl();
    showTextsCheckbox = new FormControl(true);
    private damage = new GNericDamage();

    rows: GNericRPRowStats[] = [
        new GNericRPRowStats(0, 4)
    ];

    constructor(id: string, title: string = '') {
        super(id, title ?? id, ElemTypes.rpm);
        this.mapDamageTier('', 3);
    }

    // _______________ useful methods _______________

    getPointsPerRow() {
        return this.rows[0].getNumPoints();
    }

    redistributeDamage(): void {
        let useDmg = this.damage;
        this.rows.forEach(row =>{
            useDmg = row.distributeDamage(useDmg);
        });
    }

    getDamageTierOfKey(key: string): number | undefined {
        return this.tierMap.get(key);
    }

    isAbsorbing(): boolean {
        return Boolean(this.absorbCheckbox.value);
    }

    getTierMapKeys(): MapIterator<string> {
        return this.tierMap.keys();
    }

    getTierMapValues(): MapIterator<number> {
        return this.tierMap.values();
    }

    isTierKey(key: string): boolean {
        return this.tierMap.has(key);
    }

    getTierMap(): Map<string, number> {
        return this.tierMap;
    }

    isTextVisible(): boolean {
        return Boolean(this.showTextsCheckbox.value);
    }

    getRows(): GNericRPRowStats[] {
        return this.rows;
    }

    // _______________ change model _______________
    
    addDamage(dmg: GNericDamage): void {
        this.damage.addDamage(dmg);
    }

    subtractDamage(dmg: GNericDamage): void {
        this.damage.subtractDamage(dmg);
    }

    setDamage(dmg: GNericDamage): void {
        this.damage = dmg;
    }

    setTieredDamage(tier: number, dmg: number): void {
        this.damage.setTieredDamage(tier, dmg);
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

    setTierMap(newMap: Map<string, number>): void {
        this.tierMap = newMap;
        this.redistributeDamage();
    }

    addRow(): void {
        this.rows.push(new GNericRPRowStats(this.rows.length, this.getPointsPerRow()));
        this.redistributeDamage();
    }

    removeRow(): boolean {
        const doIt = this.rows.length > 1;
        if(doIt) {
            this.rows.splice(this.rows.length-1, 1);
            this.redistributeDamage();
        }
        return doIt;
    }

    addCol(): void {
        this.rows.forEach(row => {
            row.addPoint();    
        });
        this.redistributeDamage();
    }

    removeCol(): boolean {
        if(this.getPointsPerRow() < 2) {
            return false;
        }
        
        this.rows.forEach(row => {
            row.removePoint();
        });
        this.redistributeDamage();
        return true;
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
        this.redistributeDamage();
    }

    // _______________ modeling _______________

    override getModel(): object {
        const mapping: any = {};
        for (const [key, val] of this.tierMap) {
            mapping[String(key)] = val;
        }

        const texts: string[] = [];
        this.rows.forEach(row => {
            texts.push(row.getText() ?? '');
        });
        
        const model = {
            id: this.getId(),
            type: this.getType(),
            title: this.title.value ?? '',
            rows: this.rows.length,
            cols: this.getPointsPerRow(),
            showTexts: Boolean(this.showTextsCheckbox.value),
            useAbsorbtion: Boolean(this.absorbCheckbox.value),
            tierMap: mapping,
            texts: texts,
            damage: this.damage.getValues()
        };

        return model;
    }

    override updateModel(model: any): boolean {
        if(!this.validateModel(model)) {
            return false;
        }
        
        // adapt damage and tier mapping
        if(!this.damage.isEqualDamage(model.damage)) {
            this.damage = new GNericDamage(model.damage);
        }
        
        const newMap = new Map<string, number>();
        for (const key in model.tierMap) {
            newMap.set(key, model.tierMap[key]);
        }
        
        this.updateDmgConfig(newMap);

        // adapt settings
        this.showTextsCheckbox.setValue(model.showTexts);
        this.absorbCheckbox.setValue(model.useAbsorbtion);
        for (let idx = 0; idx < this.rows.length; idx++) {
            this.rows[idx].setText(model.texts[idx]);
        }

        this.title.setValue(model.title);
        
        let ok: boolean = true;
        while(this.getPointsPerRow() > model.cols && ok) {
            ok = this.removeCol();
        }
        while(this.getPointsPerRow() < model.cols) {
            this.addCol();
        }
    
        ok = true;
        while(this.rows.length > model.rows && ok) {
            ok = this.removeRow();
        }
        while(this.rows.length < model.rows) {
            this.addRow();
        }

        return true;
    }

    // _______________ validate _______________

    validateModel(model: any): boolean {
        if(!ValidatorService.isModel(model)) {
            return false;
        }

        if(!ValidatorService.isForMe(this.getId(), this.getType(), model)) {
            return false;
        }

        if(!ValidatorService.hasNumberArray('damage', model)) {
            return false;
        }

        if(!ValidatorService.hasStringArray('texts', model)) {
            return false;
        }

        if(!ValidatorService.hasFiniteIntegerProperty('rows', model)) {
            return false;
        }
        
        if(!ValidatorService.hasFiniteIntegerProperty('cols', model)) {
            return false;
        }

        if(!model.hasOwnProperty('showTexts') || typeof model.showTexts !== 'boolean') {
            return false;
        }

        if(!model.hasOwnProperty('useAbsorbtion') || typeof model.useAbsorbtion !== 'boolean') {
            return false;
        }

        if(!model.hasOwnProperty('tierMap') || !model.tierMap || typeof model.tierMap !== 'object') {
            return false;
        }

        if(!ValidatorService.hasStringProperty('title', model)) {
            return false;
        }

        // check constraints

        if(model.rows < 1 || model.cols < 1) {
            return false;
        }

        if(model.rows !== model.texts.length) {
            return false;
        }

        if(model.damage.length !== this.damage.getNumTiers()) {
            return false;
        }

        for (const dmg of model.damage) {
            if(dmg < 0) {
                return false;
            }
        }

        // check constraints of mapping

        // TODO: this is basically the same code as used in the form validator of the RPM damage config modal
        let uniqueKeys = true; // each key once among all active tiers
        let activatedOne = false; // at least one tier must be active
        let justProperTiers = true; // only valid tiers are mapped
        let uniqueTiers = true; // each tier is used only once
    
        let keysInUse: string[] = [];
        let tiersInUse: number[] = [];
        for (const key in model.tierMap) {
            if(key.length < 2 && keysInUse.indexOf(key) < 0) {
                keysInUse.push(key);
                activatedOne = true;
            }
            else {
                uniqueKeys = false;
                break;
            }

            const val = model.tierMap[key];
            if(val >= 1 && val <= this.damage.getNumTiers()) {
                if(tiersInUse.indexOf(val) < 0) {
                    tiersInUse.push(val);
                }
                else {
                    uniqueTiers = false;
                    break;
                }
            }
            else {
                justProperTiers = false;
                break;
            }
        }

        if(!uniqueKeys || !activatedOne || !justProperTiers || !uniqueTiers || keysInUse.length > this.damage.getNumTiers()) {
            return false;
        }

        return true;
    }

}