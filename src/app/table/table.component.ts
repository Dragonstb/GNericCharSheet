import { Component, ElementRef, inject, NgZone, output, ViewChild } from "@angular/core";
import { CdkDrag } from "@angular/cdk/drag-drop";
import { TableAlterer } from "./tablealterer";
import { WidthController } from "./widthcontroller";
import { ElemTypes } from "../elemtypes";
import { ReactiveFormsModule } from "@angular/forms";
import { ValidatorService } from "../../services/validator";

@Component({
    selector: 'gneric-table',
    templateUrl: './table.component.html',
    styleUrl: './table.component.less',
    imports: [CdkDrag, ReactiveFormsModule]
})
export class GNericTable {

    private notLockedInfo: string = "Current cell is last focused one.";

    id: string = 'comp-02-02';
    fullId: string = 'table-'+this.id;

    maxCols: number = 6;
    cellLocked: boolean = false;
    lockInfo = this.notLockedInfo;
    editable: boolean = true;

    curRow: number = -1;
    curCol: number = -1;

    alterer: TableAlterer = new TableAlterer();
    widthController: WidthController = new WidthController(this);

    @ViewChild('tableBody', {static: true}) tableBody!: ElementRef<HTMLTableSectionElement>;
    @ViewChild('dragContainer', {static: true}) dragContainer: ElementRef<HTMLDivElement> | undefined;
    @ViewChild('fieldSet', {static: true}) fieldSet!: ElementRef<HTMLFieldSetElement>;

    windowResizeHandler = ()=>this.adaptNewSize();

    deleteTableEvent = output<string>();
    gNericElemChangedEvent = output<object>();

    private validator = inject(ValidatorService);
    private ngZone = inject(NgZone);

    setEditable(editable: boolean): void {
        this.editable = editable;
        if(editable) {
            this.dragContainer?.nativeElement.classList.remove('hidden');
            this.fieldSet.nativeElement.classList.add('editable');
        }
        else {
            this.dragContainer?.nativeElement.classList.add('hidden');
            this.fieldSet.nativeElement.classList.remove('editable');
        }
    }

    addRowAboveCurrent(): void {
        this.alterer.addRowAtIndex(this.curRow);
        ++this.curRow;
        this.updateLockInfo(this.cellLocked);
        this.fireElemChangedEvent();
    }

    addRowBelowCurrent(): void {
        this.alterer.addRowAtIndex(this.curRow+1);
        this.fireElemChangedEvent();
    }

    removeCurrentRow(): void {
        this.alterer.removeRowAtIndex(this.curRow);
        if(this.curRow >= this.alterer.getRows()) {
            this.curRow = this.alterer.getRows()-1;
        }
        this.updateLockInfo(false);
        this.fireElemChangedEvent();
    }

    addColumnLeftOfCurrent(): void {
        this.addColumnAtIndex(this.curCol);
        ++this.curCol;
        this.updateLockInfo(this.cellLocked);
    }

    addColumnRightOfCurrent(): void {
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
        this.fireElemChangedEvent();
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
        this.fireElemChangedEvent();
    }

    setSelectedCell(event: Event): void {
        if(this.cellLocked) {
            return;
        }

        const target = event.target as HTMLInputElement;
        const cell = target.parentElement as HTMLTableCellElement;
        const row = cell.parentElement as HTMLTableRowElement;
        this.curRow = row.rowIndex;
        this.curCol = cell.cellIndex;
    }

    setAndLockSelectedCell(event: Event): void {
        /* NOTE: Event 'contextmenu' not available for iOS devices as of Nov 2025, see
         * https://developer.mozilla.org/en-US/docs/Web/API/Element/contextmenu_event#browser_compatibility
         */
        if(!this.editable) {
            return;
        }

        event.preventDefault();
        const target = event.target as HTMLInputElement;
        const cell = target.parentElement as HTMLTableCellElement;
        const row = cell.parentElement as HTMLTableRowElement;

        const rowIndex = row.rowIndex;
        const colIndex = cell.cellIndex;
        if(rowIndex != this.curRow || colIndex != this.curCol || !this.cellLocked) {
            this.curRow = rowIndex;
            this.curCol = colIndex;
            this.updateLockInfo(true);
        }
        else {
            this.updateLockInfo(false)
        }
    }

    updateLockInfo(locked: boolean): void {
        this.lockInfo = locked? "Current cell locked to row "+(this.curRow+1)+", column "+(this.curCol+1) : this.notLockedInfo;
        this.cellLocked = locked;
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

    deleteTable(): void {
        this.deleteTableEvent.emit(this.id);
    }

    fireElemChangedEvent(): void {
        const widths = this.alterer.getColumnWidths();
        let texts: string[][] = this.alterer.getContent();

        const json = {
            id: this.id,
            type: ElemTypes.table,
            widths: widths,
            texts: texts
        }
        this.gNericElemChangedEvent.emit(json);
    }

    isProperWidths(model: any): boolean {
        if(!model.hasOwnProperty('widths') || !model.widths){
            return false;
        }

        let widths = model.widths;
        if(typeof widths !== 'object' || !Array.isArray(widths) || widths.length < 1) {
            return false;
        }

        let sum = 0;
        for (const x of widths) {
            if(typeof x !== 'number' || x<this.widthController.getMinWidth() || x>100) {
                return false;
            }
            sum += x;
        }

        if(sum !== 100) {
            return false;
        }

        return true;
    }

    isProperTexts(model: any): boolean {
        if(!model.hasOwnProperty('texts') || !model.texts){
            return false;
        }

        let texts = model.texts;
        if(typeof texts !== 'object' || !Array.isArray(texts) || texts.length < 1) {
            return false;
        }

        for (const row of texts) {
            if(!row || typeof row !== 'object' || !Array.isArray(row) || row.length === 0) {
                return false;
            }
        }

        const cols = texts[0].length;
        for (const row of texts) {
            if(row.length != cols) {
                return false;
            }

            for (const entry of row) {
                if((!entry && entry !== "") || typeof entry !== 'string') {
                    return false;
                }
            }
        }

        return true;
    }

    setModel(model: any): void {
        // TODO: less invasive updating
        if(!this.validator.isModel(model)) {
            return;
        }

        if(!this.validator.isForMe(this.id, ElemTypes.table, model)) {
            return;
        }
        
        let equal = this.isEquallyDistributed(model.widths);

        try {
            this.ngZone.runGuarded(()=>{
                this.updateLockInfo(false);
                this.cellLocked = false;
                this.alterer.setContent(model);
                this.widthController.equalDistributed = equal;
                this.widthController.rearrangeShifters();
            });
        } catch (error) {
            console.log('GNeric Char Sheet: error on model update in Table');
        }
    }

    isEquallyDistributed(widths: number[]): boolean {
        if(widths.length < 2) {
            return true;
        }

        let diff = widths[0] - widths[widths.length-1];
        if(diff > 1 || diff < 0) {
            return false;
        }
        
        for (let idx = 0; idx < widths.length-1; idx++) {
            diff = widths[idx] - widths[idx+1];
            if(diff > 1 || diff < 0) {
                return false;
            }
        }

        return true;
    }
}