import { Component, ElementRef, ViewChild } from "@angular/core";
import { CellModel } from "./cellmodel";

@Component({
    selector: 'gneric-table',
    templateUrl: './table.component.html'
})
export class GNericTable {

    maxCols: number = 6;

    curRow: number = -1;
    curCol: number = -1;
    content: CellModel[][] = [
        [new CellModel('r1c1'), new CellModel('r1c2')],
        [new CellModel('r2c1'), new CellModel('r2c2')],
        [new CellModel('r3c1'), new CellModel('r3c2')],
    ];
    @ViewChild('tableBody', {static: true}) tableBody!: ElementRef<HTMLTableSectionElement>;

    setEditable(editable: boolean): void {
        
    }

    addRowBeforeCurrent(): void {
        this.addRowAtIndex(this.curRow);
    }

    addRowAfterCurrent(): void {
        this.addRowAtIndex(this.curRow+1);
    }

    addRowAtIndex(idx: number): void {
        let newRow: CellModel[] = [];
        for (let column = 0; column < this.getCols(); column++) {
            newRow.push(new CellModel(''));
        }
        this.content.splice(idx, 0, newRow);
    }

    removeCurrentRow(): void {
        this.content.splice(this.curRow, 1);
        if(this.curRow >= this.content.length) {
            this.curRow = this.content.length-1;
        }
    }

    addColumnBeforeCurrent(): void {
        this.addColumnAtIndex(this.curCol);
    }

    addColumnAfterCurrent(): void {
        this.addColumnAtIndex(this.curCol+1);
    }

    addColumnAtIndex(idx: number): void {
        if(this.getCols()>=this.maxCols) {
            return;
        }

        this.content.forEach((row) => {
            const cell = new CellModel('');
            row.splice(idx, 0, cell);
        });
    }

    removeCurrentColumn(): void {
        this.content.forEach((row)=>{
            row.splice(this.curCol, 1);
        });
        if(this.curCol >= this.getCols()) {
            this.curCol = this.getCols()-1;
        }
    }

    setSelectedCell(event: Event): void {
        const target = event.target as HTMLInputElement;
        const cell = target.parentElement as HTMLTableCellElement;
        const row = cell.parentElement as HTMLTableRowElement;
        this.curRow = row.rowIndex;
        this.curCol = cell.cellIndex;
    }

    getRows(): number {
        return this.content.length;
    }

    getCols(): number {
        return this.content[0].length;
    }
}