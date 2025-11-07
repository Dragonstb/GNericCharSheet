import { computed, signal } from "@angular/core";

export class CellModel {

    text: string;
    width = signal(50);
    widthStyle = computed(() => "width: "+this.width()+"%;");

    constructor(text: string, width: number = 50) {
        this.text = text;
        this.width.set(width);
    }

    getText(): string {
        return this.text;
    }

    setText(text: string): void {
        this.text = text;
    }

    getWidth(): number {
        return this.width();
    }

    setWidth(width: number): void {
        this.width.set(width);
    }
}