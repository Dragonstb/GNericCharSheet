import { ComponentFixture, TestBed } from "@angular/core/testing";
import { GNericTable } from "./table.component";
import { DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser";
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

    // _______________ input validation _______________

    // ... validate widths ...

    it('Validate widths: should accept a proper array', () => {
        const x = table.widthController.getMinWidth();
        const arr = [x+1, x+2, x+3, 94-3*x];
        const model = {widths: arr};
        expect( table.isProperWidths(model) ).toBeTrue();
    });

    it('Validate widths: should reject model without widths', () => {
        const x = table.widthController.getMinWidth();
        const arr = [x+1, x+2, x+3, 94-3*x];
        const model = {nowidthsaround: arr};
        expect( table.isProperWidths(model) ).toBeFalse();
    });

    it('Validate widths: should reject model with falsy widths', () => {
        const model = {widths: undefined};
        expect( table.isProperWidths(model) ).toBeFalse();
    });

    it('Validate widths: should reject model with non-object widths', () => {
        const model = {widths: 3};
        expect( table.isProperWidths(model) ).toBeFalse();
    });

    it('Validate widths: should reject model with non-array widths', () => {
        const model = {widths: {some: "thing"}};
        expect( table.isProperWidths(model) ).toBeFalse();
    });

    it('Validate widths: should reject model with empty widths', () => {
        const model = {widths: []};
        expect( table.isProperWidths(model) ).toBeFalse();
    });

    it('Validate widths: should reject model with empty non-number widths', () => {
        const model = {widths: ["one", "two", "three", "four"]};
        expect( table.isProperWidths(model) ).toBeFalse();
    });

    it('Validate widths: should reject model with widths below minWidth', () => {
        const x = table.widthController.getMinWidth();
        const arr = [x+1, x+2, x-1, 98-3*x];
        const model = {widths: arr};
        expect( table.isProperWidths(model) ).toBeFalse();
    });

    it('Validate widths: should reject model with widths above 100', () => {
        const x = table.widthController.getMinWidth();
        const arr = [x+1, x+2, 101, -4-2*x];
        const model = {widths: arr};
        expect( table.isProperWidths(model) ).toBeFalse();
    });

    it('Validate widths: should reject model where the widths total above 100', () => {
        const x = table.widthController.getMinWidth();
        const arr = [x+1, x+2, x+3, 94];
        const model = {widths: arr};
        expect( table.isProperWidths(model) ).toBeFalse();
    });

    it('Validate widths: should reject model where the widths total below 100', () => {
        const x = table.widthController.getMinWidth();
        const arr = [x+1];
        const model = {widths: arr};
        expect( table.isProperWidths(model) ).toBeFalse();
    });

    // ... validate texts ...

    it('Validate texts: should accept proper texts', () => {
        const arr = [
            ["1-1", "1-2", "1-3"],
            ["2-1", "2-2", "2-3"],
            ["3-1", "3-2", "3-3"],
        ];
        const model = {texts: arr};
        expect( table.isProperTexts(model) ).toBeTrue();
    });

    it('Validate texts: should accept texts with empty strings', () => {
        const arr = [
            ["1-1", "1-2", "1-3"],
            ["2-1", "", "2-3"],
            ["3-1", "3-2", "3-3"],
        ];
        const model = {texts: arr};
        expect( table.isProperTexts(model) ).toBeTrue();
    });

    it('Validate texts: should reject model without texts', () => {
        const arr = [
            ["1-1", "1-2", "1-3"],
            ["2-1", "2-2", "2-3"],
            ["3-1", "3-2", "3-3"],
        ];
        const model = {notextshere: arr};
        expect( table.isProperTexts(model) ).toBeFalse();
    });

    it('Validate texts: should reject model with falsy texts', () => {
        const arr = [
            ["1-1", "1-2", "1-3"],
            ["2-1", "2-2", "2-3"],
            ["3-1", "3-2", "3-3"],
        ];
        const model = {texts: undefined};
        expect( table.isProperTexts(model) ).toBeFalse();
    });

    it('Validate texts: should reject model with non-object texts', () => {
        const arr = [
            ["1-1", "1-2", "1-3"],
            ["2-1", "2-2", "2-3"],
            ["3-1", "3-2", "3-3"],
        ];
        const model = {texts: "anything but love"};
        expect( table.isProperTexts(model) ).toBeFalse();
    });

    it('Validate texts: should reject model with non-array texts', () => {
        const arr = [
            ["1-1", "1-2", "1-3"],
            ["2-1", "2-2", "2-3"],
            ["3-1", "3-2", "3-3"],
        ];
        const model = {texts: {its: "something"}};
        expect( table.isProperTexts(model) ).toBeFalse();
    });

    it('Validate texts: should reject model with falsy rows', () => {
        const arr = [
            undefined,
            undefined,
            undefined,
        ];
        const model = {texts: arr};
        expect( table.isProperTexts(model) ).toBeFalse();
    });

    it('Validate texts: should reject model with non-object rows', () => {
        const arr = [
            1,
            2,
            3,
        ];
        const model = {texts: arr};
        expect( table.isProperTexts(model) ).toBeFalse();
    });

    it('Validate texts: should reject model with non-array rows', () => {
        const arr = [
            {row: 1},
            {row: 2},
            {row: 3},
        ];
        const model = {texts: arr};
        expect( table.isProperTexts(model) ).toBeFalse();
    });

    it('Validate texts: should reject model with falsy entries', () => {
        const arr = [
            ["1-1", "1-2", "1-3"],
            ["2-1", undefined, "2-3"],
            ["3-1", "3-2", "3-3"],
        ];
        const model = {texts: arr};
        expect( table.isProperTexts(model) ).toBeFalse();
    });

    it('Validate texts: should reject model with non-string entries', () => {
        const arr = [
            ["1-1", "1-2", "1-3"],
            ["2-1", 1, "2-3"],
            ["3-1", "3-2", "3-3"],
        ];
        const model = {texts: arr};
        expect( table.isProperTexts(model) ).toBeFalse();
    });

    it('Validate texts: should reject model with rows of different length', () => {
        const arr = [
            ["1-1", "1-2", "1-3"],
            ["2-1", "2-2", "2-3"],
            ["3-1", "3-2"],
        ];
        const model = {texts: arr};
        expect( table.isProperTexts(model) ).toBeFalse();
    });

    it('Validate texts: should reject model with rows of vanishing length', () => {
        const arr = [
            [],
            [],
            [],
        ];
        const model = {texts: arr};
        expect( table.isProperTexts(model) ).toBeFalse();
    });


    // ... validate model ...

    it( 'Should update the component with a proper new model (non-equal column widths)', () => {
        const x = table.widthController.getMinWidth();
        const widths = [30, 40, 30];
        const texts = [
            ["1-1", "1-2", "1-3"],
            ["2-1", "2-2", "2-3"],
            ["3-1", "3-2", "3-3"],
        ];
        let model = {
            id: id,
            type: ElemTypes.table,
            widths: widths,
            texts: texts
        };
    
        table.setModel(model);
        fixture.detectChanges();

        expect(table.widthController.equalDistributed).toBeFalse();
        const body = table.tableBody.nativeElement as HTMLTableSectionElement;
        expect(body.childElementCount).toBe(texts.length);

        for (let rowIdx = 0; rowIdx < body.childElementCount; rowIdx++) {
            const row = body.childNodes[rowIdx] as HTMLTableRowElement;
            expect(row.childElementCount).toBe(texts[rowIdx].length);
            for (let colIdx = 0; colIdx < row.childElementCount; colIdx++) {
                const cell = row.childNodes[colIdx] as HTMLTableCellElement;
                expect(cell.style.width).toBe(widths[colIdx]+"%");

                const input = cell.firstChild as HTMLInputElement;
                expect(input.value).toBe(texts[rowIdx][colIdx]);
            }
        }
    });

    it( 'Should update the component with a proper new model (equal column widths)', () => {
        const x = table.widthController.getMinWidth();
        const widths = [34, 33, 33];
        const texts = [
            ["1-1", "1-2", "1-3"],
            ["2-1", "2-2", "2-3"],
            ["3-1", "3-2", "3-3"],
        ];
        let model = {
            id: id,
            type: ElemTypes.table,
            widths: widths,
            texts: texts
        };
    
        table.setModel(model);
        fixture.detectChanges();

        expect(table.widthController.equalDistributed).toBeTrue();
        const body = table.tableBody.nativeElement as HTMLTableSectionElement;
        expect(body.childElementCount).toBe(texts.length);

        for (let rowIdx = 0; rowIdx < body.childElementCount; rowIdx++) {
            const row = body.childNodes[rowIdx] as HTMLTableRowElement;
            expect(row.childElementCount).toBe(texts[rowIdx].length);
            for (let colIdx = 0; colIdx < row.childElementCount; colIdx++) {
                const cell = row.childNodes[colIdx] as HTMLTableCellElement;
                expect(cell.style.width).toBe(widths[colIdx]+"%");

                const input = cell.firstChild as HTMLInputElement;
                expect(input.value).toBe(texts[rowIdx][colIdx]);
            }
        }
    });

    it( 'Should accept a proper new model', () => {
        const x = table.widthController.getMinWidth();
        const widths = [30, 40, 30];
        const texts = [
            ["1-1", "1-2", "1-3"],
            ["2-1", "2-2", "2-3"],
            ["3-1", "3-2", "3-3"],
        ];
        let model = {
            id: id,
            type: ElemTypes.table,
            widths: widths,
            texts: texts
        };
        expect(table.isTableModelForMe(model)).toBeTrue();
    });

    it( 'Should reject a falsy model', () => {
        expect(table.isTableModelForMe(undefined)).toBeFalse();
    });

    it( 'Should reject a model with wrong id', () => {
        const x = table.widthController.getMinWidth();
        const widths = [30, 40, 30];
        const texts = [
            ["1-1", "1-2", "1-3"],
            ["2-1", "2-2", "2-3"],
            ["3-1", "3-2", "3-3"],
        ];
        let model = {
            id: id+"mistake",
            type: ElemTypes.table,
            widths: widths,
            texts: texts
        };
        expect(table.isTableModelForMe(model)).toBeFalse();
    });

    it( 'Should reject a model with falsy id', () => {
        const x = table.widthController.getMinWidth();
        const widths = [30, 40, 30];
        const texts = [
            ["1-1", "1-2", "1-3"],
            ["2-1", "2-2", "2-3"],
            ["3-1", "3-2", "3-3"],
        ];
        let model = {
            id: undefined,
            type: ElemTypes.table,
            widths: widths,
            texts: texts
        };
        expect(table.isTableModelForMe(model)).toBeFalse();
    });

    it( 'Should reject a model with id of wrong type', () => {
        const x = table.widthController.getMinWidth();
        const widths = [30, 40, 30];
        const texts = [
            ["1-1", "1-2", "1-3"],
            ["2-1", "2-2", "2-3"],
            ["3-1", "3-2", "3-3"],
        ];
        let model = {
            id: 3,
            type: ElemTypes.table,
            widths: widths,
            texts: texts
        };
        expect(table.isTableModelForMe(model)).toBeFalse();
    });

    it( 'Should reject a model with wrong element type', () => {
        const x = table.widthController.getMinWidth();
        const widths = [30, 40, 30];
        const texts = [
            ["1-1", "1-2", "1-3"],
            ["2-1", "2-2", "2-3"],
            ["3-1", "3-2", "3-3"],
        ];
        let model = {
            id: id,
            type: 'nonono',
            widths: widths,
            texts: texts
        };
        expect(table.isTableModelForMe(model)).toBeFalse();
    });

    it( 'Should reject a model with falsy element type', () => {
        const x = table.widthController.getMinWidth();
        const widths = [30, 40, 30];
        const texts = [
            ["1-1", "1-2", "1-3"],
            ["2-1", "2-2", "2-3"],
            ["3-1", "3-2", "3-3"],
        ];
        let model = {
            id: id,
            type: undefined,
            widths: widths,
            texts: texts
        };
        expect(table.isTableModelForMe(model)).toBeFalse();
    });

    it( 'Should reject a model with type-mismatching element type', () => {
        const x = table.widthController.getMinWidth();
        const widths = [30, 40, 30];
        const texts = [
            ["1-1", "1-2", "1-3"],
            ["2-1", "2-2", "2-3"],
            ["3-1", "3-2", "3-3"],
        ];
        let model = {
            id: id,
            type: 9,
            widths: widths,
            texts: texts
        };
        expect(table.isTableModelForMe(model)).toBeFalse();
    });

    it( 'Should reject a model where length of widths and number of columsn mismatch', () => {
        const x = table.widthController.getMinWidth();
        const widths = [70, 30];
        const texts = [
            ["1-1", "1-2", "1-3"],
            ["2-1", "2-2", "2-3"],
            ["3-1", "3-2", "3-3"],
        ];
        let model = {
            id: id,
            type: ElemTypes.table,
            widths: widths,
            texts: texts
        };
        expect(table.isTableModelForMe(model)).toBeFalse();
    });

});