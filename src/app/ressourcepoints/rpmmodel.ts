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
    private textVisible = Boolean(this.showTextsCheckbox.value);
    private damage = new GNericDamage();

    rows: GNericRPRowStats[] = [
        new GNericRPRowStats(0, 4)
    ];

    constructor(id: string, title: string = '') {
        super(id, title ?? id, ElemTypes.rpm);
    }

    // _______________ useful methods _______________

    private getPointsPerRow() {
        return this.rows[0].getNumPoints();
    }

    redistributeDamage(): void {
        let useDmg = this.damage;
        this.rows.forEach(row =>{
            useDmg = row.distributeDamage(useDmg);
        });
    }

    // _______________ change model _______________

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
            showTexts: this.textVisible,
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
        
        this.tierMap = new Map<string, number>();
        for (const key in model.tierMap) {
            this.tierMap.set(key, model.tierMap[key]);
        }
        
        // adapt damage and tier mapping
        if(!this.damage.isEqualDamage(model.damage)) {
            this.damage = new GNericDamage(model.damage);
        }

        // adapt settings
        this.showTextsCheckbox.setValue(model.showTexts);
        this.absorbCheckbox.setValue(model.useAbsorbtion);
        for (let idx = 0; idx < this.rows.length; idx++) {
            this.rows[idx].setText(model.texts[idx]);
        }

        this.title.setValue(model.title);
        this.textVisible = model.showTexts;
        
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

        if(!model.hasOwnProperty('rows') || !model.rows || typeof model.rows !== 'number') {
            return false;
        }

        if(!model.hasOwnProperty('cols') || !model.cols || typeof model.cols !== 'number') {
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