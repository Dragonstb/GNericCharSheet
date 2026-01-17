import { ElemTypes } from "../elemtypes";
import { GNericSheetModel } from "../sheet/sheetmodel";

export class GNericSheetCollectionModel {

    sheets: GNericSheetModel[] = [
        new GNericSheetModel('char0', 'Alex Anyone'),
        new GNericSheetModel('char1', 'Chris Cameo'),
        new GNericSheetModel('char2', 'Sam Someone')
    ];

    // _______________  changes  _______________

    addSheet(newSheet: GNericSheetModel): void {
        this.sheets.push(newSheet);
    }

    // _______________  getters  _______________

    getSheetById(id: string): GNericSheetModel | undefined {
        for (const sheet of this.sheets) {
            if(sheet.getId() === id) {
                return sheet;
            }            
        }

        return undefined;
    }

    getModel(): object {
        const sheetModels: object[] = [];
        this.sheets.forEach(sheet => {
            const mdl = sheet.getModel();
            sheetModels.push(mdl);
        });

        return {
            type: ElemTypes.sheetcollection,
            content: sheetModels
        }
    }
}