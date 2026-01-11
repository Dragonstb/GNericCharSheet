import { ComponentFixture, TestBed } from "@angular/core/testing";
import { GNericCheckboxList } from "./checkboxes.component";
import { DebugElement } from "@angular/core";
import { ElemTypes } from "../elemtypes";

describe( 'GNericCheckboxList', () => {
    let fixture: ComponentFixture<GNericCheckboxList>;
    let list: GNericCheckboxList;
    let natElem: HTMLElement;
    let dbgElem: DebugElement;
    const id: string = "comp-05-05";
    const fullId = "checkboxes-"+id;
    

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GNericCheckboxList],
        }).compileComponents();
        
        fixture = TestBed.createComponent( GNericCheckboxList );
        fixture.autoDetectChanges();
        list = fixture.componentInstance;
        natElem = fixture.nativeElement;
        dbgElem = fixture.debugElement;
        // fixture.componentRef.setInput( 'id', id );
        await fixture.whenStable();
    });

    // _______________ create _______________

    it('Should create the list', () => {
        expect( list ).toBeTruthy();
    });

});
