import { ActionTypes } from "../ActionTypes";
import { ElemTypes } from "../elemtypes";
import { ItemListModel } from "../itemlist/itemlistmodel";
import { GNericCompChapterModel } from "./compchaptermodel";

describe( 'GNericCompCHapterModel', () => {
    let chapter: GNericCompChapterModel;
    const id: string = 'model123';
    const chapterName: string = 'awesometitle';

    beforeEach(async () => {
        chapter = new GNericCompChapterModel(id, chapterName);
    });

    // _______________ base model validation _______________

    it('base validation: should accept a proper model', () => {
        const model = {
            id: id,
            type: ElemTypes.compchapter,
            action: ActionTypes.compchapterupdate,
            name: chapterName,
            lists: [
                new ItemListModel('list0', 'List A').getModel(),
                new ItemListModel('list1', 'List B').getModel()
            ]
        }
        expect(chapter.validateBaseModel(model)).toBeTrue();
    });
    
    it('base validation: should reject a model that is null', () => {
        const model = null;
        expect(chapter.validateBaseModel(model)).toBeFalse();
    });
    
    it('base validation: should reject a model that is undfined', () => {
        const model = undefined
        expect(chapter.validateBaseModel(model)).toBeFalse();
    });
    
    it('base validation: should reject a model that is not an object', () => {
        const model = 'A string is a number';
        expect(chapter.validateBaseModel(model)).toBeFalse();
    });
    
    it('base validation: should reject a model that is an array', () => {
        const model = [1, 2, 3];
        expect(chapter.validateBaseModel(model)).toBeFalse();
    });
    
    // ..... id problems .....

    it('base validation: should reject a model without id', () => {
        const model = {
            type: ElemTypes.compchapter,
            action: ActionTypes.compchapterupdate,
            name: chapterName,
            lists: [
                new ItemListModel('list0', 'List A').getModel(),
                new ItemListModel('list1', 'List B').getModel()
            ]
        }
        expect(chapter.validateBaseModel(model)).toBeFalse();
    });

    it('base validation: should reject a model with falsy id', () => {
        const model = {
            id: undefined,
            type: ElemTypes.compchapter,
            action: ActionTypes.compchapterupdate,
            name: chapterName,
            lists: [
                new ItemListModel('list0', 'List A').getModel(),
                new ItemListModel('list1', 'List B').getModel()
            ]
        }
        expect(chapter.validateBaseModel(model)).toBeFalse();
    });

    it('base validation: should reject a model with non-string id', () => {
        const model = {
            id: 7,
            type: ElemTypes.compchapter,
            action: ActionTypes.compchapterupdate,
            name: chapterName,
            lists: [
                new ItemListModel('list0', 'List A').getModel(),
                new ItemListModel('list1', 'List B').getModel()
            ]
        }
        expect(chapter.validateBaseModel(model)).toBeFalse();
    });

    it('base validation: should reject a model with another id', () => {
        const model = {
            id: id+'hello',
            type: ElemTypes.compchapter,
            action: ActionTypes.compchapterupdate,
            name: chapterName,
            lists: [
                new ItemListModel('list0', 'List A').getModel(),
                new ItemListModel('list1', 'List B').getModel()
            ]
        }
        expect(chapter.validateBaseModel(model)).toBeFalse();
    });

    // ..... type problems .....

    it('base validation: should reject a model without type', () => {
        const model = {
            id: id,
            action: ActionTypes.compchapterupdate,
            name: chapterName,
            lists: [
                new ItemListModel('list0', 'List A').getModel(),
                new ItemListModel('list1', 'List B').getModel()
            ]
        }
        expect(chapter.validateBaseModel(model)).toBeFalse();
    });

    it('base validation: should reject a model with falsy type', () => {
        const model = {
            id: id,
            type: undefined,
            action: ActionTypes.compchapterupdate,
            name: chapterName,
            lists: [
                new ItemListModel('list0', 'List A').getModel(),
                new ItemListModel('list1', 'List B').getModel()
            ]
        }
        expect(chapter.validateBaseModel(model)).toBeFalse();
    });

    it('base validation: should reject a model with non-string type', () => {
        const model = {
            id: id,
            type: 2,
            action: ActionTypes.compchapterupdate,
            name: chapterName,
            lists: [
                new ItemListModel('list0', 'List A').getModel(),
                new ItemListModel('list1', 'List B').getModel()
            ]
        }
        expect(chapter.validateBaseModel(model)).toBeFalse();
    });

    it('base validation: should reject a model with another type', () => {
        const model = {
            id: id,
            type: ElemTypes.checkboxes,
            action: ActionTypes.compchapterupdate,
            name: chapterName,
            lists: [
                new ItemListModel('list0', 'List A').getModel(),
                new ItemListModel('list1', 'List B').getModel()
            ]
        }
        expect(chapter.validateBaseModel(model)).toBeFalse();
    });

    // ..... action problems .....

    it('base validation: should reject a model without action', () => {
        const model = {
            id: id,
            type: ElemTypes.compchapter,
            name: chapterName,
            lists: [
                new ItemListModel('list0', 'List A').getModel(),
                new ItemListModel('list1', 'List B').getModel()
            ]
        }
        expect(chapter.validateBaseModel(model)).toBeFalse();
    });

    it('base validation: should reject a model with falsy action', () => {
        const model = {
            id: id,
            type: ElemTypes.compchapter,
            action: undefined,
            name: chapterName,
            lists: [
                new ItemListModel('list0', 'List A').getModel(),
                new ItemListModel('list1', 'List B').getModel()
            ]
        }
        expect(chapter.validateBaseModel(model)).toBeFalse();
    });

    it('base validation: should reject a model with non-string action', () => {
        const model = {
            id: id,
            type: ElemTypes.compchapter,
            action: 6,
            name: chapterName,
            lists: [
                new ItemListModel('list0', 'List A').getModel(),
                new ItemListModel('list1', 'List B').getModel()
            ]
        }
        expect(chapter.validateBaseModel(model)).toBeFalse();
    });

    it('base validation: should reject a model with empty action', () => {
        const model = {
            id: id,
            type: ElemTypes.compchapter,
            action: '',
            name: chapterName,
            lists: [
                new ItemListModel('list0', 'List A').getModel(),
                new ItemListModel('list1', 'List B').getModel()
            ]
        }
        expect(chapter.validateBaseModel(model)).toBeFalse();
    });

    // _______________ chapter update model validation _______________

    it('update validaton: should accept a proper model', () => {
        const model = {
            id: id,
            type: ElemTypes.compchapter,
            action: ActionTypes.compchapterupdate,
            name: chapterName,
            lists: [
                new ItemListModel('list0', 'List A').getModel(),
                new ItemListModel('list1', 'List B').getModel()
            ]
        }
        expect(chapter.validateChapterLevelModel(model)).toBeTrue();
    });

    // ..... name problems .....

    it('update validaton: should reject a model without name', () => {
        const model = {
            id: id,
            type: ElemTypes.compchapter,
            action: ActionTypes.compchapterupdate,
            lists: [
                new ItemListModel('list0', 'List A').getModel(),
                new ItemListModel('list1', 'List B').getModel()
            ]
        }
        expect(chapter.validateChapterLevelModel(model)).toBeFalse();
    });

    it('update validaton: should reject a model with falsy name', () => {
        const model = {
            id: id,
            type: ElemTypes.compchapter,
            action: ActionTypes.compchapterupdate,
            name: undefined,
            lists: [
                new ItemListModel('list0', 'List A').getModel(),
                new ItemListModel('list1', 'List B').getModel()
            ]
        }
        expect(chapter.validateChapterLevelModel(model)).toBeFalse();
    });

    it('update validaton: should reject a model with non-string name', () => {
        const model = {
            id: id,
            type: ElemTypes.compchapter,
            action: ActionTypes.compchapterupdate,
            name: 4,
            lists: [
                new ItemListModel('list0', 'List A').getModel(),
                new ItemListModel('list1', 'List B').getModel()
            ]
        }
        expect(chapter.validateChapterLevelModel(model)).toBeFalse();
    });

    it('update validaton: should accept a model with empty name', () => {
        const model = {
            id: id,
            type: ElemTypes.compchapter,
            action: ActionTypes.compchapterupdate,
            name: '',
            lists: [
                new ItemListModel('list0', 'List A').getModel(),
                new ItemListModel('list1', 'List B').getModel()
            ]
        }
        expect(chapter.validateChapterLevelModel(model)).toBeTrue();
    });

    // ..... lists problems .....

    it('update validaton: should reject a model without content', () => {
        const model = {
            id: id,
            type: ElemTypes.compchapter,
            action: ActionTypes.compchapterupdate,
            name: chapterName
        }
        expect(chapter.validateChapterLevelModel(model)).toBeFalse();
    });

    it('update validaton: should reject a model with falsy content', () => {
        const model = {
            id: id,
            type: ElemTypes.compchapter,
            action: ActionTypes.compchapterupdate,
            name: chapterName,
            lists: undefined
        }
        expect(chapter.validateChapterLevelModel(model)).toBeFalse();
    });

    it('update validaton: should reject a model with non-object content', () => {
        const model = {
            id: id,
            type: ElemTypes.compchapter,
            action: ActionTypes.compchapterupdate,
            name: chapterName,
            lists: 5
        }
        expect(chapter.validateChapterLevelModel(model)).toBeFalse();
    });

    it('update validaton: should reject a model with non-array content', () => {
        const model = {
            id: id,
            type: ElemTypes.compchapter,
            action: ActionTypes.compchapterupdate,
            name: chapterName,
            lists: {list1: 'A', list2: 'B'}
        }
        expect(chapter.validateChapterLevelModel(model)).toBeFalse();
    });

    it('update validaton: should accept a model with empty content', () => {
        const model = {
            id: id,
            type: ElemTypes.compchapter,
            action: ActionTypes.compchapterupdate,
            name: chapterName,
            lists: []
        }
        expect(chapter.validateChapterLevelModel(model)).toBeTrue();
    });

    // ..... page problems .....

    it('update validaton: should reject a model where a list is falsy', () => {
        const model = {
            id: id,
            type: ElemTypes.compchapter,
            action: ActionTypes.compchapterupdate,
            name: chapterName,
            lists: [
                new ItemListModel('list0', 'List A').getModel(),
                undefined
            ]
        }
        expect(chapter.validateChapterLevelModel(model)).toBeFalse();
    });

    it('update validaton: should reject a model where a list is not an object', () => {
        const model = {
            id: id,
            type: ElemTypes.compchapter,
            action: ActionTypes.compchapterupdate,
            name: chapterName,
            lists: [
                new ItemListModel('list0', 'List A').getModel(),
                'list: -1, -2, -3'
            ]
        }
        expect(chapter.validateChapterLevelModel(model)).toBeFalse();
    });

    it('update validaton: should reject a model where a list is an array', () => {
        const model = {
            id: id,
            type: ElemTypes.compchapter,
            action: ActionTypes.compchapterupdate,
            name: chapterName,
            lists: [
                new ItemListModel('list0', 'List A').getModel(),
                [1, 2, 3]
            ]
        }
        expect(chapter.validateChapterLevelModel(model)).toBeFalse();
    });

    it('update validaton: should reject a model where a list lacks the id', () => {
        const model = {
            id: id,
            type: ElemTypes.compchapter,
            action: ActionTypes.compchapterupdate,
            name: chapterName,
            lists: [
                new ItemListModel('list0', 'List A').getModel(),
                {type: ElemTypes.itemlist, content: []}
            ]
        }
        expect(chapter.validateChapterLevelModel(model)).toBeFalse();
    });

    it('update validaton: should reject a model where two distinct lists have the same id', () => {
        const model = {
            id: id,
            type: ElemTypes.compchapter,
            action: ActionTypes.compchapterupdate,
            name: chapterName,
            lists: [
                new ItemListModel('list0', 'List A').getModel(),
                new ItemListModel('list0', 'List B').getModel()
            ]
        }
        expect(chapter.validateChapterLevelModel(model)).toBeFalse();
    });

    // _______________ chapter patch model validation _______________

    it('patch validaton: should accept a proper model', () => {
        const model = {
            id: id,
            type: ElemTypes.compchapter,
            action: ActionTypes.compchapterupdate,
            name: chapterName,
            lists: [
                new ItemListModel('list0', 'List A').getModel(),
                new ItemListModel('list1', 'List B').getModel()
            ]
        }
        expect(chapter.validateChapterLevelModel(model)).toBeTrue();
    });

    // ..... name problems .....

    it('patch validaton: should reject a model without name', () => {
        const model = {
            id: id,
            type: ElemTypes.compchapter,
            action: ActionTypes.compchapterupdate,
            lists: [
                new ItemListModel('list0', 'List A').getModel(),
                new ItemListModel('list1', 'List B').getModel()
            ]
        }
        expect(chapter.validateChapterLevelModel(model)).toBeFalse();
    });

    it('patch validaton: should reject a model with falsy name', () => {
        const model = {
            id: id,
            type: ElemTypes.compchapter,
            action: ActionTypes.compchapterupdate,
            name: undefined,
            lists: [
                new ItemListModel('list0', 'List A').getModel(),
                new ItemListModel('list1', 'List B').getModel()
            ]
        }
        expect(chapter.validateChapterLevelModel(model)).toBeFalse();
    });

    it('patch validaton: should reject a model with non-string name', () => {
        const model = {
            id: id,
            type: ElemTypes.compchapter,
            action: ActionTypes.compchapterupdate,
            name: 4,
            lists: [
                new ItemListModel('list0', 'List A').getModel(),
                new ItemListModel('list1', 'List B').getModel()
            ]
        }
        expect(chapter.validateChapterLevelModel(model)).toBeFalse();
    });

    it('patch validaton: should accept a model with empty name', () => {
        const model = {
            id: id,
            type: ElemTypes.compchapter,
            action: ActionTypes.compchapterupdate,
            name: '',
            lists: [
                new ItemListModel('list0', 'List A').getModel(),
                new ItemListModel('list1', 'List B').getModel()
            ]
        }
        expect(chapter.validateChapterLevelModel(model)).toBeTrue();
    });

});