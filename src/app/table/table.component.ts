import { Component, ElementRef, ViewChild } from "@angular/core";
import { CellModel } from "./cellmodel";
import { CdkDrag, CdkDragMove } from "@angular/cdk/drag-drop";

@Component({
    selector: 'gneric-table',
    templateUrl: './table.component.html',
    styleUrl: './table.component.less',
    imports: [CdkDrag]
})
export class GNericTable {

    maxCols: number = 6;
    minWidth: number = 10;
    equalDistributed: boolean = true;
    lefts: any[] = [{text:'left: 50%;'}, {text:'left: 100%;'}];

    minDist: number | undefined = undefined;
    maxDist: number | undefined = undefined;
    slope: number | undefined = undefined;
    iniLeftW: number | undefined = undefined;
    iniRightW: number | undefined = undefined;

    curRow: number = -1;
    curCol: number = -1;
    content: CellModel[][] = [
        [new CellModel('r1c1'), new CellModel('r1c2')],
        [new CellModel('r2c1'), new CellModel('r2c2')],
        [new CellModel('r3c1'), new CellModel('r3c2')],
    ];

    @ViewChild('tableBody', {static: true}) tableBody!: ElementRef<HTMLTableSectionElement>;
    @ViewChild('dragContainer') dragContainer: ElementRef<HTMLDivElement> | undefined;

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
        let row = this.content[0];
        for (let column = 0; column < this.getCols(); column++) {
            const width = row[column].getWidth();
            newRow.push(new CellModel('', width));
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

        let widths: number[] = [];
        if(this.equalDistributed) {
            // each cell the same width; remainder is distributed among the first cols
            widths = this.getEqualWidths(100, this.getCols()+1);
            // const w = Math.floor(100 / (this.getCols()+1));
            // const r = 100 % (this.getCols()+1);
            // for (let index = 0; index < this.getCols()+1; index++) {
            //     const val = index < r ? w+1 : w;
            //     widths.push(val);
            // }
        }
        else {
            const row = this.content[0];
            
            let sum = 0;
            let diff = -1;
            let numSqueezedCols;
            do {
                sum = 0;
                numSqueezedCols = 1; // in the end: the current column, the new one, and the included neighbouring ones
                ++diff;
                for (let index = Math.max(this.curCol-diff, 0); index <= Math.min(this.curCol+diff, this.getCols()-1); index++) {
                    sum += row[index].getWidth();
                    ++numSqueezedCols;
                }
            } while (sum < numSqueezedCols*this.minWidth && diff < this.maxCols/2);

            // keep widths left of squeezed area
            for (let index = 0; index < this.curCol-diff; index++) {
                widths.push(row[index].getWidth());
            }
            
            // squeeze into squeezed area
            const w = Math.floor(sum / numSqueezedCols);
            const r = sum % numSqueezedCols;
            for (let index = 0; index < numSqueezedCols; index++) {
                const val = index < r ? w+1 : w;
                widths.push(val);
            }
            
            // keep widths rigth of squeezed area
            for (let index = this.curCol+diff+1; index < row.length; index++) {
                widths.push(row[index].getWidth());
            }
        }


        this.content.forEach((row) => {
            const cell = new CellModel('');
            row.splice(idx, 0, cell);
            for (let col = 0; col < row.length; col++) {
                row[col].setWidth(widths[col]);                
            }
        });
        this.rearrangeShifters();
    }
    
    removeCurrentColumn(): void {

        const numCols = this.getCols();
        let widths = this.getEqualWidths(100, numCols-1);

        // distribute freed space among the adjacent columns (if present)
        const freed = this.content[0][this.curCol].getWidth();
        let toRight = Math.floor(freed/2);
        let toLeft = freed % 2 == 0 ? toRight : toRight+1; // spare percent goes to the left
        
        this.content.forEach((row)=>{

            // update cell width
            if(this.equalDistributed) {
                let counter = 0;
                for (let idx = 0; idx < numCols; idx++) {
                    if(idx != this.curCol) {
                        row[idx].setWidth(widths[counter])
                        ++counter;
                    }                    
                }
            }
            else {
                if(this.curCol == 0) {
                    const curW = row[1].getWidth();
                    row[1].setWidth(curW+freed);
                }
                else if(this.curCol == numCols-1) {
                    const idx = this.curCol-1
                    const curW = row[idx].getWidth();
                    row[idx].setWidth(curW+freed);
                }
                else{
                    let idx = this.curCol-1
                    let curW = row[idx].getWidth();
                    row[idx].setWidth(curW+toLeft);
                    idx = this.curCol+1
                    curW = row[idx].getWidth();
                    row[idx].setWidth(curW+toRight);
                }
            }

            // remove row
            row.splice(this.curCol, 1);
        });

        if(this.curCol >= this.getCols()) {
            this.curCol = this.getCols()-1;
        }
        this.rearrangeShifters();
    }

    getEqualWidths(totalWidth: number, count: number): number[] {
        let widths: number[] = [];
        const w = Math.floor(totalWidth / count);
        const r = totalWidth % count;
        for (let idx = 0; idx < count; idx++) {
            const val = idx < r ? w+1 : w;
            widths.push(val);
        }

        return widths;
    }

    setSelectedCell(event: Event): void {
        const target = event.target as HTMLInputElement;
        const cell = target.parentElement as HTMLTableCellElement;
        const row = cell.parentElement as HTMLTableRowElement;
        this.curRow = row.rowIndex;
        this.curCol = cell.cellIndex;
    }

    rearrangeShifters(): void {
        setTimeout(()=>{
            const cw = 27;
            let lefts: any[] = [];
            const row = this.tableBody.nativeElement.firstChild as HTMLTableRowElement;
            let sum = 0;
            let counter = 0;
            row.childNodes.forEach(col => {
                const cell = col as HTMLTableCellElement;
                if(cell.offsetLeft) {
                    sum += cell.offsetLeft;
                    lefts.push({id: counter, text: 'left: '+(cell.offsetLeft-counter*cw+cw/2)+'px;'});
                    counter++;
                }
            });
            
            // let sum = 0;
            // this.content[0].forEach(cell => {
                //     sum += cell.width;
                //     lefts.push('left: '+sum+'%;');
                // });
                
            this.lefts = lefts;
        });
    }

    startDraggingShifter(index: number): void {
        if(!this.dragContainer) {
            return;
        }

        const contW = this.dragContainer.nativeElement.offsetWidth;
        this.slope = 100 / contW;

        const leftIdx = index-1;
        const rightIdx = index;

        this.iniLeftW = this.content[0][leftIdx].getWidth();
        this.iniRightW = this.content[0][rightIdx].getWidth();

        this.minDist = Math.min(-(this.iniLeftW-this.minWidth)/this.slope, 0);
        this.maxDist = Math.max((this.iniRightW-this.minWidth)/this.slope, 0);
    }

    endDraggingShifter(index: number): void {
        this.slope = undefined;
        this.minDist = undefined;
        this.maxDist = undefined;
        this.iniLeftW = undefined;
        this.iniRightW = undefined;
        this.rearrangeShifters();
    }

    moveDraggingShifter(event: CdkDragMove, index: number): void {
        if(!this.slope || this.minDist === undefined || this.maxDist === undefined || !this.iniLeftW || !this.iniRightW) {
            return;
        }

        let dist = event.distance.x;
        if(dist < this.minDist) {
            dist = this.minDist;
        }
        else if(dist > this.maxDist) {
            dist = this.maxDist;
        }

        const shift = Math.floor(this.slope*dist);
        const newLeftW = this.iniLeftW + shift;
        const newRightW = this.iniRightW - shift;

        this.content.forEach(row => {
            row[index-1].setWidth(newLeftW);
            row[index].setWidth(newRightW);
        });
    }

    getRows(): number {
        return this.content.length;
    }

    getCols(): number {
        return this.content[0].length;
    }
}