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

    // _______________ base validation _______________

    it('base validation: should accept a proper model', () => {
        const model = {
            id: id,
            type: ElemTypes.page,
            action: ActionTypes.pageupdate
        };

        expect(page.validateBaseModel(model)).toBeTrue();
    });

    it('base validation: should reject a model that is not an object', () => {
        const model = "Hello model";

        expect(page.validateBaseModel(model)).toBeFalse();
    });

    it('base validation: should reject a model that is falsy', () => {
        const model = undefined;

        expect(page.validateBaseModel(model)).toBeFalse();
    });

    it('base validation: should reject a model that is an array', () => {
        const model = [{
            id: id,
            type: ElemTypes.page,
            action: ActionTypes.pageupdate
        }];

        expect(page.validateBaseModel(model)).toBeFalse();
    });

    // ..... id problems .....

    it('base validation: should reject a model with missing id', () => {
        const model = {
            type: ElemTypes.page,
            action: ActionTypes.pageupdate
        }

        expect(page.validateBaseModel(model)).toBeFalse();
    });

    it('base validation: should reject a model with falsy id', () => {
        const model = {
            id: undefined,
            type: ElemTypes.page,
            action: ActionTypes.pageupdate
        }

        expect(page.validateBaseModel(model)).toBeFalse();
    });

    it('base validation: should reject a model with non-string id', () => {
        const model = {
            id: 3,
            type: ElemTypes.page,
            action: ActionTypes.pageupdate
        }

        expect(page.validateBaseModel(model)).toBeFalse();
    });

    it('base validation: should reject a model with empty id', () => {
        const model = {
            id: '',
            type: ElemTypes.page,
            action: ActionTypes.pageupdate
        }

        expect(page.validateBaseModel(model)).toBeFalse();
    });

    // ..... type problems .....

    it('base validation: should reject a model with missing type', () => {
        const model = {
            id: id,
            action: ActionTypes.pageupdate
        }

        expect(page.validateBaseModel(model)).toBeFalse();
    });

    it('base validation: should reject a model with falsy type', () => {
        const model = {
            id: id,
            type: undefined,
            action: ActionTypes.pageupdate
        }

        expect(page.validateBaseModel(model)).toBeFalse();
    });

    it('base validation: should reject a model with non-string type', () => {
        const model = {
            id: id,
            type: 3,
            action: ActionTypes.pageupdate
        }

        expect(page.validateBaseModel(model)).toBeFalse();
    });

    it('base validation: should reject a model with other type', () => {
        const model = {
            id: id,
            type: ElemTypes.checkboxes,
            action: ActionTypes.pageupdate
        }

        expect(page.validateBaseModel(model)).toBeFalse();
    });

    // ..... action problems .....

    it('base validation: should reject a model with missing action', () => {
        const model = {
            id: id,
            type: ElemTypes.page,
        }

        expect(page.validateBaseModel(model)).toBeFalse();
    });

    it('base validation: should reject a model with falsy action', () => {
        const model = {
            id: id,
            type: ElemTypes.page,
            action: undefined
        }

        expect(page.validateBaseModel(model)).toBeFalse();
    });

    it('base validation: should reject a model with non-string action', () => {
        const model = {
            id: id,
            type: ElemTypes.page,
            action: 3
        }

        expect(page.validateBaseModel(model)).toBeFalse();
    });

    it('base validation: should reject a model with empty action', () => {
        const model = {
            id: id,
            type: ElemTypes.page,
            action: ''
        }

        expect(page.validateBaseModel(model)).toBeFalse();
    });

    // _______________ page validation _______________

    it('page validation: should accept a proper model', () => {
        const model = {
            content: [
                {id: 'block1'},
                {id: 'block2'}
            ]
        }
        expect(page.validatePageModel(model)).toBeTrue();
    });

    // ..... content problems .....    

    it('page validation: should reject a model with missing content', () => {
        const model = {
            ingredients: [
                {id: 'block1'},
                {id: 'block2'}
            ]
        }
        expect(page.validatePageModel(model)).toBeFalse();
    });

    it('page validation: should reject a model with non-array content', () => {
        const model = {
            content: {id: 'hello', value: 3}
        }
        expect(page.validatePageModel(model)).toBeFalse();
    });

    it('page validation: should reject a model with non-object content', () => {
        const model = {
            content: 3
        }
        expect(page.validatePageModel(model)).toBeFalse();
    });

    it('page validation: should reject a model with falsy content', () => {
        const model = {
            content: undefined
        }
        expect(page.validatePageModel(model)).toBeFalse();
    });

    it('page validation: should accept a model with empty content', () => {
        const model = {
            content: []
        }
        expect(page.validatePageModel(model)).toBeTrue();
    });

    // ..... entry problems .....

    it('page validation: should reject a model with an entry with missing id', () => {
        const model = {
            content: [
                {value: 'block1'},
                {id: 'block2'}
            ]
        }
        expect(page.validatePageModel(model)).toBeFalse();
    });

    it('page validation: should reject a model with an entry with falsy id', () => {
        const model = {
            content: [
                {id: undefined},
                {id: 'block2'}
            ]
        }
        expect(page.validatePageModel(model)).toBeFalse();
    });

    it('page validation: should reject a model with an entry with non-string id', () => {
        const model = {
            content: [
                {id: 3},
                {id: 'block2'}
            ]
        }
        expect(page.validatePageModel(model)).toBeFalse();
    });

    it('page validation: should reject a model with an entry with empty id', () => {
        const model = {
            content: [
                {id: ''},
                {id: 'block2'}
            ]
        }
        expect(page.validatePageModel(model)).toBeFalse();
    });

    it('page validation: should reject a model with an entry with duplicate ids', () => {
        const model = {
            content: [
                {id: 'block1'},
                {id: 'block1'}
            ]
        }
        expect(page.validatePageModel(model)).toBeFalse();
    });

    it('page validation: should reject a model with non-object entry', () => {
        const model = {
            content: [
                "Hello, I am a problem.",
                {id: 'block2'}
            ]
        }
        expect(page.validatePageModel(model)).toBeFalse();
    });

    it('page validation: should reject a model with array entry', () => {
        const model = {
            content: [
                [{id: 'block1a'}, {id: 'block1b'}],
                {id: 'block2'}
            ]
        }
        expect(page.validatePageModel(model)).toBeFalse();
    });

    it('page validation: should reject a model with falsy entry', () => {
        const model = {
            content: [
                undefined,
                {id: 'block2'}
            ]
        }
        expect(page.validatePageModel(model)).toBeFalse();
    });


});