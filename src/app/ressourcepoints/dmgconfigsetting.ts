import { FormControl, FormGroup } from "@angular/forms";

export class GNericDmgConfigSetting {
    tier: number;
    form = new FormGroup({
        checked: new FormControl(false),
        keyLetter: new FormControl('')
    });
    oldChecked: boolean;
    oldKey: string;

    constructor(tier: number, checked: boolean = false, key: string = '') {
        this.tier = tier;
        this.oldChecked = checked;
        this.oldKey = key;
        this.form.setValue({
            checked: this.oldChecked,
            keyLetter: this.oldKey
        })
    }
    
    restoreSettings(): void {
        this.form.setValue({
            checked: this.oldChecked,
            keyLetter: this.oldKey
        })
    }

    rememberSettings(): void {
        const chk = this.form.value.checked;
        this.oldChecked = chk ? chk : false;

        const key = this.form.value.keyLetter;
        this.oldKey = (key || key === '') ? key : '?';
    }
}