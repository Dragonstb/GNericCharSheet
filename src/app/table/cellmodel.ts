export class CellModel {

    text: string;

    constructor(text: string) {
        this.text = text;
    }

    getText(): string {
        return this.text;
    }

    setText(text: string): void {
        this.text = text;
    }
}