import { computed, signal } from "@angular/core";
import { FormControl } from "@angular/forms";

export class CellModel {

    text = new FormControl('');
    width = signal(50);
    widthStyle = computed(() => "width: "+this.width()+"%;");

    constructor(text: string, width: number = 50) {
        this.text.setValue(text ?? '');
        this.width.set(width);
    }

    getText(): string {
        return this.text.value ?? '';
    }

    setText(text: string): void {
        this.text.setValue(text ?? '');
    }

    getWidth(): number {
        return this.width();
    }

    setWidth(width: number): void {
        this.width.set(width);
    }
}