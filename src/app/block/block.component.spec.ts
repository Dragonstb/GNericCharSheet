import { ComponentFixture, TestBed } from "@angular/core/testing";
import { GNericBlock } from "./block.component";
import { DebugElement } from "@angular/core";
import { ElemTypes } from "../elemtypes";

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

    // _______________ input valiadation _______________

    it('Should accept a proper model', () => {
        const model = {
            id: id,
            type: ElemTypes.blockupdate,
            model: {
                id: 'my name'
            }
        }
        expect(block.validateModel(model)).toBeTrue();
    });

    // ..... id problems .....

    it('Should reject a model with the id missing', () => {
        const model = {
            type: ElemTypes.blockupdate,
            model: {
                id: 'my name'
            }
        }
        expect(block.validateModel(model)).toBeFalse();
    });

    it('Should reject a model with the id being falsy', () => {
        const model = {
            id: undefined,
            type: ElemTypes.blockupdate,
            model: {
                id: 'my name'
            }
        }
        expect(block.validateModel(model)).toBeFalse();
    });

    it('Should reject a model with the id not being a string', () => {
        const model = {
            id: 1,
            type: ElemTypes.blockupdate,
            model: {
                id: 'my name'
            }
        }
        expect(block.validateModel(model)).toBeFalse();
    });

    it('Should reject a model with the id being not my one', () => {
        const model = {
            id: id+'hello',
            type: ElemTypes.blockupdate,
            model: {
                id: 'my name'
            }
        }
        expect(block.validateModel(model)).toBeFalse();
    });

    // ..... type problems .....

    it('Should reject a model with the type missing', () => {
        const model = {
            id: id,
            model: {
                id: 'my name'
            }
        }
        expect(block.validateModel(model)).toBeFalse();
    });

    it('Should reject a model with the type being falsy', () => {
        const model = {
            id: id,
            type: undefined,
            model: {
                id: 'my name'
            }
        }
        expect(block.validateModel(model)).toBeFalse();
    });

    it('Should reject a model with the type not being a string', () => {
        const model = {
            id: id,
            type: 1,
            model: {
                id: 'my name'
            }
        }
        expect(block.validateModel(model)).toBeFalse();
    });

});