import { FormControl } from "@angular/forms";

export class GNericBoxRowModel {

    text = new FormControl('');
    checkbox = new FormControl(false);

    setText(text: string): void {
        this.text.setValue(text ?? '');
    }

    getText(): string {
        return this.text.value ?? '';
    }

    setChecked(checked: boolean): void {
        this.checkbox.setValue(checked);
    }

    getChecked(): boolean {
        return this.checkbox.value ?? false;
    }

}