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

    // _______________ next id _______________

    it('Should return the correct next id', () => {
        const id1 = block.getNextId();
        const arr1 = id1.split('-');
        expect(arr1[0]+'-'+arr1[1]).toBe(block.getId());
        expect(arr1[2]).toBe(block.getIdKey());
        expect(arr1[3]).toBe('0');

        const id2 = block.getNextId();
        const arr2 = id2.split('-');
        expect(arr2[0]+'-'+arr2[1]).toBe(block.getId());
        expect(arr2[2]).toBe(block.getIdKey());
        expect(arr2[3]).toBe('1');
    });

    // _______________ base input valiadation _______________

    it('Should accept a proper model', () => {
        const model = {
            id: id,
            type: ElemTypes.blockupdate,
            model: {
                id: 'my name'
            }
        }
        expect(block.validateBaseModel(model)).toBeTrue();
    });

    it('Should reject a model which is not an object', () => {
        const model = "This is the story...";

        expect(block.validateBaseModel(model)).toBeFalse();
    });

    it('Should reject a model which is falsy', () => {
        const model = undefined;

        expect(block.validateBaseModel(model)).toBeFalse();
    });

    // ..... id problems .....

    it('Should reject a model with the id missing', () => {
        const model = {
            type: ElemTypes.blockupdate,
            model: {
                id: 'my name'
            }
        }
        expect(block.validateBaseModel(model)).toBeFalse();
    });

    it('Should reject a model with the id being falsy', () => {
        const model = {
            id: undefined,
            type: ElemTypes.blockupdate,
            model: {
                id: 'my name'
            }
        }
        expect(block.validateBaseModel(model)).toBeFalse();
    });

    it('Should reject a model with the id not being a string', () => {
        const model = {
            id: 1,
            type: ElemTypes.blockupdate,
            model: {
                id: 'my name'
            }
        }
        expect(block.validateBaseModel(model)).toBeFalse();
    });

    it('Should reject a model with the id being not my one', () => {
        const model = {
            id: id+'hello',
            type: ElemTypes.blockupdate,
            model: {
                id: 'my name'
            }
        }
        expect(block.validateBaseModel(model)).toBeFalse();
    });

    // ..... type problems .....

    it('Should reject a model with the type missing', () => {
        const model = {
            id: id,
            model: {
                id: 'my name'
            }
        }
        expect(block.validateBaseModel(model)).toBeFalse();
    });

    it('Should reject a model with the type being falsy', () => {
        const model = {
            id: id,
            type: undefined,
            model: {
                id: 'my name'
            }
        }
        expect(block.validateBaseModel(model)).toBeFalse();
    });

    it('Should reject a model with the type not being a string', () => {
        const model = {
            id: id,
            type: 1,
            model: {
                id: 'my name'
            }
        }
        expect(block.validateBaseModel(model)).toBeFalse();
    });

    // _______________ alteration input validation _______________
    
    it('validateAlterationModel: Should accept a proper model', () => {
        const model = {
            content: [
                {id: 'elem1', type: ElemTypes.table},
                {id: 'elem2', type: ElemTypes.rpm}
            ]
        }

        expect(block.validateAlterationModel(model)).toBeTrue();
    });

    // ..... content problems .....

    it('validateAlterationModel: Should reject a model with missing content', () => {
        const model = {
            appendix: [
                {id: 'elem1', type: ElemTypes.table},
                {id: 'elem2', type: ElemTypes.rpm}
            ]
        }

        expect(block.validateAlterationModel(model)).toBeFalse();
    });

    it('validateAlterationModel: Should reject a model with non-object content entry', () => {
        const model = {
            content: [
                4,
                {id: 'elem2', type: ElemTypes.rpm}
            ]
        }

        expect(block.validateAlterationModel(model)).toBeFalse();
    });

    it('validateAlterationModel: Should reject a model with falsy content entry', () => {
        const model = {
            content: [
                undefined,
                {id: 'elem2', type: ElemTypes.rpm}
            ]
        }

        expect(block.validateAlterationModel(model)).toBeFalse();
    });

    it('validateAlterationModel: Should reject a model with falsy content', () => {
        const model = {
            content: undefined
        }

        expect(block.validateAlterationModel(model)).toBeFalse();
    });

    it('validateAlterationModel: Should reject a model with content being a non-array object', () => {
        const model = {
            content: {id: 'elem1', type: ElemTypes.table}
        }

        expect(block.validateAlterationModel(model)).toBeFalse();
    });

    it('validateAlterationModel: Should reject a model with non-object content', () => {
        const model = {
            content: 9
        }

        expect(block.validateAlterationModel(model)).toBeFalse();
    });

    // ..... id problems .....

    it('validateAlterationModel: Should reject a model with missing id', () => {
        const model = {
            content: [
                {type: ElemTypes.table},
                {id: 'elem2', type: ElemTypes.rpm}
            ]
        }

        expect(block.validateAlterationModel(model)).toBeFalse();
    });

    it('validateAlterationModel: Should reject a model with falsy id', () => {
        const model = {
            content: [
                {id: undefined, type: ElemTypes.table},
                {id: 'elem2', type: ElemTypes.rpm}
            ]
        }

        expect(block.validateAlterationModel(model)).toBeFalse();
    });

    it('validateAlterationModel: Should reject a model with non-string id', () => {
        const model = {
            content: [
                {id: 2, type: ElemTypes.table},
                {id: 'elem2', type: ElemTypes.rpm}
            ]
        }

        expect(block.validateAlterationModel(model)).toBeFalse();
    });

    it('validateAlterationModel: Should reject a model with empty id', () => {
        const model = {
            content: [
                {id: '', type: ElemTypes.table},
                {id: 'elem2', type: ElemTypes.rpm}
            ]
        }

        expect(block.validateAlterationModel(model)).toBeFalse();
    });

    // ..... type problems .....

    it('validateAlterationModel: Should reject a model with missing type', () => {
        const model = {
            content: [
                {id: 'elem1'},
                {id: 'elem2', type: ElemTypes.rpm}
            ]
        }

        expect(block.validateAlterationModel(model)).toBeFalse();
    });

    it('validateAlterationModel: Should reject a model with falsy type', () => {
        const model = {
            content: [
                {id: 'elem1', type: undefined},
                {id: 'elem2', type: ElemTypes.rpm}
            ]
        }

        expect(block.validateAlterationModel(model)).toBeFalse();
    });

    it('validateAlterationModel: Should reject a model with non-string type', () => {
        const model = {
            content: [
                {id: 'elem1', type: 3},
                {id: 'elem2', type: ElemTypes.rpm}
            ]
        }

        expect(block.validateAlterationModel(model)).toBeFalse();
    });

    it('validateAlterationModel: Should reject a model with empty type', () => {
        const model = {
            content: [
                {id: 'elem1', type: ''},
                {id: 'elem2', type: ElemTypes.rpm}
            ]
        }

        expect(block.validateAlterationModel(model)).toBeFalse();
    });

    it('validateAlterationModel: Should reject a model with illegal type', () => {
        const model = {
            content: [
                {id: 'elem1', type: ElemTypes.blockupdate},
                {id: 'elem2', type: ElemTypes.rpm}
            ]
        }

        expect(block.validateAlterationModel(model)).toBeFalse();
    });

});