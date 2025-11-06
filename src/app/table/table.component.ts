import { Component, ElementRef, ViewChild } from "@angular/core";

@Component({
    selector: 'gneric-table',
    templateUrl: './table.component.html'
})
export class GNericTable {

    maxCols: number = 6;

    rows: number = 3;
    cols: number = 2;
    curRow: number = -1;
    curCol: number = -1;
    @ViewChild('tableBody', {static: true}) tableBody!: ElementRef<HTMLTableSectionElement>;

    setEditable(editable: boolean): void {
        
    }

    addRowBeforeCurrent(): void {
        this.addRowAtIndex(this.curRow);
    }

    addRowAtIndex(idx: number): void {
        const tbl = this.tableBody.nativeElement;
        tbl.childNodes.forEach( (trow) => {
            const elem = trow as HTMLTableRowElement;
            if(elem.rowIndex == idx) {
                console.log('insert here');
            }
            console.log(elem.rowIndex);
        });

        // ++this.rows;
    }

    addColumnBeforeCurrent(): void {
        this.addColumnAtIndex(this.curCol);
    }

    addColumnAtIndex(idx: number): void {
        if(this.cols>=this.maxCols) {
            return;
        }

        const tbl = this.tableBody.nativeElement;
        tbl.childNodes.forEach( (trow) => {
            trow.childNodes.forEach( (cell) => {
                const elem = cell as HTMLTableCellElement;
                if(elem.cellIndex == idx) {
                    console.log('insert here');
                }
                console.log(elem.cellIndex);
            });
            console.log('----------------');
        });

        // ++this.cols;
    }

    setSelectedCell(event: Event): void {
        const target = event.target as HTMLInputElement;
        const cell = target.parentElement as HTMLTableCellElement;
        const row = cell.parentElement as HTMLTableRowElement;
        this.curRow = row.rowIndex;
        this.curCol = cell.cellIndex;
    }

}