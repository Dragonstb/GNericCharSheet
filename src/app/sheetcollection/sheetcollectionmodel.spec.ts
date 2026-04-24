import { ActionTypes } from "../ActionTypes";
import { ElemTypes } from "../elemtypes";
import { GNericSheetModel } from "../sheet/sheetmodel";
import { GNericSheetCollectionModel } from "./sheetcollectionmodel";

describe( 'GNericSheetCollectionModel', () => {
    let collection: GNericSheetCollectionModel;

    beforeEach(async () => {
        collection = new GNericSheetCollectionModel();
    });

    // _______________ base model validation _______________

    it('base validation: should accept a proper model', () => {
        const model = {
            type: ElemTypes.sheetcollection,
            action: ActionTypes.sheetupdate
        }
        expect(collection.validateBaseModel(model)).toBeTrue();
    });
    
    it('base validation: should reject a model that is null', () => {
        const model = null;
        expect(collection.validateBaseModel(model)).toBeFalse();
    });
    
    it('base validation: should reject a model that is undfined', () => {
        const model = undefined
        expect(collection.validateBaseModel(model)).toBeFalse();
    });
    
    it('base validation: should reject a model that is not an object', () => {
        const model = 'A string is a number';
        expect(collection.validateBaseModel(model)).toBeFalse();
    });
    
    it('base validation: should reject a model that is an array', () => {
        const model = [1, 2, 3];
        expect(collection.validateBaseModel(model)).toBeFalse();
    });
    
    // ..... type problems .....

    it('base validation: should reject a model without type', () => {
        const model = {
            action: ActionTypes.sheetupdate
        }
        expect(collection.validateBaseModel(model)).toBeFalse();
    });

    it('base validation: should reject a model with falsy type', () => {
        const model = {
            type: undefined,
            action: ActionTypes.sheetupdate
        }
        expect(collection.validateBaseModel(model)).toBeFalse();
    });

    it('base validation: should reject a model with non-string type', () => {
        const model = {
            type: 2,
            action: ActionTypes.sheetupdate
        }
        expect(collection.validateBaseModel(model)).toBeFalse();
    });

    it('base validation: should reject a model with another type', () => {
        const model = {
            type: ElemTypes.block,
            action: ActionTypes.sheetupdate
        }
        expect(collection.validateBaseModel(model)).toBeFalse();
    });

    // ..... action problems .....

    it('base validation: should reject a model without action', () => {
        const model = {
            type: ElemTypes.sheetcollection,
        }
        expect(collection.validateBaseModel(model)).toBeFalse();
    });

    it('base validation: should reject a model with falsy action', () => {
        const model = {
            type: ElemTypes.sheetcollection,
            action: undefined
        }
        expect(collection.validateBaseModel(model)).toBeFalse();
    });

    it('base validation: should reject a model with non-string action', () => {
        const model = {
            type: ElemTypes.sheetcollection,
            action: 5
        }
        expect(collection.validateBaseModel(model)).toBeFalse();
    });

    it('base validation: should reject a model with empty action', () => {
        const model = {
            type: ElemTypes.sheetcollection,
            action: ''
        }
        expect(collection.validateBaseModel(model)).toBeFalse();
    });

    // _______________ sheet model validation _______________

    it('sheet validation: should accept a proper model', () => {
        const model = {
            type: ElemTypes.sheetcollection,
            content: [
                new GNericSheetModel('char-0', 'Sam').getModel(),
                new GNericSheetModel('char-1', 'Alex').getModel(),
            ]
        }
        expect(collection.validateCollectionLevelModel(model)).toBeTrue();
    });

    // ..... content problems .....

    it('sheet validation: should reject a model without content', () => {
        const model = {
            type: ElemTypes.sheetcollection,
        }
        expect(collection.validateCollectionLevelModel(model)).toBeFalse();
    });

    it('sheet validation: should reject a model with falsy content', () => {
        const model = {
            type: ElemTypes.sheetcollection,
            content: undefined
        }
        expect(collection.validateCollectionLevelModel(model)).toBeFalse();
    });

    it('sheet validation: should reject a model with non-object content', () => {
        const model = {
            type: ElemTypes.sheetcollection,
            content: "rated M"
        }
        expect(collection.validateCollectionLevelModel(model)).toBeFalse();
    });

    it('sheet validation: should reject a model with non-array content', () => {
        const model = {
            type: ElemTypes.sheetcollection,
            content: {
                hero1: {
                    name: "Sam",
                    id: "char-0"
                },
                hero2: {
                    name: "Alex",
                    id: "char-1"
                }
            }
        }
        expect(collection.validateCollectionLevelModel(model)).toBeFalse();
    });

    it('sheet validation: should accept a model with empty content', () => {
        const model = {
            type: ElemTypes.sheetcollection,
            content: []
        }
        expect(collection.validateCollectionLevelModel(model)).toBeTrue();
    });

    // ..... page problems .....

    it('sheet validation: should reject a model where a sheet is falsy', () => {
        const model = {
            type: ElemTypes.sheetcollection,
            content: [
                new GNericSheetModel('char-0', 'Sam').getModel(),
                undefined
            ]
        }
        expect(collection.validateCollectionLevelModel(model)).toBeFalse();
    });

    it('sheet validation: should reject a model where a sheet is not an object', () => {
        const model = {
            type: ElemTypes.sheetcollection,
            content: [
                new GNericSheetModel('char-0', 'Sam').getModel(),
                "Ooops"
            ]
        }
        expect(collection.validateCollectionLevelModel(model)).toBeFalse();
    });

    it('sheet validation: should reject a model where a sheet is an array', () => {
        const model = {
            type: ElemTypes.sheetcollection,
            content: [
                new GNericSheetModel('char-0', 'Sam').getModel(),
                [1,2,3]
            ]
        }
        expect(collection.validateCollectionLevelModel(model)).toBeFalse();
    });

    it('sheet validation: should reject a model where a sheet lacks the id', () => {
        const model = {
            type: ElemTypes.sheetcollection,
            content: [
                new GNericSheetModel('char-0', 'Sam').getModel(),
                {type: ElemTypes.sheet, name: "Alex", content: []}
            ]
        }
        expect(collection.validateCollectionLevelModel(model)).toBeFalse();
    });

    it('sheet validation: should reject a model where two distinct sheets have the same id', () => {
        const model = {
            type: ElemTypes.sheetcollection,
            content: [
                new GNericSheetModel('char-0', 'Sam').getModel(),
                new GNericSheetModel('char-0', 'Alex').getModel(),
            ]
        }
        expect(collection.validateCollectionLevelModel(model)).toBeFalse();
    });

    // _______________ content model validation for merge _______________

    it('merge-content validation: should accept a proper model', () => {
        const existingSheet = new GNericSheetModel('char-x', 'Anonymous');
        collection.addSheet(existingSheet);

        const model = {
            type: ElemTypes.sheetcollection,
            content: [
                new GNericSheetModel('char-0', 'Sam').getModel(),
                new GNericSheetModel('char-1', 'Alex').getModel(),
            ]
        }

        const list = collection.validateCollectionLevelModelIndividual(model);
        expect(list.length).toBe(2);
    });

    // ..... content problems .....

    it('merge-content validation: should reject a model without content', () => {
        const existingSheet = new GNericSheetModel('char-x', 'Anonymous');
        collection.addSheet(existingSheet);

        const model = {
            type: ElemTypes.sheetcollection,
        }

        const list = collection.validateCollectionLevelModelIndividual(model);
        expect(list.length).toBe(0);
    });

    it('merge-content validation: should reject a model with falsy content', () => {
        const existingSheet = new GNericSheetModel('char-x', 'Anonymous');
        collection.addSheet(existingSheet);

        const model = {
            type: ElemTypes.sheetcollection,
            content: undefined
        }

        const list = collection.validateCollectionLevelModelIndividual(model);
        expect(list.length).toBe(0);
    });

    it('merge-content validation: should reject a model with non-object content', () => {
        const existingSheet = new GNericSheetModel('char-x', 'Anonymous');
        collection.addSheet(existingSheet);

        const model = {
            type: ElemTypes.sheetcollection,
            content: "rated M"
        }

        const list = collection.validateCollectionLevelModelIndividual(model);
        expect(list.length).toBe(0);
    });

    it('merge-content validation: should reject a model with non-array content', () => {
        const existingSheet = new GNericSheetModel('char-x', 'Anonymous');
        collection.addSheet(existingSheet);

        const model = {
            type: ElemTypes.sheetcollection,
            content: {
                hero1: {
                    name: "Sam",
                    id: "char-0"
                },
                hero2: {
                    name: "Alex",
                    id: "char-1"
                }
            }
        }


        const list = collection.validateCollectionLevelModelIndividual(model);
        expect(list.length).toBe(0);
    });

    it('merge-content validation: should accept a model with empty content', () => {
        const existingSheet = new GNericSheetModel('char-x', 'Anonymous');
        collection.addSheet(existingSheet);

        const model = {
            type: ElemTypes.sheetcollection,
            content: []
        }

        const list = collection.validateCollectionLevelModelIndividual(model);
        expect(list.length).toBe(0);
    });

    // ..... sheet problems .....

    it('merge-content validation: should reject a model where a sheet is falsy', () => {
        const existingSheet = new GNericSheetModel('char-x', 'Anonymous');
        collection.addSheet(existingSheet);

        const model = {
            type: ElemTypes.sheetcollection,
            content: [
                new GNericSheetModel('char-0', 'Sam').getModel(),
                undefined
            ]
        }

        const list = collection.validateCollectionLevelModelIndividual(model);
        expect(list.length).toBe(1);
        expect(list[0].name).toBe('Sam');
    });

    it('merge-content validation: should reject a model where a sheet is not an object', () => {
        const existingSheet = new GNericSheetModel('char-x', 'Anonymous');
        collection.addSheet(existingSheet);

        const model = {
            type: ElemTypes.sheetcollection,
            content: [
                new GNericSheetModel('char-0', 'Sam').getModel(),
                "Ooops"
            ]
        }

        const list = collection.validateCollectionLevelModelIndividual(model);
        expect(list.length).toBe(1);
        expect(list[0].name).toBe('Sam');
    });

    it('merge-content validation: should reject a model where a sheet is an array', () => {
        const existingSheet = new GNericSheetModel('char-x', 'Anonymous');
        collection.addSheet(existingSheet);

        const model = {
            type: ElemTypes.sheetcollection,
            content: [
                new GNericSheetModel('char-0', 'Sam').getModel(),
                [1,2,3]
            ]
        }

        const list = collection.validateCollectionLevelModelIndividual(model);
        expect(list.length).toBe(1);
        expect(list[0].name).toBe('Sam');
    });

    it('merge-content validation: should reject a model where a sheet lacks the id', () => {
        const existingSheet = new GNericSheetModel('char-x', 'Anonymous');
        collection.addSheet(existingSheet);

        const model = {
            type: ElemTypes.sheetcollection,
            content: [
                new GNericSheetModel('char-0', 'Sam').getModel(),
                {type: ElemTypes.sheet, name: "Alex", content: []}
            ]
        }

        const list = collection.validateCollectionLevelModelIndividual(model);
        expect(list.length).toBe(1);
        expect(list[0].name).toBe('Sam');
    });

    it('merge-content validation: should reject a model where two distinct sheets have the same id', () => {
        const existingSheet = new GNericSheetModel('char-x', 'Anonymous');
        collection.addSheet(existingSheet);

        const model = {
            type: ElemTypes.sheetcollection,
            content: [
                new GNericSheetModel('char-0', 'Sam').getModel(),
                new GNericSheetModel('char-0', 'Alex').getModel(),
            ]
        }

        const list = collection.validateCollectionLevelModelIndividual(model);
        expect(list.length).toBe(1);
        expect(list[0].name).toBe('Sam');
    });

    it('merge-content validation: should reject a model where a sheet has an existing id', () => {
        const existingSheet = new GNericSheetModel('char-x', 'Anonymous');
        collection.addSheet(existingSheet);

        const model = {
            type: ElemTypes.sheetcollection,
            content: [
                new GNericSheetModel('char-0', 'Sam').getModel(),
                new GNericSheetModel('char-x', 'Alex').getModel(),
            ]
        }

        const list = collection.validateCollectionLevelModelIndividual(model);
        expect(list.length).toBe(1);
        expect(list[0].name).toBe('Sam');
    });

});