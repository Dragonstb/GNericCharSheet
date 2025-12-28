import { CdkDragMove } from "@angular/cdk/drag-drop";
import { ElementRef } from "@angular/core";
import { GNericTable } from "./table.component";

export class WidthController {

    table: GNericTable;
    minDist: number | undefined = undefined;
    maxDist: number | undefined = undefined;
    slope: number | undefined = undefined;
    iniLeftW: number | undefined = undefined;
    iniRightW: number | undefined = undefined;
    lefts: string[] = ['left: 0%;', 'left: 50%;'];
    equalDistributed: boolean = true;

    tableBody!: ElementRef<HTMLTableSectionElement>;

    constructor(table: GNericTable) {
        this.table = table;
    }

    rearrangeShifters(): void {
        setTimeout(()=>{
            const cw = 27;
            let lefts: string[] = [];
            const row = this.tableBody.nativeElement.firstChild as HTMLTableRowElement;
            let counter = 0;
            row.childNodes.forEach(col => {
                const cell = col as HTMLTableCellElement;
                const offset = cell.offsetLeft-counter*cw+cw/2;
                if(offset) {
                    lefts.push('left: '+offset+'px;');
                    counter++;
                }
            });
                            
            this.lefts = lefts;
        });
    }

    startDraggingShifter(index: number, dragContainer: ElementRef<HTMLDivElement> | undefined): void {
        if(!dragContainer) {
            return;
        }

        const contW = dragContainer.nativeElement.offsetWidth;
        this.slope = 100 / contW;

        const leftIdx = index-1;
        const rightIdx = index;

        let widths = this.table.getModelAlterer().getColumnWidths();
        this.iniLeftW = widths[leftIdx];
        this.iniRightW = widths[rightIdx];

        this.minDist = Math.min(-(this.iniLeftW-this.table.getColumnMinWidth())/this.slope, 0);
        this.maxDist = Math.max((this.iniRightW-this.table.getColumnMinWidth())/this.slope, 0);
    }

    endDraggingShifter(): void {
        this.slope = undefined;
        this.minDist = undefined;
        this.maxDist = undefined;
        this.iniLeftW = undefined;
        this.iniRightW = undefined;
        this.rearrangeShifters();
        this.table.fireElemChangedEvent();
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

        this.table.getModelAlterer().setColumnWidth(index-1, newLeftW);
        this.table.getModelAlterer().setColumnWidth(index, newRightW);
    }

    getMinWidth(): number {
        return this.table.getColumnMinWidth();
    }

    isEquallyDistributed(): boolean {
        return this.equalDistributed;
    }

    setEquallyDistributed(equally: boolean): void {
        this.equalDistributed = equally;
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
        const widths = this.getEqualWidths(100, this.table.getModelAlterer().getCols());
        this.table.getModelAlterer().setColumnWidths(widths);
        this.setEquallyDistributed(true);
        this.rearrangeShifters();
        this.table.fireElemChangedEvent();
    }
}