import { ComponentFixture, TestBed } from "@angular/core/testing";
import { GNericBlock } from "./block.component";
import { DebugElement } from "@angular/core";
import { ElemTypes } from "../elemtypes";
import { ActionTypes } from "../ActionTypes";

describe( 'GNericBlock', () => {
    let fixture: ComponentFixture<GNericBlock>;
    let block: GNericBlock;
    let natElem: HTMLElement;
    let dbgElem: DebugElement;
    const id: string = "comp-0";    

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GNericBlock],
        }).compileComponents();
        
        fixture = TestBed.createComponent( GNericBlock );
        fixture.autoDetectChanges();
        block = fixture.componentInstance;
        natElem = fixture.nativeElement;
        dbgElem = fixture.debugElement;
        // fixture.componentRef.setInput( 'id', id );
        await fixture.whenStable();
    });

    // _______________ create _______________

    it('Should create the list', () => {
        expect( block ).toBeTruthy();
    });

    // _______________ next id _______________

    it('Should return the correct next id', () => {
        const prefix = 'yay';

        const id1 = block.getNextId(prefix);
        const arr1 = id1.split('-');
        expect(arr1[0]).toBe(prefix);
        expect(arr1[1]).toBe(block.getIdKey());
        expect(arr1[2]).toBe('0');

        const id2 = block.getNextId(prefix);
        const arr2 = id2.split('-');
        expect(arr2[0]).toBe(prefix);
        expect(arr2[1]).toBe(block.getIdKey());
        expect(arr2[2]).toBe('1');
    });


});