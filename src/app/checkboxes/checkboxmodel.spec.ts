import { ElemTypes } from "../elemtypes";
import { CheckboxModel } from "./checkboxmodel";

describe( 'CheckboxModel', () => {
    let elemModel: CheckboxModel;
    const id: string = 'itemmodel123';
    const title: string = 'awesometitle';

    beforeEach(async () => {
        elemModel = new CheckboxModel(id, title);
    });
    
    // _______________ input valiadation _______________

    it('Should accept a proper model ', () => {
        const model = {
            id: id,
            type: ElemTypes.checkboxes,
            title: 'Title',
            rows: [
                {text: 'Text 1', checked: true},
                {text: 'Text 2', checked: false}
            ]
        };
        expect( elemModel.validateModel(model) ).toBeTrue();
    });

    it('Should reject a non-model ', () => {
        const model = 1;
        expect( elemModel.validateModel(model) ).toBeFalse();
    });

    // ..... id problems .....

    it('Should reject a model where the id is missing', () => {
        const model = {
            type: ElemTypes.checkboxes,
            title: 'Title',
            rows: [
                {text: 'Text 1', checked: true},
                {text: 'Text 2', checked: false}
            ]
        };
        expect( elemModel.validateModel(model) ).toBeFalse();
    });

    it('Should reject a model where where the id is falsy', () => {
        const model = {
            id: undefined,
            type: ElemTypes.checkboxes,
            title: 'Title',
            rows: [
                {text: 'Text 1', checked: true},
                {text: 'Text 2', checked: false}
            ]
        };
        expect( elemModel.validateModel(model) ).toBeFalse();
    });

    it('Should reject a model where where the id is of the wrong type', () => {
        const model = {
            id: 2,
            type: ElemTypes.checkboxes,
            title: 'Title',
            rows: [
                {text: 'Text 1', checked: true},
                {text: 'Text 2', checked: false}
            ]
        };
        expect( elemModel.validateModel(model) ).toBeFalse();
    });

    it('Should reject a model where the id is incorrect', () => {
        const model = {
            id: id+"addendum",
            type: ElemTypes.checkboxes,
            title: 'Title',
            rows: [
                {text: 'Text 1', checked: true},
                {text: 'Text 2', checked: false}
            ]
        };
        expect( elemModel.validateModel(model) ).toBeFalse();
    });

    // ..... type problems .....

    it('Should reject a model where the type is missing', () => {
        const model = {
            id: id,
            title: 'Title',
            rows: [
                {text: 'Text 1', checked: true},
                {text: 'Text 2', checked: false}
            ]
        };
        expect( elemModel.validateModel(model) ).toBeFalse();
    });

    it('Should reject a model where the type is falsy', () => {
        const model = {
            id: id,
            type: undefined,
            title: 'Title',
            rows: [
                {text: 'Text 1', checked: true},
                {text: 'Text 2', checked: false}
            ]
        };
        expect( elemModel.validateModel(model) ).toBeFalse();
    });

    it('Should reject a model where the type is of th wrong type', () => {
        const model = {
            id: id,
            type: 3,
            title: 'Title',
            rows: [
                {text: 'Text 1', checked: true},
                {text: 'Text 2', checked: false}
            ]
        };
        expect( elemModel.validateModel(model) ).toBeFalse();
    });

    it('Should reject a model where the type describes a wrong type', () => {
        const model = {
            id: id,
            type: ElemTypes.table,
            title: 'Title',
            rows: [
                {text: 'Text 1', checked: true},
                {text: 'Text 2', checked: false}
            ]
        };
        expect( elemModel.validateModel(model) ).toBeFalse();
    });

    // ..... title problems .....

    it('Should reject a model where the title is missing', () => {
        const model = {
            id: id,
            type: ElemTypes.checkboxes,
            rows: [
                {text: 'Text 1', checked: true},
                {text: 'Text 2', checked: false}
            ]
        };
        expect( elemModel.validateModel(model) ).toBeFalse();
    });

    it('Should reject a model where the title is falsy', () => {
        const model = {
            id: id,
            type: ElemTypes.checkboxes,
            title: undefined,
            rows: [
                {text: 'Text 1', checked: true},
                {text: 'Text 2', checked: false}
            ]
        };
        expect( elemModel.validateModel(model) ).toBeFalse();
    });

    it('Should reject a model where the title is of the wrong type', () => {
        const model = {
            id: id,
            type: ElemTypes.checkboxes,
            title: 5,
            rows: [
                {text: 'Text 1', checked: true},
                {text: 'Text 2', checked: false}
            ]
        };
        expect( elemModel.validateModel(model) ).toBeFalse();
    });

    it('Should accept a model where the title is empty', () => {
        const model = {
            id: id,
            type: ElemTypes.checkboxes,
            title: '',
            rows: [
                {text: 'Text 1', checked: true},
                {text: 'Text 2', checked: false}
            ]
        };
        expect( elemModel.validateModel(model) ).toBeTrue();
    });

    // ..... rows in general problem .....

    it('Should reject a model where the rows are missing', () => {
        const model = {
            id: id,
            type: ElemTypes.checkboxes,
            title: 'Title'
        };
        expect( elemModel.validateModel(model) ).toBeFalse();
    });

    it('Should reject a model where the rows are falsy', () => {
        const model = {
            id: id,
            type: ElemTypes.checkboxes,
            title: 'Title',
            rows: undefined
        };
        expect( elemModel.validateModel(model) ).toBeFalse();
    });

    it('Should reject a model where the rows are not an array', () => {
        const model = {
            id: id,
            type: ElemTypes.checkboxes,
            title: 'Title',
            rows: 'A string is not array here'
        };
        expect( elemModel.validateModel(model) ).toBeFalse();
    });

    it('Should reject a model where the rows are a non-arry object', () => {
        const model = {
            id: id,
            type: ElemTypes.checkboxes,
            title: 'Title',
            rows: {text: 'Text 1', checked: true}
        };
        expect( elemModel.validateModel(model) ).toBeFalse();
    });

    it('Should reject a model where the rows are too few', () => {
        const model = {
            id: id,
            type: ElemTypes.checkboxes,
            title: 'Title',
            rows: []
        };
        expect( elemModel.validateModel(model) ).toBeFalse();
    });

    it('Should reject a model where the rows are not an object', () => {
        const model = {
            id: id,
            type: ElemTypes.checkboxes,
            title: 'Title',
            rows: [
                "text: Text 1, checked: true",
                {text: 'Text 2', checked: false}
            ]
        };
        expect( elemModel.validateModel(model) ).toBeFalse();
    });

    // ..... rows items problem .....

    it('Should reject a model with a row where the text is missing', () => {
        const model = {
            id: id,
            type: ElemTypes.checkboxes,
            title: 'Title',
            rows: [
                {checked: true},
                {text: 'Text 2', checked: false}
            ]
        };
        expect( elemModel.validateModel(model) ).toBeFalse();
    });

    it('Should reject a model with a row where the text is falsy', () => {
        const model = {
            id: id,
            type: ElemTypes.checkboxes,
            title: 'Title',
            rows: [
                {text: undefined, checked: true},
                {text: 'Text 2', checked: false}
            ]
        };
        expect( elemModel.validateModel(model) ).toBeFalse();
    });

    it('Should reject a model with a row where the text is of a wrong type', () => {
        const model = {
            id: id,
            type: ElemTypes.checkboxes,
            title: 'Title',
            rows: [
                {text: 6, checked: true},
                {text: 'Text 2', checked: false}
            ]
        };
        expect( elemModel.validateModel(model) ).toBeFalse();
    });

    it('Should accept a model with a row where the text is empty', () => {
        const model = {
            id: id,
            type: ElemTypes.checkboxes,
            title: 'Title',
            rows: [
                {text: '', checked: true},
                {text: 'Text 2', checked: false}
            ]
        };
        expect( elemModel.validateModel(model) ).toBeTrue();
    });

    it('Should reject a model with a row where the check is missing', () => {
        const model = {
            id: id,
            type: ElemTypes.checkboxes,
            title: 'Title',
            rows: [
                {text: 'Text 1'},
                {text: 'Text 2', checked: false}
            ]
        };
        expect( elemModel.validateModel(model) ).toBeFalse();
    });

    it('Should reject a model with a row where the check is falsy but not false', () => {
        const model = {
            id: id,
            type: ElemTypes.checkboxes,
            title: 'Title',
            rows: [
                {text: 'Text 1', checked: undefined},
                {text: 'Text 2', checked: false}
            ]
        };
        expect( elemModel.validateModel(model) ).toBeFalse();
    });

    it('Should reject a model with a row where the check is of a wrong type', () => {
        const model = {
            id: id,
            type: ElemTypes.checkboxes,
            title: 'Title',
            rows: [
                {text: 'Text 1', checked: 7},
                {text: 'Text 2', checked: false}
            ]
        };
        expect( elemModel.validateModel(model) ).toBeFalse();
    });

});