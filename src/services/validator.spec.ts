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

});