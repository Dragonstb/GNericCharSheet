import { ActionTypes } from "../ActionTypes";
import { ElemTypes } from "../elemtypes";
import { GNericPageModel } from "./pagemodel";

describe( 'GNericPageModel', () => {
    let page: GNericPageModel;
    const id: string = 'model123';
    const title: string = 'awesometitle';

    beforeEach(async () => {
        page = new GNericPageModel(id, title);
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
            title: title,
            content: [
                {id: 'block1'},
                {id: 'block2'}
            ]
        }
        expect(page.validatePageModelLevel(model)).toBeTrue();
    });

    // ..... title problems .....

    it('page validation: should reject a model without title', () => {
        const model = {
            content: [
                {id: 'block1'},
                {id: 'block2'}
            ]
        }
        expect(page.validatePageModelLevel(model)).toBeFalse();
    });

    it('page validation: should reject a model with falsy title', () => {
        const model = {
            title: undefined,
            content: [
                {id: 'block1'},
                {id: 'block2'}
            ]
        }
        expect(page.validatePageModelLevel(model)).toBeFalse();
    });

    it('page validation: should reject a model with the title being of the wrong type', () => {
        const model = {
            title: 2,
            content: [
                {id: 'block1'},
                {id: 'block2'}
            ]
        }
        expect(page.validatePageModelLevel(model)).toBeFalse();
    });

    // ..... content problems .....    

    it('page validation: should reject a model with missing content', () => {
        const model = {
            title: title,
            ingredients: [
                {id: 'block1'},
                {id: 'block2'}
            ]
        }
        expect(page.validatePageModelLevel(model)).toBeFalse();
    });

    it('page validation: should reject a model with non-array content', () => {
        const model = {
            title: title,
            content: {id: 'hello', value: 3}
        }
        expect(page.validatePageModelLevel(model)).toBeFalse();
    });

    it('page validation: should reject a model with non-object content', () => {
        const model = {
            title: title,
            content: 3
        }
        expect(page.validatePageModelLevel(model)).toBeFalse();
    });

    it('page validation: should reject a model with falsy content', () => {
        const model = {
            title: title,
            content: undefined
        }
        expect(page.validatePageModelLevel(model)).toBeFalse();
    });

    it('page validation: should accept a model with empty content', () => {
        const model = {
            title: title,
            content: []
        }
        expect(page.validatePageModelLevel(model)).toBeTrue();
    });

    // ..... entry problems .....

    it('page validation: should reject a model with an entry with missing id', () => {
        const model = {
            title: title,
            content: [
                {value: 'block1'},
                {id: 'block2'}
            ]
        }
        expect(page.validatePageModelLevel(model)).toBeFalse();
    });

    it('page validation: should reject a model with an entry with falsy id', () => {
        const model = {
            title: title,
            content: [
                {id: undefined},
                {id: 'block2'}
            ]
        }
        expect(page.validatePageModelLevel(model)).toBeFalse();
    });

    it('page validation: should reject a model with an entry with non-string id', () => {
        const model = {
            title: title,
            content: [
                {id: 3},
                {id: 'block2'}
            ]
        }
        expect(page.validatePageModelLevel(model)).toBeFalse();
    });

    it('page validation: should reject a model with an entry with empty id', () => {
        const model = {
            title: title,
            content: [
                {id: ''},
                {id: 'block2'}
            ]
        }
        expect(page.validatePageModelLevel(model)).toBeFalse();
    });

    it('page validation: should reject a model with an entry with duplicate ids', () => {
        const model = {
            title: title,
            content: [
                {id: 'block1'},
                {id: 'block1'}
            ]
        }
        expect(page.validatePageModelLevel(model)).toBeFalse();
    });

    it('page validation: should reject a model with non-object entry', () => {
        const model = {
            title: title,
            content: [
                "Hello, I am a problem.",
                {id: 'block2'}
            ]
        }
        expect(page.validatePageModelLevel(model)).toBeFalse();
    });

    it('page validation: should reject a model with array entry', () => {
        const model = {
            title: title,
            content: [
                [{id: 'block1a'}, {id: 'block1b'}],
                {id: 'block2'}
            ]
        }
        expect(page.validatePageModelLevel(model)).toBeFalse();
    });

    it('page validation: should reject a model with falsy entry', () => {
        const model = {
            title: title,
            content: [
                undefined,
                {id: 'block2'}
            ]
        }
        expect(page.validatePageModelLevel(model)).toBeFalse();
    });

});