import { ActionTypes } from "../ActionTypes";
import { ElemTypes } from "../elemtypes";
import { GNericBlockModel } from "./blockmodel";

describe( 'ValidatorService', () => {
    let block: GNericBlockModel;
    const id: string = 'model123';
    const title: string = 'awesometitle';

    beforeEach(async () => {
        block = new GNericBlockModel(id);
    });

    // _______________ base input valiadation _______________

    it('baseValidation: Should accept a proper model', () => {
        const model = {
            id: id,
            type: ElemTypes.block,
            action: ActionTypes.elemupdate,
            model: {
                id: 'my name'
            }
        }
        expect(block.validateBaseModel(model)).toBeTrue();
    });

    it('baseValidation: Should reject a model which is not an object', () => {
        const model = "This is the story...";

        expect(block.validateBaseModel(model)).toBeFalse();
    });

    it('baseValidation: Should reject a model which is falsy', () => {
        const model = undefined;

        expect(block.validateBaseModel(model)).toBeFalse();
    });

    // ..... id problems .....

    it('baseValidation: Should reject a model with the id missing', () => {
        const model = {
            type: ElemTypes.block,
            action: ActionTypes.elemupdate,
            model: {
                id: 'my name'
            }
        }
        expect(block.validateBaseModel(model)).toBeFalse();
    });

    it('baseValidation: Should reject a model with the id being falsy', () => {
        const model = {
            id: undefined,
            type: ElemTypes.block,
            action: ActionTypes.elemupdate,
            model: {
                id: 'my name'
            }
        }
        expect(block.validateBaseModel(model)).toBeFalse();
    });

    it('baseValidation: Should reject a model with the id not being a string', () => {
        const model = {
            id: 1,
            type: ElemTypes.block,
            action: ActionTypes.elemupdate,
            model: {
                id: 'my name'
            }
        }
        expect(block.validateBaseModel(model)).toBeFalse();
    });

    it('baseValidation: Should reject a model with the id being not my one', () => {
        const model = {
            id: id+'hello',
            type: ElemTypes.block,
            action: ActionTypes.elemupdate,
            model: {
                id: 'my name'
            }
        }
        expect(block.validateBaseModel(model)).toBeFalse();
    });

    // ..... type problems .....

    it('baseValidation: Should reject a model with the type missing', () => {
        const model = {
            id: id,
            action: ActionTypes.elemupdate,
            model: {
                id: 'my name'
            }
        }
        expect(block.validateBaseModel(model)).toBeFalse();
    });

    it('baseValidation: Should reject a model with the type being falsy', () => {
        const model = {
            id: id,
            type: undefined,
            action: ActionTypes.elemupdate,
            model: {
                id: 'my name'
            }
        }
        expect(block.validateBaseModel(model)).toBeFalse();
    });

    it('baseValidation: Should reject a model with the type not being a string', () => {
        const model = {
            id: id,
            type: 1,
            action: ActionTypes.elemupdate,
            model: {
                id: 'my name'
            }
        }
        expect(block.validateBaseModel(model)).toBeFalse();
    });

    // ..... action problems .....

    it('baseValidation: Should reject a model with the action missing', () => {
        const model = {
            id: id,
            type: ElemTypes.block,
            model: {
                id: 'my name'
            }
        }
        expect(block.validateBaseModel(model)).toBeFalse();
    });

    it('baseValidation: Should reject a model with the action being falsy', () => {
        const model = {
            id: id,
            type: ElemTypes.block,
            action: undefined,
            model: {
                id: 'my name'
            }
        }
        expect(block.validateBaseModel(model)).toBeFalse();
    });

    it('baseValidation: Should reject a model with the action being og a different type', () => {
        const model = {
            id: id,
            type: ElemTypes.block,
            action: 3,
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

        expect(block.validateEntireModelLevel(model)).toBeTrue();
    });

    // ..... content problems .....

    it('validateAlterationModel: Should reject a model with missing content', () => {
        const model = {
            appendix: [
                {id: 'elem1', type: ElemTypes.table},
                {id: 'elem2', type: ElemTypes.rpm}
            ]
        }

        expect(block.validateEntireModelLevel(model)).toBeFalse();
    });

    it('validateAlterationModel: Should reject a model with non-object content entry', () => {
        const model = {
            content: [
                4,
                {id: 'elem2', type: ElemTypes.rpm}
            ]
        }

        expect(block.validateEntireModelLevel(model)).toBeFalse();
    });

    it('validateAlterationModel: Should reject a model with falsy content entry', () => {
        const model = {
            content: [
                undefined,
                {id: 'elem2', type: ElemTypes.rpm}
            ]
        }

        expect(block.validateEntireModelLevel(model)).toBeFalse();
    });

    it('validateAlterationModel: Should reject a model with falsy content', () => {
        const model = {
            content: undefined
        }

        expect(block.validateEntireModelLevel(model)).toBeFalse();
    });

    it('validateAlterationModel: Should reject a model with content being a non-array object', () => {
        const model = {
            content: {id: 'elem1', type: ElemTypes.table}
        }

        expect(block.validateEntireModelLevel(model)).toBeFalse();
    });

    it('validateAlterationModel: Should reject a model with non-object content', () => {
        const model = {
            content: 9
        }

        expect(block.validateEntireModelLevel(model)).toBeFalse();
    });

    // ..... id problems .....

    it('validateAlterationModel: Should reject a model with missing id', () => {
        const model = {
            content: [
                {type: ElemTypes.table},
                {id: 'elem2', type: ElemTypes.rpm}
            ]
        }

        expect(block.validateEntireModelLevel(model)).toBeFalse();
    });

    it('validateAlterationModel: Should reject a model with falsy id', () => {
        const model = {
            content: [
                {id: undefined, type: ElemTypes.table},
                {id: 'elem2', type: ElemTypes.rpm}
            ]
        }

        expect(block.validateEntireModelLevel(model)).toBeFalse();
    });

    it('validateAlterationModel: Should reject a model with non-string id', () => {
        const model = {
            content: [
                {id: 2, type: ElemTypes.table},
                {id: 'elem2', type: ElemTypes.rpm}
            ]
        }

        expect(block.validateEntireModelLevel(model)).toBeFalse();
    });

    it('validateAlterationModel: Should reject a model with empty id', () => {
        const model = {
            content: [
                {id: '', type: ElemTypes.table},
                {id: 'elem2', type: ElemTypes.rpm}
            ]
        }

        expect(block.validateEntireModelLevel(model)).toBeFalse();
    });

    // ..... type problems .....

    it('validateAlterationModel: Should reject a model with missing type', () => {
        const model = {
            content: [
                {id: 'elem1'},
                {id: 'elem2', type: ElemTypes.rpm}
            ]
        }

        expect(block.validateEntireModelLevel(model)).toBeFalse();
    });

    it('validateAlterationModel: Should reject a model with falsy type', () => {
        const model = {
            content: [
                {id: 'elem1', type: undefined},
                {id: 'elem2', type: ElemTypes.rpm}
            ]
        }

        expect(block.validateEntireModelLevel(model)).toBeFalse();
    });

    it('validateAlterationModel: Should reject a model with non-string type', () => {
        const model = {
            content: [
                {id: 'elem1', type: 3},
                {id: 'elem2', type: ElemTypes.rpm}
            ]
        }

        expect(block.validateEntireModelLevel(model)).toBeFalse();
    });

    it('validateAlterationModel: Should reject a model with empty type', () => {
        const model = {
            content: [
                {id: 'elem1', type: ''},
                {id: 'elem2', type: ElemTypes.rpm}
            ]
        }

        expect(block.validateEntireModelLevel(model)).toBeFalse();
    });

    it('validateAlterationModel: Should reject a model with illegal type', () => {
        const model = {
            content: [
                {id: 'elem1', type: ElemTypes.block},
                {id: 'elem2', type: ElemTypes.rpm}
            ]
        }

        expect(block.validateEntireModelLevel(model)).toBeFalse();
    });

});