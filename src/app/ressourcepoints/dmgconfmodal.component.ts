import { Component, ViewChild, ElementRef } from "@angular/core";
import { GNericDmgConfigSetting } from "./dmgconfigsetting";
import { ReactiveFormsModule } from "@angular/forms";
import { GNericCross1 } from "./cross1.component";
import { GNericCross2 } from "./cross2.component";
import { GNericCross3 } from "./cross3.component";
import { GNericCross4 } from "./cross4.component";
import { GNericCross5 } from "./cross5.component";
import { GNericCross6 } from "./cross6.component";

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
        this.tiers.forEach(tier => {
            tier.rememberSettings();
        });
        this.dialog.nativeElement.close();
    }

}