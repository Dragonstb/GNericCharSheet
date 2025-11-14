import { Component, ViewChild, ElementRef, inject, output } from "@angular/core";
import { GNericDmgConfigSetting } from "./dmgconfigsetting";
import { FormArray, FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { GNericCross1 } from "./cross1.component";
import { GNericCross2 } from "./cross2.component";
import { GNericCross3 } from "./cross3.component";
import { GNericCross4 } from "./cross4.component";
import { GNericCross5 } from "./cross5.component";
import { GNericCross6 } from "./cross6.component";
import { dmgConfValidator } from "./dmgconfvalid.directive";

@Component({
    selector: 'gneric-dcm',
    templateUrl: './dmgconfmodal.component.html',
    imports: [ReactiveFormsModule, GNericCross1, GNericCross2, GNericCross3, GNericCross4, GNericCross5, GNericCross6]
})
export class GNericDmgConfModal {

    tiers: GNericDmgConfigSetting[] = [
        new GNericDmgConfigSetting(1, true, ''),
        new GNericDmgConfigSetting(2, true, 'm'),
        new GNericDmgConfigSetting(3, true, 'c'),
        new GNericDmgConfigSetting(4),
        new GNericDmgConfigSetting(5),
        new GNericDmgConfigSetting(6)
    ]

    @ViewChild('dialog') dialog!: ElementRef<HTMLDialogElement>;
    setDmgConfigEvent = output<Map<string, number>>();

    private formBuilder = inject(FormBuilder);
    form = this.formBuilder.group(
        {tierSettings: this.formBuilder.array([])},
        {validators: dmgConfValidator}
    );

    openDmgTierConfigModal() {
        this.dialog.nativeElement.showModal();
    }

    cancel(): void {
        this.tiers.forEach(tier => {
            tier.restoreSettings();
        });
        this.dialog.nativeElement.close();
    }
    
    confirm(): void {
        let newMap: Map<string, number> = new Map();
        this.tiers.forEach(tier => {
            if(tier.form.value.checked) {
                const key = tier.form.value.keyLetter;
                if(key || key === '') {
                    newMap.set(key.toLowerCase(), tier.tier);
                }
                else {
                    // TODO: notify error
                    return;
                }
            }
        });

        this.tiers.forEach(tier => {
            tier.rememberSettings();
        });
        this.dialog.nativeElement.close();

        this.setDmgConfigEvent.emit(newMap);
    }

    ngOnInit() {
        let tierSettings = this.form.get('tierSettings') as FormArray;
        this.tiers.forEach(tier => {
            tierSettings.push(tier.form);
        });
    }
}