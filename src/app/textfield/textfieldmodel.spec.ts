import { ElemTypes } from "../elemtypes";
import { TextfieldModel } from "./textfieldmodel";

describe( 'TextfieldModel', () => {
    let elemModel: TextfieldModel;
    const id: string = 'itemmodel123';
    const title: string = 'awesometitle';

    beforeEach(async () => {
        elemModel = new TextfieldModel(id, title);
    });

    it( 'Should accept a proper new model', () => {
        let json = {
            id: id,
            type: ElemTypes.textfield,
            rows: 5,
            text: 'Hello World',
            title: 'Headline'
        };
        expect(elemModel.validateModel(json)).toBeTrue();
    });

    it( 'Should reject a falsy model', () => {
        expect(elemModel.validateModel(undefined)).toBeFalse();
    });

    it( 'Should reject a model with wrong id', () => {
        let json = {
            id: id+"nope",
            type: ElemTypes.textfield,
            rows: 5,
            text: 'Hello World',
            title: 'Headline'
        };
        expect(elemModel.validateModel(json)).toBeFalse();
    });

    it( 'Should reject a model with falsy id', () => {
        let json = {
            id: undefined,
            type: ElemTypes.textfield,
            rows: 5,
            text: 'Hello World',
            title: 'Headline'
        };
        expect(elemModel.validateModel(json)).toBeFalse();
    });

    it( 'Should reject a model with id of wrong type', () => {
        let json = {
            id: 3,
            type: ElemTypes.textfield,
            rows: 5,
            text: 'Hello World',
            title: 'Headline'
        };
        expect(elemModel.validateModel(json)).toBeFalse();
    });

    it( 'Should reject a model with wrong element type', () => {
        let json = {
            id: id,
            type: 'nonono',
            rows: 5,
            text: 'Hello World',
            title: 'Headline'
        };
        expect(elemModel.validateModel(json)).toBeFalse();
    });

    it( 'Should reject a model with falsy element type', () => {
        let json = {
            id: id,
            type: undefined,
            rows: 5,
            text: 'Hello World',
            title: 'Headline'
        };
        expect(elemModel.validateModel(json)).toBeFalse();
    });

    it( 'Should reject a model with type-mismatching element type', () => {
        let json = {
            id: id,
            type: 12,
            rows: 5,
            text: 'Hello World',
            title: 'Headline'
        };
        expect(elemModel.validateModel(json)).toBeFalse();
    });

    it( 'Should reject a model with wrong row count', () => {
        let json = {
            id: id,
            type: ElemTypes.textfield,
            rows: -5,
            text: 'Hello World',
            title: 'Headline'
        };
        expect(elemModel.validateModel(json)).toBeFalse();
    });

    it( 'Should reject a model with falsy row count', () => {
        let json = {
            id: id,
            type: ElemTypes.textfield,
            rows: undefined,
            text: 'Hello World',
            title: 'Headline'
        };
        expect(elemModel.validateModel(json)).toBeFalse();
    });

    it( 'Should reject a model with type-mismatching row count', () => {
        let json = {
            id: id,
            type: ElemTypes.textfield,
            rows: 'many',
            text: 'Hello World',
            title: 'Headline'
        };
        expect(elemModel.validateModel(json)).toBeFalse();
    });
    
    it( 'Should reject a model with NaN row count', () => {
        let json = {
            id: id,
            type: ElemTypes.textfield,
            rows: Number.NaN,
            text: 'Hello World',
            title: 'Headline'
        };
        expect(elemModel.validateModel(json)).toBeFalse();
    });
    
    it( 'Should reject a model with poitively infinite row count', () => {
        let json = {
            id: id,
            type: ElemTypes.textfield,
            rows: Number.POSITIVE_INFINITY,
            text: 'Hello World',
            title: 'Headline'
        };
        expect(elemModel.validateModel(json)).toBeFalse();
    });
    
    it( 'Should reject a model with negatively infinite row count', () => {
        let json = {
            id: id,
            type: ElemTypes.textfield,
            rows: Number.NEGATIVE_INFINITY,
            text: 'Hello World',
            title: 'Headline'
        };
        expect(elemModel.validateModel(json)).toBeFalse();
    });
    
    it( 'Should reject a model with non-integer row count', () => {
        let json = {
            id: id,
            type: ElemTypes.textfield,
            rows: 3.14,
            text: 'Hello World',
            title: 'Headline'
        };
        expect(elemModel.validateModel(json)).toBeFalse();
    });
    
    it( 'Should reject a model with falsy text', () => {
        let json = {
            id: id,
            type: ElemTypes.textfield,
            rows: 5,
            text: undefined,
            title: 'Headline'
        };
        expect(elemModel.validateModel(json)).toBeFalse();
    });

    it( 'Should reject a model with type-mismatching text', () => {
        let json = {
            id: id,
            type: ElemTypes.textfield,
            rows: 5,
            text: 12,
            title: 'Headline'
        };
        expect(elemModel.validateModel(json)).toBeFalse();
    });

    it( 'Should accept a model with empty text', () => {
        let json = {
            id: id,
            type: ElemTypes.textfield,
            rows: 5,
            text: '',
            title: 'Headline'
        };
        expect(elemModel.validateModel(json)).toBeTrue();
    });

    it( 'Should reject a model with falsy title', () => {
        let json = {
            id: id,
            type: ElemTypes.textfield,
            rows: 5,
            text: 'Hello world',
            title: undefined
        };
        expect(elemModel.validateModel(json)).toBeFalse();
    });

    it( 'Should reject a model with type-mismatching title', () => {
        let json = {
            id: id,
            type: ElemTypes.textfield,
            rows: 5,
            text: 'Hello world',
            title: 15
        };
        expect(elemModel.validateModel(json)).toBeFalse();
    });

    it( 'Should reject a model with a missing title', () => {
        let json = {
            id: id,
            type: ElemTypes.textfield,
            rows: 5,
            text: 'Hello world'
        };
        expect(elemModel.validateModel(json)).toBeFalse();
    });

    it( 'Should accept a model with empty title', () => {
        let json = {
            id: id,
            type: ElemTypes.textfield,
            rows: 5,
            text: 'Hello world',
            title: ''
        };
        expect(elemModel.validateModel(json)).toBeTrue();
    });

});