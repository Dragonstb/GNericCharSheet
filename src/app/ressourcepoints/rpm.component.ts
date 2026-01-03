import { Component, ViewChild, ElementRef, output, inject, NgZone, Input } from "@angular/core";
import { GNericRPMRow } from "./rpmrow.component";
import { GNericDamage } from "./damage";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { GNericDmgConfModal } from "./dmgconfmodal.component";
import { RPMModel } from "./rpmmodel";
import { ElemModel } from "../block/elemmodel";

@Component({
    selector: 'gneric-rpm',
    templateUrl: './rpm.component.html',
    imports: [GNericRPMRow, GNericDmgConfModal, ReactiveFormsModule]
})
export class GNericRessourcePointsManager {

    ngZone = inject(NgZone);

    elemModel: RPMModel = new RPMModel("comp-01-01");

    @Input()
    set elem(val: ElemModel) {
        if(val instanceof RPMModel) {
            this.elemModel = val;
        }
    }

    pattern = /^[+\-=]?([A-Za-z]?\d+)([A-Za-z]\d+)*$/;
    dmgInput: FormControl = new FormControl('');
    editable: boolean = true;

    @ViewChild('fieldSet', {static: true}) fieldSet!: ElementRef<HTMLFieldSetElement>;
    @ViewChild('checkmark') checkmark: ElementRef | undefined;
    @ViewChild('modal') modal!: GNericDmgConfModal;

    deleteCoreElemEvent = output<string>();
    gNericElemChangedEvent = output<object>();

    setEditable(editable: boolean): void {
        this.editable = editable;
        const hasEditableClass = this.fieldSet.nativeElement.classList.contains('editable');
        if(editable && !hasEditableClass) {
            this.fieldSet.nativeElement.classList.add('editable');
        }
        else if(!editable && hasEditableClass) {
            this.fieldSet.nativeElement.classList.remove('editable');
        }
    }

    addRow(): void {
        this.elemModel.addRow();
        this.fireElemChangeEvent();
    }

    removeRow(): void {
        if(this.elemModel.removeRow()) {
            this.fireElemChangeEvent();
        }
    }

    addCol(): void {
        this.elemModel.addCol();
        this.fireElemChangeEvent();
    }

    removeCol(): void {
        if(this.elemModel.removeCol()) {
            this.fireElemChangeEvent();
        }
    }

    onDmgInput() {
        // Toggle checkmark that appears if and only if the value of the damage input is a valid damage string
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
            
            const damageTier = this.elemModel.getDamageTierOfKey(key);
            if(!damageTier) {
                // TODO: log
                continue;
            }

            delta.setTieredDamage(damageTier, damageNumber);
        }

        if(Boolean(this.elemModel.isAbsorbing())) {
            delta.absorb();
        }

        switch(inString[0]) {
            case '-':
                this.elemModel.addDamage(delta);
                break;
            case '=':
                this.elemModel.setDamage(delta);
                break;
            default:
                this.elemModel.subtractDamage(delta);
        }
        this.elemModel.redistributeDamage();

        this.dmgInput.setValue('');
        if(this.checkmark) {
            this.checkmark.nativeElement.classList.add('hidden');
        }

        this.fireElemChangeEvent();
    }

    mapDamageTier(key: string, tier: number): void {
        this.elemModel.mapDamageTier(key, tier);
    }

    updateRegexPattern() {
        let arr: string[] = ['^[+\\-=]?(['];
        for (const key of this.elemModel.getTierMapKeys()) {
            arr.push(key);
        }
        arr.push(']');
        if(this.elemModel.isTierKey(String(''))) {
            arr.push('?');
        }
        arr.push('\\d+)([');
        for (const key of this.elemModel.getTierMapKeys()) {
            arr.push(key);
        }
        arr.push(']\\d+)*$');

        const str = arr.join('');
        this.pattern = new RegExp(str);
    }

    updateDmgConfig(newMap: Map<string, number>): void {
        // set damage of now obsolete tiers to 0
        forloop:
        for (const oldVal of this.elemModel.getTierMapValues()) {
            for (const newVal of newMap.values()) {
                if(newVal === oldVal) {
                    continue forloop;
                }
            }
            this.elemModel.setTieredDamage(oldVal, 0);
        }

        this.elemModel.setTierMap(newMap);
        this.updateRegexPattern();
        this.fireElemChangeEvent();
    }

    updateTextVisibility(): void {
        this.fireElemChangeEvent();
    }

    fireDeleteRPMEvent(): void {
        this.deleteCoreElemEvent.emit(this.elemModel.getId());
    }

    fireElemChangeEvent(): void {
        const model = this.elemModel.getModel();
        this.gNericElemChangedEvent.emit(model);
    }
    
    ngOnInit() {
        this.updateRegexPattern();
    }

    hasTitle(): boolean {
        return Boolean(this.elemModel.getTitle());
    }

}