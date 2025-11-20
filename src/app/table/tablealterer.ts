import { CellModel } from "./cellmodel";

export class TableAlterer {

    content: CellModel[][] = [
        [new CellModel('r1c1'), new CellModel('r1c2')],
        [new CellModel('r2c1'), new CellModel('r2c2')],
        [new CellModel('r3c1'), new CellModel('r3c2')],
    ];

    addRowAtIndex(idx: number): void {
        let newRow: CellModel[] = [];
        let row = this.content[0];
        for (let column = 0; column < this.getCols(); column++) {
            const width = row[column].getWidth();
            newRow.push(new CellModel('', width));
        }
        this.content.splice(idx, 0, newRow);
    }
    
    removeRowAtIndex(idx: number): void {
        this.content.splice(idx, 1);
    }

    addColumnAtIndex(idx: number): void {
        this.content.forEach((row) => {
            const cell = new CellModel('');
            row.splice(idx, 0, cell);
        });
    }

    removeColumnAtIndex(idx: number): void {
        this.content.forEach((row)=>{
            row.splice(idx, 1);
        });
    }

    setColumnWidths(widths: number[]): void {
        this.content.forEach((row) => {
            for (let col = 0; col < row.length; col++) {
                row[col].setWidth(widths[col]);                
            }
        });
    }

    setColumnWidth(index: number, width: number): void {
        this.content.forEach(row => {
            row[index].setWidth(width);
        });
    }

    getColumnWidths(): number[] {
        let widths: number[] = [];
        this.content[0].forEach(col => {
            widths.push(col.getWidth());
        });
        return widths;
    }

    getRows(): number {
        return this.content.length;
    }

    getCols(): number {
        return this.content[0].length;
    }

    setContent(model: any) {
        const texts = model.texts;
        const widths = model.widths;
        let cells: CellModel[][] = [];

        for (const row of texts) {
            let rowModel: CellModel[] = [];
            for (let idx = 0; idx < row.length; idx++) {
                const cell = new CellModel(row[idx], widths[idx]);
                rowModel.push(cell);
            }
            cells.push(rowModel);
        }

        this.content = cells;
    }

    getContent(): string[][] {
        const arr: string[][] = [];
        for (const row of this.content) {
            const contentRow: string[] = [];
            for (const cell of row) {
                contentRow.push(cell.getText());
            }
            arr.push(contentRow);
        }

        return arr;
    }

}