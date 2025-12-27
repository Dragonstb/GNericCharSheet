import { GNericPageModel } from "../sheetpage/pagemodel";

export class GNericSheetModel {

    id: string;
    charname: string;
    pages: GNericPageModel[] = [];

    constructor(id: string, charname: string | undefined = undefined) {
        this.id = id;
        this.charname = charname ?? this.id;
        this.pages = [
            new GNericPageModel('page-0', 'General'),
            new GNericPageModel('page-1', 'Items'),
            new GNericPageModel('page-2', 'Spells')
        ]
    }

    getId(): string {
        return this.id;
    }

    getCharName(): string {
        return this.charname;
    }

    getPages(): GNericPageModel[] {
        return this.pages;
    }

    addPage(page: GNericPageModel): void {
        this.pages.push(page);
    }
}