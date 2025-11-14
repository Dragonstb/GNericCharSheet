import { FormControl } from "@angular/forms";

export class GNericDmgConfigSetting {
    tier: number;
    checked = new FormControl(false);
    keyLetter = new FormControl('');
    oldChecked: boolean;
    oldKey: string;

    constructor(tier: number, checked: boolean = false, key: string = '') {
        this.tier = tier;
        this.oldChecked = checked;
        this.oldKey = key;
        this.checked.setValue(this.oldChecked);
        this.keyLetter.setValue(this.oldKey);
    }
    
    restoreSettings(): void {
        this.checked.setValue(this.oldChecked);
        this.keyLetter.setValue(this.oldKey);
    }

    rememberSettings(): void {
        this.oldChecked = this.checked.value ? this.checked.value : false;
        this.oldKey = this.keyLetter.value !== null ? this.keyLetter.value : '?';
    }
}