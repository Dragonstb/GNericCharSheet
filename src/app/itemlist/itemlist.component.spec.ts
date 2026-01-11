import { ComponentFixture, TestBed } from "@angular/core/testing";
import { GNericItemList } from "./itemlist.component";
import { DebugElement } from "@angular/core";

describe( 'GNericItemList', () => {
    let fixture: ComponentFixture<GNericItemList>;
    let list: GNericItemList;
    let natElem: HTMLElement;
    let dbgElem: DebugElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GNericItemList],
        }).compileComponents();
        
        fixture = TestBed.createComponent( GNericItemList );
        fixture.autoDetectChanges();
        list = fixture.componentInstance;
        natElem = fixture.nativeElement;
        dbgElem = fixture.debugElement;
        await fixture.whenStable();
    });

    // _______________ create _______________

    it('Should create the list', () => {
        expect( list ).toBeTruthy();
    });
    
});
