import { GNericPageModel } from "../sheetpage/pagemodel";

export class GNericSheetModel {

    id: string;
    charname: string;
    pages: GNericPageModel[] = [];

    constructor(id: string, charname: string | undefined = undefined) {
        this.id = id;
        this.charname = charname ?? this.id;
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