import { GNericPageModel } from "../sheetpage/pagemodel";

export class GNericSheetModel {

    id: string;
    pages: GNericPageModel[] = [];

    constructor(id: string) {
        this.id = id;
    }
}