import { ActionTypes } from "../ActionTypes";
import { GNericCompChapterModel } from "../compchapter/compchaptermodel";
import { ElemTypes } from "../elemtypes";
import { ItemListModel } from "../itemlist/itemlistmodel";
import { GNericCompendiumModel } from "./compendiummodel";

describe( 'GNericCompendiumModel', () => {
    let compendium: GNericCompendiumModel;
    const id: string = 'model123';

    beforeEach(async () => {
        compendium = new GNericCompendiumModel();
    });

    // _______________ base model validation _______________

    it('base validation: should accept a proper model', () => {
        const model = {
            type: ElemTypes.compendium,
            action: ActionTypes.compendiumupdate,
            chapters: [
                new GNericCompChapterModel('chapter0', 'Chapter A').getModel(),
                new GNericCompChapterModel('chapter1', 'Chapter B').getModel()
            ]
        }
        expect(compendium.validateBaseModel(model)).toBeTrue();
    });
    
    it('base validation: should reject a model that is null', () => {
        const model = null;
        expect(compendium.validateBaseModel(model)).toBeFalse();
    });
    
    it('base validation: should reject a model that is undfined', () => {
        const model = undefined
        expect(compendium.validateBaseModel(model)).toBeFalse();
    });
    
    it('base validation: should reject a model that is not an object', () => {
        const model = 'A string is a number';
        expect(compendium.validateBaseModel(model)).toBeFalse();
    });
    
    it('base validation: should reject a model that is an array', () => {
        const model = [1, 2, 3];
        expect(compendium.validateBaseModel(model)).toBeFalse();
    });
    
    // ..... type problems .....

    it('base validation: should reject a model without type', () => {
        const model = {
            action: ActionTypes.compendiumupdate,
            chapters: [
                new GNericCompChapterModel('chapter0', 'Chapter A').getModel(),
                new GNericCompChapterModel('chapter1', 'Chapter B').getModel()
            ]
        }
        expect(compendium.validateBaseModel(model)).toBeFalse();
    });

    it('base validation: should reject a model with falsy type', () => {
        const model = {
            type: undefined,
            action: ActionTypes.compendiumupdate,
            chapters: [
                new GNericCompChapterModel('chapter0', 'Chapter A').getModel(),
                new GNericCompChapterModel('chapter1', 'Chapter B').getModel()
            ]
        }
        expect(compendium.validateBaseModel(model)).toBeFalse();
    });

    it('base validation: should reject a model with non-string type', () => {
        const model = {
            type: 3,
            action: ActionTypes.compendiumupdate,
            chapters: [
                new GNericCompChapterModel('chapter0', 'Chapter A').getModel(),
                new GNericCompChapterModel('chapter1', 'Chapter B').getModel()
            ]
        }
        expect(compendium.validateBaseModel(model)).toBeFalse();
    });

    it('base validation: should reject a model with another type', () => {
        const model = {
            type: ElemTypes.textfield,
            action: ActionTypes.compendiumupdate,
            chapters: [
                new GNericCompChapterModel('chapter0', 'Chapter A').getModel(),
                new GNericCompChapterModel('chapter1', 'Chapter B').getModel()
            ]
        }
        expect(compendium.validateBaseModel(model)).toBeFalse();
    });

    it('base validation: should reject a model with empty type', () => {
        const model = {
            type: '',
            action: ActionTypes.compendiumupdate,
            chapters: [
                new GNericCompChapterModel('chapter0', 'Chapter A').getModel(),
                new GNericCompChapterModel('chapter1', 'Chapter B').getModel()
            ]
        }
        expect(compendium.validateBaseModel(model)).toBeFalse();
    });

    // ..... action problems .....

    it('base validation: should reject a model without action', () => {
        const model = {
            id: id,
            type: ElemTypes.compchapter,
            lists: [
                new ItemListModel('list0', 'List A').getModel(),
                new ItemListModel('list1', 'List B').getModel()
            ]
        }
        expect(compendium.validateBaseModel(model)).toBeFalse();
    });

    it('base validation: should reject a model with falsy action', () => {
        const model = {
            type: ElemTypes.compendium,
            action: undefined,
            chapters: [
                new GNericCompChapterModel('chapter0', 'Chapter A').getModel(),
                new GNericCompChapterModel('chapter1', 'Chapter B').getModel()
            ]
        }
        expect(compendium.validateBaseModel(model)).toBeFalse();
    });

    it('base validation: should reject a model with non-string action', () => {
        const model = {
            type: ElemTypes.compendium,
            action: 3,
            chapters: [
                new GNericCompChapterModel('chapter0', 'Chapter A').getModel(),
                new GNericCompChapterModel('chapter1', 'Chapter B').getModel()
            ]
        }
        expect(compendium.validateBaseModel(model)).toBeFalse();
    });

    it('base validation: should reject a model with empty action', () => {
        const model = {
            type: ElemTypes.compendium,
            action: '',
            chapters: [
                new GNericCompChapterModel('chapter0', 'Chapter A').getModel(),
                new GNericCompChapterModel('chapter1', 'Chapter B').getModel()
            ]
        }
        expect(compendium.validateBaseModel(model)).toBeFalse();
    });

    // _______________ compendium update model validation _______________

    it('update validaton: should accept a proper model', () => {
        const model = {
            type: ElemTypes.compendium,
            action: ActionTypes.compendiumupdate,
            chapters: [
                new GNericCompChapterModel('chapter0', 'Chapter A').getModel(),
                new GNericCompChapterModel('chapter1', 'Chapter B').getModel()
            ]
        }
        expect(compendium.validateCompendiumLevelModel(model)).toBeTrue();
    });

    // ..... chapter problems .....

    it('update validaton: should reject a model without chapters', () => {
        const model = {
            type: ElemTypes.compendium,
            action: ActionTypes.compendiumupdate
        }
        expect(compendium.validateCompendiumLevelModel(model)).toBeFalse();
    });

    it('update validaton: should reject a model with falsy chapters', () => {
        const model = {
            type: ElemTypes.compendium,
            action: ActionTypes.compendiumupdate,
            chapters: undefined
        }
        expect(compendium.validateCompendiumLevelModel(model)).toBeFalse();
    });

    it('update validaton: should reject a model with non-object lists', () => {
        const model = {
            type: ElemTypes.compendium,
            action: ActionTypes.compendiumupdate,
            chapters: 3
        }
        expect(compendium.validateCompendiumLevelModel(model)).toBeFalse();
    });

    it('update validaton: should reject a model with non-array lists', () => {
        const model = {
            type: ElemTypes.compendium,
            action: ActionTypes.compendiumupdate,
            chapters: {chapter: [{name: 'Hello'}, {name: 'World'}]}
        }
        expect(compendium.validateCompendiumLevelModel(model)).toBeFalse();
    });

    it('update validaton: should accept a model with empty chapters', () => {
        const model = {
            type: ElemTypes.compendium,
            action: ActionTypes.compendiumupdate,
            chapters: []
        }
        expect(compendium.validateCompendiumLevelModel(model)).toBeTrue();
    });

    // ..... chapter entry problems .....

    it('update validaton: should reject a model where a chapter is falsy', () => {
        const model = {
            type: ElemTypes.compendium,
            action: ActionTypes.compendiumupdate,
            chapters: [
                new GNericCompChapterModel('chapter0', 'Chapter A').getModel(),
                undefined
            ]
        }
        expect(compendium.validateCompendiumLevelModel(model)).toBeFalse();
    });

    it('update validaton: should reject a model where a chapter is not an object', () => {
        const model = {
            type: ElemTypes.compendium,
            action: ActionTypes.compendiumupdate,
            chapters: [
                new GNericCompChapterModel('chapter0', 'Chapter A').getModel(),
                'it is not an object!'
            ]
        }
        expect(compendium.validateCompendiumLevelModel(model)).toBeFalse();
    });

    it('update validaton: should reject a model where a chapter is an array', () => {
        const model = {
            type: ElemTypes.compendium,
            action: ActionTypes.compendiumupdate,
            chapters: [
                new GNericCompChapterModel('chapter0', 'Chapter A').getModel(),
                ['it', 'is', 'an', 'array']
            ]
        }
        expect(compendium.validateCompendiumLevelModel(model)).toBeFalse();
    });

    it('update validaton: should reject a model where a chapter lacks the id', () => {
        const model = {
            type: ElemTypes.compendium,
            action: ActionTypes.compendiumupdate,
            chapters: [
                new GNericCompChapterModel('chapter0', 'Chapter A').getModel(),
                {name: 'Nope', type: ElemTypes.compchapter, lists: []}
            ]
        }
        expect(compendium.validateCompendiumLevelModel(model)).toBeFalse();
    });

    it('update validaton: should reject a model where two distinct chapters have the same id', () => {
        const model = {
            type: ElemTypes.compendium,
            action: ActionTypes.compendiumupdate,
            chapters: [
                new GNericCompChapterModel('chapter0', 'Chapter A').getModel(),
                new GNericCompChapterModel('chapter0', 'Chapter B').getModel()
            ]
        }
        expect(compendium.validateCompendiumLevelModel(model)).toBeFalse();
    });

});