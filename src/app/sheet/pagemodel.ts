export class GNericPageModel {

    private id: string;
    private title: string;

    constructor(id: string, title: string | undefined) {
        this.id = id;
        this.title = title ?? id;
    }

    getId(): string {
        return this.id;
    }

    getTitle(): string {
        return this.title;
    }

    setTitle(title: string): void {
        this.title = title;
    }
}