import { ComponentFixture, TestBed } from "@angular/core/testing";
import { GNericTable } from "./table.component";
import { DebugElement } from "@angular/core";
import { ElemTypes } from "../elemtypes";

describe( 'GNericTable', () => {
    let fixture: ComponentFixture<GNericTable>;
    let table: GNericTable;
    let natElem: HTMLElement;
    let dbgElem: DebugElement;
    const id: string = "comp-02-02";
    const fullId = "table-"+id;


    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GNericTable],
        }).compileComponents();
        
        fixture = TestBed.createComponent( GNericTable );
        fixture.autoDetectChanges();
        table = fixture.componentInstance;
        natElem = fixture.nativeElement;
        dbgElem = fixture.debugElement;
        // fixture.componentRef.setInput( 'id', id );
        await fixture.whenStable();
    });

    // _______________ create _______________

    it('Should create the table', () => {
        expect( table ).toBeTruthy();
    });

    /*
    // ... validate model ...

    it( 'Should update the component with a proper new model (non-equal column widths)', () => {
        const x = table.widthController.getMinWidth();
        const widths = [30, 40, 30];
        const title = table.title.value+'The new title';
        const texts = [
            ["1-1", "1-2", "1-3"],
            ["2-1", "2-2", "2-3"],
            ["3-1", "3-2", "3-3"],
        ];
        let model = {
            id: id,
            type: ElemTypes.table,
            widths: widths,
            texts: texts,
            title: title
        };
    
        table.setModel(model);
        fixture.detectChanges();

        expect(table.widthController.equalDistributed).toBeFalse();
        const body = table.tableBody.nativeElement as HTMLTableSectionElement;
        expect(body.childElementCount).toBe(texts.length);
        expect(table.title.value).toBe(title);

        for (let rowIdx = 0; rowIdx < body.childElementCount; rowIdx++) {
            const row = body.childNodes[rowIdx] as HTMLTableRowElement;
            expect(row.childElementCount).toBe(texts[rowIdx].length);
            for (let colIdx = 0; colIdx < row.childElementCount; colIdx++) {
                const cell = row.children[colIdx] as HTMLTableCellElement;
                expect(cell.style.width).toBe(widths[colIdx]+"%");

                const input = cell.firstChild as HTMLInputElement;
                expect(input.value).toBe(texts[rowIdx][colIdx]);
            }
        }
    });

    it( 'Should update the component with a proper new model (equal column widths)', () => {
        const x = table.widthController.getMinWidth();
        const widths = [34, 33, 33];
        const title = table.title.value+'new title';
        const texts = [
            ["1-1", "1-2", "1-3"],
            ["2-1", "2-2", "2-3"],
            ["3-1", "3-2", "3-3"],
        ];
        let model = {
            id: id,
            type: ElemTypes.table,
            widths: widths,
            texts: texts,
            title: title
        };
    
        table.setModel(model);
        fixture.detectChanges();

        expect(table.widthController.equalDistributed).toBeTrue();
        const body = table.tableBody.nativeElement as HTMLTableSectionElement;
        expect(body.childElementCount).toBe(texts.length);
        expect(table.title.value).toBe(title);

        for (let rowIdx = 0; rowIdx < body.childElementCount; rowIdx++) {
            const row = body.childNodes[rowIdx] as HTMLTableRowElement;
            expect(row.childElementCount).toBe(texts[rowIdx].length);
            for (let colIdx = 0; colIdx < row.childElementCount; colIdx++) {
                const cell = row.children[colIdx] as HTMLTableCellElement;
                expect(cell.style.width).toBe(widths[colIdx]+"%");

                const input = cell.firstChild as HTMLInputElement;
                expect(input.value).toBe(texts[rowIdx][colIdx]);
            }
        }
    });

    it( 'Should not update the component with a model where the id is missing', () => {
        const oldWidths = table.alterer.getColumnWidths();
        const oldEqualDist = table.widthController.equalDistributed;
        const oldRows = table.alterer.getRows();
        const oldCols = table.alterer.getCols();
        const oldTexts = table.alterer.getContent();
        const oldTitle = table.title.value;

        const newWidths = oldEqualDist ? [20,40,20,20] : [25,25,25,25]
        const newTexts = [
            ['1', '2', '3', '4'],
            ['5', '6', '7', '8']
        ];
        if(oldRows === newTexts.length) {
            newTexts.push(['a', 'b', 'c', 'd']);
        }
        const newTitle = oldTitle+' and more';

        let model = {
            type: ElemTypes.table,
            widths: newWidths,
            texts: newTexts,
            title: newTitle
        };
    
        table.setModel(model);
        fixture.detectChanges();

        expect(table.widthController.equalDistributed).toBe(oldEqualDist);
        const body = table.tableBody.nativeElement as HTMLTableSectionElement;
        expect(body.childElementCount).toBe(oldRows);
        expect(table.title.value).toBe(oldTitle);

        for (let rowIdx = 0; rowIdx < body.childElementCount; rowIdx++) {
            const row = body.childNodes[rowIdx] as HTMLTableRowElement;
            expect(row.childElementCount).toBe(oldCols);
            for (let colIdx = 0; colIdx < row.childElementCount; colIdx++) {
                const cell = row.children[colIdx] as HTMLTableCellElement;
                expect(cell.style.width).toBe(oldWidths[colIdx]+"%");

                const input = cell.firstChild as HTMLInputElement;
                expect(input.value).toBe(oldTexts[rowIdx][colIdx]);
            }
        }
    });

    it( 'Should not update the component with a model where the id is falsy', () => {
        const oldWidths = table.alterer.getColumnWidths();
        const oldEqualDist = table.widthController.equalDistributed;
        const oldRows = table.alterer.getRows();
        const oldCols = table.alterer.getCols();
        const oldTexts = table.alterer.getContent();
        const oldTitle = table.title.value;

        const newWidths = oldEqualDist ? [20,40,20,20] : [25,25,25,25]
        const newTexts = [
            ['1', '2', '3', '4'],
            ['5', '6', '7', '8']
        ];
        if(oldRows === newTexts.length) {
            newTexts.push(['a', 'b', 'c', 'd']);
        }
        const newTitle = oldTitle+' and more';

        let model = {
            id: undefined,
            type: ElemTypes.table,
            widths: newWidths,
            texts: newTexts,
            title: newTitle
        };
    
        table.setModel(model);
        fixture.detectChanges();

        expect(table.widthController.equalDistributed).toBe(oldEqualDist);
        const body = table.tableBody.nativeElement as HTMLTableSectionElement;
        expect(body.childElementCount).toBe(oldRows);
        expect(table.title.value).toBe(oldTitle);

        for (let rowIdx = 0; rowIdx < body.childElementCount; rowIdx++) {
            const row = body.childNodes[rowIdx] as HTMLTableRowElement;
            expect(row.childElementCount).toBe(oldCols);
            for (let colIdx = 0; colIdx < row.childElementCount; colIdx++) {
                const cell = row.children[colIdx] as HTMLTableCellElement;
                expect(cell.style.width).toBe(oldWidths[colIdx]+"%");

                const input = cell.firstChild as HTMLInputElement;
                expect(input.value).toBe(oldTexts[rowIdx][colIdx]);
            }
        }
    });

    it( 'Should not update the component with a model where the id is the one of the component', () => {
        const oldWidths = table.alterer.getColumnWidths();
        const oldEqualDist = table.widthController.equalDistributed;
        const oldRows = table.alterer.getRows();
        const oldCols = table.alterer.getCols();
        const oldTexts = table.alterer.getContent();
        const oldTitle = table.title.value;

        const newWidths = oldEqualDist ? [20,40,20,20] : [25,25,25,25]
        const newTexts = [
            ['1', '2', '3', '4'],
            ['5', '6', '7', '8']
        ];
        if(oldRows === newTexts.length) {
            newTexts.push(['a', 'b', 'c', 'd']);
        }
        const newTitle = oldTitle+' and more';

        let model = {
            id: id+"something",
            type: ElemTypes.table,
            widths: newWidths,
            texts: newTexts,
            title: newTitle
        };
    
        table.setModel(model);
        fixture.detectChanges();

        expect(table.widthController.equalDistributed).toBe(oldEqualDist);
        const body = table.tableBody.nativeElement as HTMLTableSectionElement;
        expect(body.childElementCount).toBe(oldRows);
        expect(table.title.value).toBe(oldTitle);

        for (let rowIdx = 0; rowIdx < body.childElementCount; rowIdx++) {
            const row = body.childNodes[rowIdx] as HTMLTableRowElement;
            expect(row.childElementCount).toBe(oldCols);
            for (let colIdx = 0; colIdx < row.childElementCount; colIdx++) {
                const cell = row.children[colIdx] as HTMLTableCellElement;
                expect(cell.style.width).toBe(oldWidths[colIdx]+"%");

                const input = cell.firstChild as HTMLInputElement;
                expect(input.value).toBe(oldTexts[rowIdx][colIdx]);
            }
        }
    });

    it( 'Should not update the component with a model where the id is not a string', () => {
        const oldWidths = table.alterer.getColumnWidths();
        const oldEqualDist = table.widthController.equalDistributed;
        const oldRows = table.alterer.getRows();
        const oldCols = table.alterer.getCols();
        const oldTexts = table.alterer.getContent();
        const oldTitle = table.title.value;

        const newWidths = oldEqualDist ? [20,40,20,20] : [25,25,25,25]
        const newTexts = [
            ['1', '2', '3', '4'],
            ['5', '6', '7', '8']
        ];
        if(oldRows === newTexts.length) {
            newTexts.push(['a', 'b', 'c', 'd']);
        }
        const newTitle = oldTitle+' and more';

        let model = {
            id: 2,
            type: ElemTypes.table,
            widths: newWidths,
            texts: newTexts,
            title: newTitle
        };
    
        table.setModel(model);
        fixture.detectChanges();

        expect(table.widthController.equalDistributed).toBe(oldEqualDist);
        const body = table.tableBody.nativeElement as HTMLTableSectionElement;
        expect(body.childElementCount).toBe(oldRows);
        expect(table.title.value).toBe(oldTitle);

        for (let rowIdx = 0; rowIdx < body.childElementCount; rowIdx++) {
            const row = body.childNodes[rowIdx] as HTMLTableRowElement;
            expect(row.childElementCount).toBe(oldCols);
            for (let colIdx = 0; colIdx < row.childElementCount; colIdx++) {
                const cell = row.children[colIdx] as HTMLTableCellElement;
                expect(cell.style.width).toBe(oldWidths[colIdx]+"%");

                const input = cell.firstChild as HTMLInputElement;
                expect(input.value).toBe(oldTexts[rowIdx][colIdx]);
            }
        }
    });

    it( 'Should not update the component with a model where the type is missing', () => {
        const oldWidths = table.alterer.getColumnWidths();
        const oldEqualDist = table.widthController.equalDistributed;
        const oldRows = table.alterer.getRows();
        const oldCols = table.alterer.getCols();
        const oldTexts = table.alterer.getContent();
        const oldTitle = table.title.value;

        const newWidths = oldEqualDist ? [20,40,20,20] : [25,25,25,25]
        const newTexts = [
            ['1', '2', '3', '4'],
            ['5', '6', '7', '8']
        ];
        if(oldRows === newTexts.length) {
            newTexts.push(['a', 'b', 'c', 'd']);
        }
        const newTitle = oldTitle+' and more';

        let model = {
            id: id,
            widths: newWidths,
            texts: newTexts,
            title: newTitle
        };
    
        table.setModel(model);
        fixture.detectChanges();

        expect(table.widthController.equalDistributed).toBe(oldEqualDist);
        const body = table.tableBody.nativeElement as HTMLTableSectionElement;
        expect(body.childElementCount).toBe(oldRows);
        expect(table.title.value).toBe(oldTitle);

        for (let rowIdx = 0; rowIdx < body.childElementCount; rowIdx++) {
            const row = body.childNodes[rowIdx] as HTMLTableRowElement;
            expect(row.childElementCount).toBe(oldCols);
            for (let colIdx = 0; colIdx < row.childElementCount; colIdx++) {
                const cell = row.children[colIdx] as HTMLTableCellElement;
                expect(cell.style.width).toBe(oldWidths[colIdx]+"%");

                const input = cell.firstChild as HTMLInputElement;
                expect(input.value).toBe(oldTexts[rowIdx][colIdx]);
            }
        }
    });

    it( 'Should not update the component with a model where the type is not the correct one', () => {
        const oldWidths = table.alterer.getColumnWidths();
        const oldEqualDist = table.widthController.equalDistributed;
        const oldRows = table.alterer.getRows();
        const oldCols = table.alterer.getCols();
        const oldTexts = table.alterer.getContent();
        const oldTitle = table.title.value;

        const newWidths = oldEqualDist ? [20,40,20,20] : [25,25,25,25]
        const newTexts = [
            ['1', '2', '3', '4'],
            ['5', '6', '7', '8']
        ];
        if(oldRows === newTexts.length) {
            newTexts.push(['a', 'b', 'c', 'd']);
        }
        const newTitle = oldTitle+' and more';

        let model = {
            id: id,
            type: ElemTypes.rpm,
            widths: newWidths,
            texts: newTexts,
            title: newTitle
        };
    
        table.setModel(model);
        fixture.detectChanges();

        expect(table.widthController.equalDistributed).toBe(oldEqualDist);
        const body = table.tableBody.nativeElement as HTMLTableSectionElement;
        expect(body.childElementCount).toBe(oldRows);
        expect(table.title.value).toBe(oldTitle);

        for (let rowIdx = 0; rowIdx < body.childElementCount; rowIdx++) {
            const row = body.childNodes[rowIdx] as HTMLTableRowElement;
            expect(row.childElementCount).toBe(oldCols);
            for (let colIdx = 0; colIdx < row.childElementCount; colIdx++) {
                const cell = row.children[colIdx] as HTMLTableCellElement;
                expect(cell.style.width).toBe(oldWidths[colIdx]+"%");

                const input = cell.firstChild as HTMLInputElement;
                expect(input.value).toBe(oldTexts[rowIdx][colIdx]);
            }
        }
    });

    it( 'Should not update the component with a model where the type is falsy', () => {
        const oldWidths = table.alterer.getColumnWidths();
        const oldEqualDist = table.widthController.equalDistributed;
        const oldRows = table.alterer.getRows();
        const oldCols = table.alterer.getCols();
        const oldTexts = table.alterer.getContent();
        const oldTitle = table.title.value;

        const newWidths = oldEqualDist ? [20,40,20,20] : [25,25,25,25]
        const newTexts = [
            ['1', '2', '3', '4'],
            ['5', '6', '7', '8']
        ];
        if(oldRows === newTexts.length) {
            newTexts.push(['a', 'b', 'c', 'd']);
        }
        const newTitle = oldTitle+' and more';

        let model = {
            id: id,
            type: undefined,
            widths: newWidths,
            texts: newTexts,
            title: newTitle
        };
    
        table.setModel(model);
        fixture.detectChanges();

        expect(table.widthController.equalDistributed).toBe(oldEqualDist);
        const body = table.tableBody.nativeElement as HTMLTableSectionElement;
        expect(body.childElementCount).toBe(oldRows);
        expect(table.title.value).toBe(oldTitle);

        for (let rowIdx = 0; rowIdx < body.childElementCount; rowIdx++) {
            const row = body.childNodes[rowIdx] as HTMLTableRowElement;
            expect(row.childElementCount).toBe(oldCols);
            for (let colIdx = 0; colIdx < row.childElementCount; colIdx++) {
                const cell = row.children[colIdx] as HTMLTableCellElement;
                expect(cell.style.width).toBe(oldWidths[colIdx]+"%");

                const input = cell.firstChild as HTMLInputElement;
                expect(input.value).toBe(oldTexts[rowIdx][colIdx]);
            }
        }
    });

    it( 'Should not update the component with a model where the type is not a string', () => {
        const oldWidths = table.alterer.getColumnWidths();
        const oldEqualDist = table.widthController.equalDistributed;
        const oldRows = table.alterer.getRows();
        const oldCols = table.alterer.getCols();
        const oldTexts = table.alterer.getContent();
        const oldTitle = table.title.value;

        const newWidths = oldEqualDist ? [20,40,20,20] : [25,25,25,25]
        const newTexts = [
            ['1', '2', '3', '4'],
            ['5', '6', '7', '8']
        ];
        if(oldRows === newTexts.length) {
            newTexts.push(['a', 'b', 'c', 'd']);
        }
        const newTitle = oldTitle+' and more';

        let model = {
            id: id,
            type: 3,
            widths: newWidths,
            texts: newTexts,
            title: newTitle
        };
    
        table.setModel(model);
        fixture.detectChanges();

        expect(table.widthController.equalDistributed).toBe(oldEqualDist);
        const body = table.tableBody.nativeElement as HTMLTableSectionElement;
        expect(body.childElementCount).toBe(oldRows);
        expect(table.title.value).toBe(oldTitle);

        for (let rowIdx = 0; rowIdx < body.childElementCount; rowIdx++) {
            const row = body.childNodes[rowIdx] as HTMLTableRowElement;
            expect(row.childElementCount).toBe(oldCols);
            for (let colIdx = 0; colIdx < row.childElementCount; colIdx++) {
                const cell = row.children[colIdx] as HTMLTableCellElement;
                expect(cell.style.width).toBe(oldWidths[colIdx]+"%");

                const input = cell.firstChild as HTMLInputElement;
                expect(input.value).toBe(oldTexts[rowIdx][colIdx]);
            }
        }
    });

    it( 'Should not update the component with a model where the model is not an object', () => {
        const oldWidths = table.alterer.getColumnWidths();
        const oldEqualDist = table.widthController.equalDistributed;
        const oldRows = table.alterer.getRows();
        const oldCols = table.alterer.getCols();
        const oldTexts = table.alterer.getContent();
        const oldTitle = table.title.value;

        const newWidths = oldEqualDist ? [20,40,20,20] : [25,25,25,25]
        const newTexts = [
            ['1', '2', '3', '4'],
            ['5', '6', '7', '8']
        ];
        if(oldRows === newTexts.length) {
            newTexts.push(['a', 'b', 'c', 'd']);
        }
        const newTitle = oldTitle+' and more';

        let model = "{id: id, type: ElemTypes.table, widths: newWidths, texts: newTexts}";
    
        table.setModel(model);
        fixture.detectChanges();

        expect(table.widthController.equalDistributed).toBe(oldEqualDist);
        const body = table.tableBody.nativeElement as HTMLTableSectionElement;
        expect(body.childElementCount).toBe(oldRows);
        expect(table.title.value).toBe(oldTitle);

        for (let rowIdx = 0; rowIdx < body.childElementCount; rowIdx++) {
            const row = body.childNodes[rowIdx] as HTMLTableRowElement;
            expect(row.childElementCount).toBe(oldCols);
            for (let colIdx = 0; colIdx < row.childElementCount; colIdx++) {
                const cell = row.children[colIdx] as HTMLTableCellElement;
                expect(cell.style.width).toBe(oldWidths[colIdx]+"%");

                const input = cell.firstChild as HTMLInputElement;
                expect(input.value).toBe(oldTexts[rowIdx][colIdx]);
            }
        }
    });

    it( 'Should not update the component with a model where the model is falsy', () => {
        const oldWidths = table.alterer.getColumnWidths();
        const oldEqualDist = table.widthController.equalDistributed;
        const oldRows = table.alterer.getRows();
        const oldCols = table.alterer.getCols();
        const oldTexts = table.alterer.getContent();
        const oldTitle = table.title.value;

        const newWidths = oldEqualDist ? [20,40,20,20] : [25,25,25,25]
        const newTexts = [
            ['1', '2', '3', '4'],
            ['5', '6', '7', '8']
        ];
        if(oldRows === newTexts.length) {
            newTexts.push(['a', 'b', 'c', 'd']);
        }
        const newTitle = oldTitle+' and more';

        let model = undefined;
    
        table.setModel(model);
        fixture.detectChanges();

        expect(table.widthController.equalDistributed).toBe(oldEqualDist);
        const body = table.tableBody.nativeElement as HTMLTableSectionElement;
        expect(body.childElementCount).toBe(oldRows);
        expect(table.title.value).toBe(oldTitle);

        for (let rowIdx = 0; rowIdx < body.childElementCount; rowIdx++) {
            const row = body.childNodes[rowIdx] as HTMLTableRowElement;
            expect(row.childElementCount).toBe(oldCols);
            for (let colIdx = 0; colIdx < row.childElementCount; colIdx++) {
                const cell = row.children[colIdx] as HTMLTableCellElement;
                expect(cell.style.width).toBe(oldWidths[colIdx]+"%");

                const input = cell.firstChild as HTMLInputElement;
                expect(input.value).toBe(oldTexts[rowIdx][colIdx]);
            }
        }
    });

    it( 'Should not update the component with a model where the texts are not proper', () => {
        const oldWidths = table.alterer.getColumnWidths();
        const oldEqualDist = table.widthController.equalDistributed;
        const oldRows = table.alterer.getRows();
        const oldCols = table.alterer.getCols();
        const oldTexts = table.alterer.getContent();
        const oldTitle = table.title.value;

        const newWidths = oldEqualDist ? [20,40,20,20] : [25,25,25,25]
        const newTexts = [
            ['1', '2', 3, '4'],
            ['5', '6', '7', '8']
        ];
        if(oldRows === newTexts.length) {
            newTexts.push(['a', 'b', 'c', 'd']);
        }
        const newTitle = oldTitle+' and more';

        let model = {
            id: id,
            type: ElemTypes.table,
            widths: newWidths,
            texts: newTexts,
            title: newTitle
        };
    
        table.setModel(model);
        fixture.detectChanges();

        expect(table.widthController.equalDistributed).toBe(oldEqualDist);
        const body = table.tableBody.nativeElement as HTMLTableSectionElement;
        expect(body.childElementCount).toBe(oldRows);
        expect(table.title.value).toBe(oldTitle);

        for (let rowIdx = 0; rowIdx < body.childElementCount; rowIdx++) {
            const row = body.childNodes[rowIdx] as HTMLTableRowElement;
            expect(row.childElementCount).toBe(oldCols);
            for (let colIdx = 0; colIdx < row.childElementCount; colIdx++) {
                const cell = row.children[colIdx] as HTMLTableCellElement;
                expect(cell.style.width).toBe(oldWidths[colIdx]+"%");

                const input = cell.firstChild as HTMLInputElement;
                expect(input.value).toBe(oldTexts[rowIdx][colIdx]);
            }
        }
    });

    it( 'Should not update the component with a model where the widths are not proper', () => {
        const oldWidths = table.alterer.getColumnWidths();
        const oldEqualDist = table.widthController.equalDistributed;
        const oldRows = table.alterer.getRows();
        const oldCols = table.alterer.getCols();
        const oldTexts = table.alterer.getContent();
        const oldTitle = table.title.value;

        const newWidths = oldEqualDist ? [20,40,120,20] : [25,25,125,25]
        const newTexts = [
            ['1', '2', '3', '4'],
            ['5', '6', '7', '8']
        ];
        if(oldRows === newTexts.length) {
            newTexts.push(['a', 'b', 'c', 'd']);
        }
        const newTitle = oldTitle+' and more';

        let model = {
            id: id,
            type: ElemTypes.table,
            widths: newWidths,
            texts: newTexts,
            title: newTitle
        };
    
        table.setModel(model);
        fixture.detectChanges();

        expect(table.widthController.equalDistributed).toBe(oldEqualDist);
        const body = table.tableBody.nativeElement as HTMLTableSectionElement;
        expect(body.childElementCount).toBe(oldRows);
        expect(table.title.value).toBe(oldTitle);

        for (let rowIdx = 0; rowIdx < body.childElementCount; rowIdx++) {
            const row = body.childNodes[rowIdx] as HTMLTableRowElement;
            expect(row.childElementCount).toBe(oldCols);
            for (let colIdx = 0; colIdx < row.childElementCount; colIdx++) {
                const cell = row.children[colIdx] as HTMLTableCellElement;
                expect(cell.style.width).toBe(oldWidths[colIdx]+"%");

                const input = cell.firstChild as HTMLInputElement;
                expect(input.value).toBe(oldTexts[rowIdx][colIdx]);
            }
        }
    });

    it( 'Should not update the component with a model where the title is missing', () => {
        const oldWidths = table.alterer.getColumnWidths();
        const oldEqualDist = table.widthController.equalDistributed;
        const oldRows = table.alterer.getRows();
        const oldCols = table.alterer.getCols();
        const oldTexts = table.alterer.getContent();
        const oldTitle = table.title.value;

        const newWidths = oldEqualDist ? [20,40,20,20] : [25,25,25,25]
        const newTexts = [
            ['1', '2', '3', '4'],
            ['5', '6', '7', '8']
        ];
        if(oldRows === newTexts.length) {
            newTexts.push(['a', 'b', 'c', 'd']);
        }
        const newTitle = oldTitle+' and more';

        let model = {
            id: id,
            type: ElemTypes.table,
            widths: newWidths,
            texts: newTexts
        };
    
        table.setModel(model);
        fixture.detectChanges();

        expect(table.widthController.equalDistributed).toBe(oldEqualDist);
        const body = table.tableBody.nativeElement as HTMLTableSectionElement;
        expect(body.childElementCount).toBe(oldRows);
        expect(table.title.value).toBe(oldTitle);

        for (let rowIdx = 0; rowIdx < body.childElementCount; rowIdx++) {
            const row = body.childNodes[rowIdx] as HTMLTableRowElement;
            expect(row.childElementCount).toBe(oldCols);
            for (let colIdx = 0; colIdx < row.childElementCount; colIdx++) {
                const cell = row.children[colIdx] as HTMLTableCellElement;
                expect(cell.style.width).toBe(oldWidths[colIdx]+"%");

                const input = cell.firstChild as HTMLInputElement;
                expect(input.value).toBe(oldTexts[rowIdx][colIdx]);
            }
        }
    });

    it( 'Should not update the component with a model where the title is falsy', () => {
        const oldWidths = table.alterer.getColumnWidths();
        const oldEqualDist = table.widthController.equalDistributed;
        const oldRows = table.alterer.getRows();
        const oldCols = table.alterer.getCols();
        const oldTexts = table.alterer.getContent();
        const oldTitle = table.title.value;

        const newWidths = oldEqualDist ? [20,40,20,20] : [25,25,25,25]
        const newTexts = [
            ['1', '2', '3', '4'],
            ['5', '6', '7', '8']
        ];
        if(oldRows === newTexts.length) {
            newTexts.push(['a', 'b', 'c', 'd']);
        }
        const newTitle = undefined;

        let model = {
            id: id,
            type: ElemTypes.table,
            widths: newWidths,
            texts: newTexts,
            title: newTitle
        };
    
        table.setModel(model);
        fixture.detectChanges();

        expect(table.widthController.equalDistributed).toBe(oldEqualDist);
        const body = table.tableBody.nativeElement as HTMLTableSectionElement;
        expect(body.childElementCount).toBe(oldRows);
        expect(table.title.value).toBe(oldTitle);

        for (let rowIdx = 0; rowIdx < body.childElementCount; rowIdx++) {
            const row = body.childNodes[rowIdx] as HTMLTableRowElement;
            expect(row.childElementCount).toBe(oldCols);
            for (let colIdx = 0; colIdx < row.childElementCount; colIdx++) {
                const cell = row.children[colIdx] as HTMLTableCellElement;
                expect(cell.style.width).toBe(oldWidths[colIdx]+"%");

                const input = cell.firstChild as HTMLInputElement;
                expect(input.value).toBe(oldTexts[rowIdx][colIdx]);
            }
        }
    });

    it( 'Should not update the component with a model where the title is not a string', () => {
        const oldWidths = table.alterer.getColumnWidths();
        const oldEqualDist = table.widthController.equalDistributed;
        const oldRows = table.alterer.getRows();
        const oldCols = table.alterer.getCols();
        const oldTexts = table.alterer.getContent();
        const oldTitle = table.title.value;

        const newWidths = oldEqualDist ? [20,40,20,20] : [25,25,25,25]
        const newTexts = [
            ['1', '2', '3', '4'],
            ['5', '6', '7', '8']
        ];
        if(oldRows === newTexts.length) {
            newTexts.push(['a', 'b', 'c', 'd']);
        }
        const newTitle = 100;

        let model = {
            id: id,
            type: ElemTypes.table,
            widths: newWidths,
            texts: newTexts,
            title: newTitle
        };
    
        table.setModel(model);
        fixture.detectChanges();

        expect(table.widthController.equalDistributed).toBe(oldEqualDist);
        const body = table.tableBody.nativeElement as HTMLTableSectionElement;
        expect(body.childElementCount).toBe(oldRows);
        expect(table.title.value).toBe(oldTitle);

        for (let rowIdx = 0; rowIdx < body.childElementCount; rowIdx++) {
            const row = body.childNodes[rowIdx] as HTMLTableRowElement;
            expect(row.childElementCount).toBe(oldCols);
            for (let colIdx = 0; colIdx < row.childElementCount; colIdx++) {
                const cell = row.children[colIdx] as HTMLTableCellElement;
                expect(cell.style.width).toBe(oldWidths[colIdx]+"%");

                const input = cell.firstChild as HTMLInputElement;
                expect(input.value).toBe(oldTexts[rowIdx][colIdx]);
            }
        }
    });

    it( 'Should update the component with a proper new model where the title is empty', () => {
        const x = table.widthController.getMinWidth();
        const widths = [34, 33, 33];
        const title = '';
        const texts = [
            ["1-1", "1-2", "1-3"],
            ["2-1", "2-2", "2-3"],
            ["3-1", "3-2", "3-3"],
        ];
        let model = {
            id: id,
            type: ElemTypes.table,
            widths: widths,
            texts: texts,
            title: title
        };
    
        table.setModel(model);
        fixture.detectChanges();

        expect(table.widthController.equalDistributed).toBeTrue();
        const body = table.tableBody.nativeElement as HTMLTableSectionElement;
        expect(body.childElementCount).toBe(texts.length);
        expect(table.title.value).toBe(title);

        for (let rowIdx = 0; rowIdx < body.childElementCount; rowIdx++) {
            const row = body.childNodes[rowIdx] as HTMLTableRowElement;
            expect(row.childElementCount).toBe(texts[rowIdx].length);
            for (let colIdx = 0; colIdx < row.childElementCount; colIdx++) {
                const cell = row.children[colIdx] as HTMLTableCellElement;
                expect(cell.style.width).toBe(widths[colIdx]+"%");

                const input = cell.firstChild as HTMLInputElement;
                expect(input.value).toBe(texts[rowIdx][colIdx]);
            }
        }
    });

    */
});