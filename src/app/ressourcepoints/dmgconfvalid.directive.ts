import { AbstractControl, FormArray, ValidationErrors, ValidatorFn } from "@angular/forms";

export const dmgConfValidator: ValidatorFn = (control: AbstractControl):
ValidationErrors | null => {
    let tierSettings = control.get('tierSettings') as FormArray;

    let uniqueUsage = true; // each key once among all active tiers
    let activatedOne = false; // at least one tier must be active

    let keysInUse: string[] = [];
    for (const tier of tierSettings.controls) {
        if(tier.value.checked) {
            const key = tier.value.keyLetter;
            if(keysInUse.indexOf(key) < 0) {
                keysInUse.push(key);
                activatedOne = true;
            }
            else {
                uniqueUsage = false;
                break;
            }
        }
    }

    return activatedOne && uniqueUsage ? null : {invalid: true};
};