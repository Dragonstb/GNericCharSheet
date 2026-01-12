import { ComponentFixture, TestBed } from "@angular/core/testing";
import { GNericSheetPage } from "./sheetpage.component";
import { DebugElement } from "@angular/core";
import { ElemTypes } from "../elemtypes";
import { ActionTypes } from "../ActionTypes";
import { isYieldExpression } from "typescript";

describe( 'GNericSheetPage', () => {
    let fixture: ComponentFixture<GNericSheetPage>;
    let page: GNericSheetPage;
    let natElem: HTMLElement;
    let dbgElem: DebugElement;
    const id: string = "page-0";    

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GNericSheetPage],
        }).compileComponents();
        
        fixture = TestBed.createComponent( GNericSheetPage );
        fixture.autoDetectChanges();
        page = fixture.componentInstance;
        natElem = fixture.nativeElement;
        dbgElem = fixture.debugElement;
        // fixture.componentRef.setInput( 'id', id );
        await fixture.whenStable();
    });

    // _______________ create _______________

    it('Should create the list', () => {
        expect( page ).toBeTruthy();
    });

});