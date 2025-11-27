import { ValidatorService } from "./validator";
import { ElemTypes } from "../app/elemtypes";

describe( 'ValidatorService', () => {
    let validator: ValidatorService;

    beforeEach(async () => {
        validator = new ValidatorService();
    });

    // _______________ is model _______________

    it('Should accept an object as model', () => {
        const model = {some: 'thing'};
        expect(validator.isModel(model)).toBeTrue();
    });

    it('Should reject null', () => {
        const model = null;
        expect(validator.isModel(model)).toBeFalse();
    });

    it('Should reject undefined', () => {
        const model = undefined;
        expect(validator.isModel(model)).toBeFalse();
    });

    it('Should reject a non-object', () => {
        const model = "{some: thing}";
        expect(validator.isModel(model)).toBeFalse();
    });
    
    // _______________ is for me _______________
    
    it('Should accept properly addressed model', () => {
        const id: string = "comp-123";
        const type: ElemTypes = ElemTypes.table;
        const model = {
            id: id,
            type: type
        };
        expect(validator.isForMe(id, type, model)).toBeTrue();
    });

    it('Should reject a model with wrong id', () => {
        const id: string = "comp-123";
        const type: ElemTypes = ElemTypes.table;
        const model = {
            id: id+"nope",
            type: type
        };
        expect(validator.isForMe(id, type, model)).toBeFalse();
    });
    
    it('Should reject a model with missing id', () => {
        const id: string = "comp-123";
        const type: ElemTypes = ElemTypes.table;
        const model = {
            type: type
        };
        expect(validator.isForMe(id, type, model)).toBeFalse();
    });

    it('Should reject a model with falsy id', () => {
        const id: string = "comp-123";
        const type: ElemTypes = ElemTypes.table;
        const model = {
            id: undefined,
            type: type
        };
        expect(validator.isForMe(id, type, model)).toBeFalse();
    });

    it('Should reject a model with id of wrong type', () => {
        const id: string = "comp-123";
        const type: ElemTypes = ElemTypes.table;
        const model = {
            id: 3,
            type: type
        };
        expect(validator.isForMe(id, type, model)).toBeFalse();
    });

    it('Should reject a model with wrong type', () => {
        const id: string = "comp-123";
        const type: ElemTypes = ElemTypes.table;
        const model = {
            id: id,
            type: ElemTypes.rpm
        };
        expect(validator.isForMe(id, type, model)).toBeFalse();
    });

    it('Should reject a model with falsy type', () => {
        const id: string = "comp-123";
        const type: ElemTypes = ElemTypes.table;
        const model = {
            id: id,
            type: undefined
        };
        expect(validator.isForMe(id, type, model)).toBeFalse();
    });

    it('Should reject a model with missing type', () => {
        const id: string = "comp-123";
        const type: ElemTypes = ElemTypes.table;
        const model = {
            id: id
        };
        expect(validator.isForMe(id, type, model)).toBeFalse();
    });

    it('Should reject a model with type of wrong type', () => {
        const id: string = "comp-123";
        const type: ElemTypes = ElemTypes.table;
        const model = {
            id: id,
            type: 3
        };
        expect(validator.isForMe(id, type, model)).toBeFalse();
    });
    
    // _______________ is number array _______________

    it('Should accept a model with a correctly addressed number array', () => {
        const name: string = "counts";
        const arr: number[] = [1, 2, 3];
        const model = {
            counts: arr
        };
        expect(validator.hasNumberArray(name, model)).toBeTrue();
    });

    it('Should reject a model with a correctly addressed array of mixed type', () => {
        const name: string = "counts";
        const arr = [1, "two", 3];
        const model = {
            counts: arr
        };
        expect(validator.hasNumberArray(name, model)).toBeFalse();
    });

    it('Should reject a model with a non-array obkect as property', () => {
        const name: string = "counts";
        const arr = {this: "is", not: "an array"};
        const model = {
            counts: arr
        };
        expect(validator.hasNumberArray(name, model)).toBeFalse();
    });

    it('Should reject a model with a property of another type', () => {
        const name: string = "counts";
        const arr = 3;
        const model = {
            counts: arr
        };
        expect(validator.hasNumberArray(name, model)).toBeFalse();
    });

    it('Should reject a model with a falsy property', () => {
        const name: string = "counts";
        const arr = undefined;
        const model = {
            counts: arr
        };
        expect(validator.hasNumberArray(name, model)).toBeFalse();
    });

    it('Should reject a model with no such property', () => {
        const name: string = "counts";
        const arr = undefined;
        const model = {
            numbering: arr
        };
        expect(validator.hasNumberArray(name, model)).toBeFalse();
    });

    // _______________ is string array _______________

    it('Should accept a model with a correctly addressed number array', () => {
        const name: string = "counts";
        const arr: string[] = ["one", "two", "three"];
        const model = {
            counts: arr
        };
        expect(validator.hasStringArray(name, model)).toBeTrue();
    });

    it('Should reject a model with a correctly addressed array of mixed type', () => {
        const name: string = "counts";
        const arr = ["one", "two", 3];
        const model = {
            counts: arr
        };
        expect(validator.hasStringArray(name, model)).toBeFalse();
    });

    it('Should reject a model with a non-array obkect as property', () => {
        const name: string = "counts";
        const arr = {this: "is", not: "an array"};
        const model = {
            counts: arr
        };
        expect(validator.hasStringArray(name, model)).toBeFalse();
    });

    it('Should reject a model with a property of another type', () => {
        const name: string = "counts";
        const arr = 3;
        const model = {
            counts: arr
        };
        expect(validator.hasStringArray(name, model)).toBeFalse();
    });

    it('Should reject a model with a falsy property', () => {
        const name: string = "counts";
        const arr = undefined;
        const model = {
            counts: arr
        };
        expect(validator.hasStringArray(name, model)).toBeFalse();
    });

    it('Should reject a model with no such property', () => {
        const name: string = "counts";
        const arr = undefined;
        const model = {
            numbering: arr
        };
        expect(validator.hasStringArray(name, model)).toBeFalse();
    });

    // _______________ has(NonEmpty)StringProperty _______________

    it('hasStringProperty: should accept a model with such a property', () => {
        const name: string = "text";
        const model = {
            text: "Hello"
        };
        expect(validator.hasStringProperty(name, model)).toBeTrue();
    });

    it('hasStringProperty: should accept a model with the empty string', () => {
        const name: string = "text";
        const model = {
            text: ""
        };
        expect(validator.hasStringProperty(name, model)).toBeTrue();
    });

    it('hasStringProperty: should reject a model with no such property', () => {
        const name: string = "text";
        const model = {
            something: "else"
        };
        expect(validator.hasStringProperty(name, model)).toBeFalse();
    });

    it('hasStringProperty: should reject a model with the prop being null', () => {
        const name: string = "text";
        const model = {
            text: null
        };
        expect(validator.hasStringProperty(name, model)).toBeFalse();
    });

    it('hasStringProperty: should reject a model with the prop being undefined', () => {
        const name: string = "text";
        const model = {
            text: undefined
        };
        expect(validator.hasStringProperty(name, model)).toBeFalse();
    });

    it('hasStringProperty: should reject a model with the prop being of different type', () => {
        const name: string = "text";
        const model = {
            text: 3
        };
        expect(validator.hasStringProperty(name, model)).toBeFalse();
    });

    it('hasNonEmptyStringProperty: should reject a model with the prop being the empty string', () => {
        const name: string = "text";
        const model = {
            text: ''
        };
        expect(validator.hasNonEmptyStringProperty(name, model)).toBeFalse();
    });

    // _______________ hasNumberProperty _______________

    it('hasNumberProperty: should accept a model with such a property', () => {
        const name: string = "num";
        const model = {
            num: 3
        };
        expect(validator.hasNumberProperty(name, model)).toBeTrue();
    });

    it('hasNumberProperty: should accept a model with NaN', () => {
        const name: string = "num";
        const model = {
            num: Number.NaN
        };
        expect(validator.hasNumberProperty(name, model)).toBeTrue();
    });

    it('hasNumberProperty: should accept a model with positive infinity', () => {
        const name: string = "num";
        const model = {
            num: Number.POSITIVE_INFINITY
        };
        expect(validator.hasNumberProperty(name, model)).toBeTrue();
    });

    it('hasNumberProperty: should accept a model with negative infinity', () => {
        const name: string = "num";
        const model = {
            num: Number.NEGATIVE_INFINITY
        };
        expect(validator.hasNumberProperty(name, model)).toBeTrue();
    });

    it('hasNumberProperty: should reject a model with no such property', () => {
        const name: string = "num";
        const model = {
            something: 1
        };
        expect(validator.hasNumberProperty(name, model)).toBeFalse();
    });

    it('hasNumberProperty: should reject a model with the prop being null', () => {
        const name: string = "num";
        const model = {
            num: null
        };
        expect(validator.hasNumberProperty(name, model)).toBeFalse();
    });

    it('hasNumberProperty: should reject a model with the prop being undefined', () => {
        const name: string = "num";
        const model = {
            num: undefined
        };
        expect(validator.hasNumberProperty(name, model)).toBeFalse();
    });

    it('hasNumberProperty: should reject a model with the prop being of different type', () => {
        const name: string = "num";
        const model = {
            num: "three"
        };
        expect(validator.hasNumberProperty(name, model)).toBeFalse();
    });
    
    it('hasFiniteNumberProperty: should reject a model with NaN', () => {
        const name: string = "num";
        const model = {
            num: Number.NaN
        };
        expect(validator.hasFiniteNumberProperty(name, model)).toBeFalse();
    });
    
    it('hasFiniteNumberProperty: should reject a model with positive infinity', () => {
        const name: string = "num";
        const model = {
            num: Number.POSITIVE_INFINITY
        };
        expect(validator.hasFiniteNumberProperty(name, model)).toBeFalse();
    });
    
    it('hasFiniteNumberProperty: should reject a model with negative infinity', () => {
        const name: string = "num";
        const model = {
            num: Number.NEGATIVE_INFINITY
        };
        expect(validator.hasFiniteNumberProperty(name, model)).toBeFalse();
    });
    
    it('hasFiniteIntegerProperty: should reject a model with non-integer value', () => {
        const name: string = "num";
        const model = {
            num: 3.14
        };
        expect(validator.hasFiniteIntegerProperty(name, model)).toBeFalse();
    });

    it('hasFiniteIntegerProperty: should accept a model with integer value', () => {
        const name: string = "num";
        const model = {
            num: 5
        };
        expect(validator.hasFiniteIntegerProperty(name, model)).toBeTrue();
    });

    // _______________ isCoreType _______________

    it('isCoreElemType: should accept textfield', () => {
        expect(validator.isCoreElemType(ElemTypes.textfield)).toBeTrue();
    });

    it('isCoreElemType: should accept table', () => {
        expect(validator.isCoreElemType(ElemTypes.table)).toBeTrue();
    });

    it('isCoreElemType: should accept rpm', () => {
        expect(validator.isCoreElemType(ElemTypes.rpm)).toBeTrue();
    });

    it('isCoreElemType: should accept itemlist', () => {
        expect(validator.isCoreElemType(ElemTypes.itemlist)).toBeTrue();
    });

    it('isCoreElemType: should accept checkboxes', () => {
        expect(validator.isCoreElemType(ElemTypes.checkboxes)).toBeTrue();
    });

    it('isCoreElemType: should reject gibberish', () => {
        expect(validator.isCoreElemType('chuiakxuy')).toBeFalse();
    });

    it('isCoreElemType: should reject the empty string', () => {
        expect(validator.isCoreElemType('')).toBeFalse();
    });

    it('isCoreElemType: should reject undefined', () => {
        expect(validator.isCoreElemType(undefined!)).toBeFalse();
    });

    it('isCoreElemType: should reject null', () => {
        expect(validator.isCoreElemType(null!)).toBeFalse();
    });

});