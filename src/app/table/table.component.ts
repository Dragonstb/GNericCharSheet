import { Component, ElementRef, ViewChild } from "@angular/core";
import { CellModel } from "./cellmodel";
import { CdkDrag, CdkDragMove } from "@angular/cdk/drag-drop";
import { TableAlterer } from "./tablealterer";

@Component({
    selector: 'gneric-table',
    templateUrl: './table.component.html',
    styleUrl: './table.component.less',
    imports: [CdkDrag]
})
export class GNericTable {

    private notLockedInfo: string = "Current cell is last focused one.";

    maxCols: number = 6;
    minWidth: number = 10;
    equalDistributed: boolean = true;
    cellLocked: boolean = false;
    lefts: string[] = ['left: 0%;', 'left: 50%;'];
    lockInfo = this.notLockedInfo;

    minDist: number | undefined = undefined;
    maxDist: number | undefined = undefined;
    slope: number | undefined = undefined;
    iniLeftW: number | undefined = undefined;
    iniRightW: number | undefined = undefined;

    curRow: number = -1;
    curCol: number = -1;

    alterer: TableAlterer = new TableAlterer();

    @ViewChild('tableBody', {static: true}) tableBody!: ElementRef<HTMLTableSectionElement>;
    @ViewChild('dragContainer') dragContainer: ElementRef<HTMLDivElement> | undefined;

    windowResizeHandler = ()=>this.adaptNewSize();

    setEditable(editable: boolean): void {
        
    }

    addRowBeforeCurrent(): void {
        this.alterer.addRowAtIndex(this.curRow);
        ++this.curRow;
        this.updateLockInfo(this.cellLocked);
    }

    addRowAfterCurrent(): void {
        this.alterer.addRowAtIndex(this.curRow+1);
    }

    removeCurrentRow(): void {
        this.alterer.removeRowAtIndex(this.curRow);
        if(this.curRow >= this.getRows()) {
            this.curRow = this.getRows()-1;
        }
        this.updateLockInfo(false);
    }

    addColumnBeforeCurrent(): void {
        this.addColumnAtIndex(this.curCol);
        ++this.curCol;
        this.updateLockInfo(this.cellLocked);
    }

    addColumnAfterCurrent(): void {
        this.addColumnAtIndex(this.curCol+1);
    }

    addColumnAtIndex(idx: number): void {
        if(this.getCols()>=this.maxCols) {
            return;
        }

        const oldWidths = this.alterer.getColumnWidths();
        let widths: number[] = [];
        if(this.equalDistributed) {
            widths = this.getEqualWidths(100, this.getCols()+1);
        }
        else {
            let sum = 0;
            let diff = -1;
            let numSqueezedCols;
            do {
                sum = 0;
                numSqueezedCols = 1; // in the end: the current column, the new one, and the included neighbouring ones
                ++diff;
                for (let index = Math.max(this.curCol-diff, 0); index <= Math.min(this.curCol+diff, this.getCols()-1); index++) {
                    sum += oldWidths[index];
                    ++numSqueezedCols;
                }
            } while (sum < numSqueezedCols*this.minWidth && diff < this.maxCols/2);

            // keep widths left of squeezed area
            for (let index = 0; index < this.curCol-diff; index++) {
                widths.push(oldWidths[index]);
            }
            
            // squeeze into squeezed area
            const w = Math.floor(sum / numSqueezedCols);
            const r = sum % numSqueezedCols;
            for (let index = 0; index < numSqueezedCols; index++) {
                const val = index < r ? w+1 : w;
                widths.push(val);
            }
            
            // keep widths rigth of squeezed area
            for (let index = this.curCol+diff+1; index < oldWidths.length; index++) {
                widths.push(oldWidths[index]);
            }
        }

        /*
        this.content.forEach((row) => {
            const cell = new CellModel('');
            row.splice(idx, 0, cell);
            for (let col = 0; col < row.length; col++) {
                row[col].setWidth(widths[col]);                
            }
        });*/

        this.alterer.addColumnAtIndex(idx);
        this.alterer.setColumnWidths(widths);

        this.rearrangeShifters();
    }
    
    removeCurrentColumn(): void {
        const numCols = this.getCols();
        let widths = this.getEqualWidths(100, numCols-1);

        if(!this.equalDistributed) {
            widths = this.alterer.getColumnWidths();
            const freed = widths[this.curCol];
            let toRight = Math.floor(freed/2);
            let toLeft = freed % 2 == 0 ? toRight : toRight+1; // spare percent goes to the left

            if(this.curCol == 0) {
                // transfer entire width of first column to second column
                widths[1] += freed;
            }
            else if(this.curCol == numCols-1) {
                // transfer entire wisths of last column to penultimate one
                const idx = this.curCol-1
                widths[idx] += freed;
            }
            else{
                // split widths as equallt as possible to neighbouring columns
                let idx = this.curCol-1
                widths[idx] += toLeft;

                idx = this.curCol+1
                widths[idx] += toRight;
            }
        }
        widths.splice(this.curCol, 1);

        this.alterer.removeColumnAtIndex(this.curCol);
        this.alterer.setColumnWidths(widths);

        if(this.curCol >= this.getCols()) {
            this.curCol = this.getCols()-1;
        }

        this.updateLockInfo(false);
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

    distrubuteColumnsEqually(): void {
        const widths = this.getEqualWidths(100, this.getCols());
        this.alterer.setColumnWidths(widths);
        this.equalDistributed = true;
        this.rearrangeShifters();
    }

    setSelectedCell(event: Event): void {
        if(this.cellLocked) {
            return;
        }

        const target = event.target as HTMLInputElement;
        const cell = target.parentElement as HTMLTableCellElement;
        const row = cell.parentElement as HTMLTableRowElement;
        this.setCurrentClass(false);
        this.curRow = row.rowIndex;
        this.curCol = cell.cellIndex;
        this.setCurrentClass(true);
    }

    setAndLockSelectedCell(event: Event): void {
        /* NOTE: Event 'contextmenu' not available for iOS devices as of Nov 2025, see
         * https://developer.mozilla.org/en-US/docs/Web/API/Element/contextmenu_event#browser_compatibility
         */
        event.preventDefault();
        const target = event.target as HTMLInputElement;
        const cell = target.parentElement as HTMLTableCellElement;
        const row = cell.parentElement as HTMLTableRowElement;

        const rowIndex = row.rowIndex;
        const colIndex = cell.cellIndex;
        if(rowIndex != this.curRow || colIndex != this.curCol || !this.cellLocked) {
            this.setCurrentClass(false);
            this.curRow = rowIndex;
            this.curCol = colIndex;
            this.updateLockInfo(true);
            this.setCurrentClass(true);
        }
        else {
            this.updateLockInfo(false)
            this.setCurrentClass(false);
        }
    }

    updateLockInfo(locked: boolean): void {
        this.lockInfo = locked? "Current cell locked to row "+(this.curRow+1)+", column "+(this.curCol+1) : this.notLockedInfo;
        this.cellLocked = locked;
    }

    setCurrentClass(current: boolean): void {
        const row = this.tableBody.nativeElement.childNodes[this.curRow] as HTMLTableRowElement;
        if(!row) {
            return;
        }
        const cell = row.childNodes[this.curCol] as HTMLTableCellElement;
        if(current) {
            cell.classList.add('current');
            cell.childNodes.forEach((child) => {(child as HTMLElement).classList.add('current')});
        }
        else {
            cell.classList.remove('current');
            cell.childNodes.forEach((child) => {(child as HTMLElement).classList.remove('current')});
        }
    }

    rearrangeShifters(): void {
        setTimeout(()=>{
            const cw = 27;
            let lefts: string[] = [];
            const row = this.tableBody.nativeElement.firstChild as HTMLTableRowElement;
            let sum = 0;
            let counter = 0;
            row.childNodes.forEach(col => {
                const cell = col as HTMLTableCellElement;
                if(cell.offsetLeft) {
                    sum += cell.offsetLeft;
                    lefts.push('left: '+(cell.offsetLeft-counter*cw+cw/2)+'px;');
                    counter++;
                }
            });
                            
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

        let widths = this.alterer.getColumnWidths();
        this.iniLeftW = widths[leftIdx];
        this.iniRightW = widths[rightIdx];

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
        this.equalDistributed = false;

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

        let widths = this.alterer.getColumnWidths();
        this.alterer.setColumnWidth(index-1, newLeftW);
        this.alterer.setColumnWidth(index, newRightW);
    }

    adaptNewSize(): void {
        this.rearrangeShifters();
    }

    getRows(): number {
        return this.alterer.getRows();
    }

    getCols(): number {
        return this.alterer.getCols();
    }

    ngOnInit() {
        this.rearrangeShifters();
        window.addEventListener("resize", this.windowResizeHandler);
    }

    ngOnDestroy() {
        window.removeEventListener("resize", this.windowResizeHandler);
    }
}