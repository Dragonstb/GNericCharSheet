import { Component, ElementRef, ViewChild } from "@angular/core";
import { CdkDrag } from "@angular/cdk/drag-drop";
import { TableAlterer } from "./tablealterer";
import { WidthController } from "./widthcontroller";

@Component({
    selector: 'gneric-table',
    templateUrl: './table.component.html',
    styleUrl: './table.component.less',
    imports: [CdkDrag]
})
export class GNericTable {

    private notLockedInfo: string = "Current cell is last focused one.";

    maxCols: number = 6;
    cellLocked: boolean = false;
    lockInfo = this.notLockedInfo;

    curRow: number = -1;
    curCol: number = -1;

    alterer: TableAlterer = new TableAlterer();
    widthController: WidthController = new WidthController(this.alterer);

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
        if(this.curRow >= this.alterer.getRows()) {
            this.curRow = this.alterer.getRows()-1;
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
        if(this.alterer.getCols()>=this.maxCols) {
            return;
        }

        const oldWidths = this.alterer.getColumnWidths();
        let widths: number[] = [];
        if(this.widthController.isEquallyDistributed()) {
            widths = this.widthController.getEqualWidths(100, this.alterer.getCols()+1);
        }
        else {
            let sum = 0;
            let diff = -1;
            let numSqueezedCols;
            do {
                sum = 0;
                numSqueezedCols = 1; // in the end: the current column, the new one, and the included neighbouring ones
                ++diff;
                for (let index = Math.max(this.curCol-diff, 0); index <= Math.min(this.curCol+diff, this.alterer.getCols()-1); index++) {
                    sum += oldWidths[index];
                    ++numSqueezedCols;
                }
            } while (sum < numSqueezedCols*this.widthController.getMinWidth() && diff < this.maxCols/2);

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

        this.alterer.addColumnAtIndex(idx);
        this.alterer.setColumnWidths(widths);

        this.widthController.rearrangeShifters();
    }
    
    removeCurrentColumn(): void {
        const numCols = this.alterer.getCols();
        let widths = this.widthController.getEqualWidths(100, numCols-1);

        if(!this.widthController.isEquallyDistributed()) {
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
                // split widths as equally as possible to neighbouring columns
                let idx = this.curCol-1
                widths[idx] += toLeft;

                idx = this.curCol+1
                widths[idx] += toRight;
            }
        }
        widths.splice(this.curCol, 1);

        this.alterer.removeColumnAtIndex(this.curCol);
        this.alterer.setColumnWidths(widths);

        if(this.curCol >= this.alterer.getCols()) {
            this.curCol = this.alterer.getCols()-1;
        }

        this.updateLockInfo(false);
        this.widthController.rearrangeShifters();
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

    startDraggingShifter(index: number): void {
        this.widthController.startDraggingShifter(index, this.dragContainer);
    }

    adaptNewSize(): void {
        this.widthController.rearrangeShifters();
    }

    ngOnInit() {
        this.widthController.tableBody = this.tableBody;
        this.widthController.rearrangeShifters();
        window.addEventListener("resize", this.windowResizeHandler);
    }

    ngOnDestroy() {
        window.removeEventListener("resize", this.windowResizeHandler);
    }
}