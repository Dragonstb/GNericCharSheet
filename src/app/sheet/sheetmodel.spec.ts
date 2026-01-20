import { ActionTypes } from "../ActionTypes";
import { ElemTypes } from "../elemtypes";
import { GNericPageModel } from "../sheetpage/pagemodel";
import { GNericSheetModel } from "./sheetmodel";

describe( 'GNericSheetModel', () => {
    let sheet: GNericSheetModel;
    const id: string = 'model123';
    const charname: string = 'awesometitle';

    beforeEach(async () => {
        sheet = new GNericSheetModel(id, charname);
    });

    // _______________ base model validation _______________

    it('base validation: should accept a proper model', () => {
        const model = {
            id: id,
            type: ElemTypes.sheet,
            action: ActionTypes.sheetupdate
        }
        expect(sheet.validateBaseModel(model)).toBeTrue();
    });
    
    it('base validation: should reject a model that is null', () => {
        const model = null;
        expect(sheet.validateBaseModel(model)).toBeFalse();
    });
    
    it('base validation: should reject a model that is undfined', () => {
        const model = undefined
        expect(sheet.validateBaseModel(model)).toBeFalse();
    });
    
    it('base validation: should reject a model that is not an object', () => {
        const model = 'A string is a number';
        expect(sheet.validateBaseModel(model)).toBeFalse();
    });
    
    it('base validation: should reject a model that is an array', () => {
        const model = [1, 2, 3];
        expect(sheet.validateBaseModel(model)).toBeFalse();
    });
    
    // ..... id problems .....

    it('base validation: should reject a model without id', () => {
        const model = {
            type: ElemTypes.sheet,
            action: ActionTypes.sheetupdate
        }
        expect(sheet.validateBaseModel(model)).toBeFalse();
    });

    it('base validation: should reject a model with falsy id', () => {
        const model = {
            id: undefined,
            type: ElemTypes.sheet,
            action: ActionTypes.sheetupdate
        }
        expect(sheet.validateBaseModel(model)).toBeFalse();
    });

    it('base validation: should reject a model with non-string id', () => {
        const model = {
            id: 5,
            type: ElemTypes.sheet,
            action: ActionTypes.sheetupdate
        }
        expect(sheet.validateBaseModel(model)).toBeFalse();
    });

    it('base validation: should reject a model with another id', () => {
        const model = {
            id: id+'hello',
            type: ElemTypes.sheet,
            action: ActionTypes.sheetupdate
        }
        expect(sheet.validateBaseModel(model)).toBeFalse();
    });

    // ..... type problems .....

    it('base validation: should reject a model without type', () => {
        const model = {
            id: id,
            action: ActionTypes.sheetupdate
        }
        expect(sheet.validateBaseModel(model)).toBeFalse();
    });

    it('base validation: should reject a model with falsy type', () => {
        const model = {
            id: id,
            type: false,
            action: ActionTypes.sheetupdate
        }
        expect(sheet.validateBaseModel(model)).toBeFalse();
    });

    it('base validation: should reject a model with non-string type', () => {
        const model = {
            id: id,
            type: 2,
            action: ActionTypes.sheetupdate
        }
        expect(sheet.validateBaseModel(model)).toBeFalse();
    });

    it('base validation: should reject a model with another type', () => {
        const model = {
            id: id,
            type: ElemTypes.block,
            action: ActionTypes.sheetupdate
        }
        expect(sheet.validateBaseModel(model)).toBeFalse();
    });

    // ..... action problems .....

    it('base validation: should reject a model without action', () => {
        const model = {
            id: id,
            type: ElemTypes.sheet,
        }
        expect(sheet.validateBaseModel(model)).toBeFalse();
    });

    it('base validation: should reject a model with falsy action', () => {
        const model = {
            id: id,
            type: ElemTypes.sheet,
            action: undefined
        }
        expect(sheet.validateBaseModel(model)).toBeFalse();
    });

    it('base validation: should reject a model with non-string action', () => {
        const model = {
            id: id,
            type: ElemTypes.sheet,
            action: 5
        }
        expect(sheet.validateBaseModel(model)).toBeFalse();
    });

    it('base validation: should reject a model with empty action', () => {
        const model = {
            id: id,
            type: ElemTypes.sheet,
            action: ''
        }
        expect(sheet.validateBaseModel(model)).toBeFalse();
    });

    // _______________ sheet model validation _______________

    it('sheet validation: should accept a proper model', () => {
        const model = {
            id: id,
            name: charname,
            type: ElemTypes.sheet,
            content: [
                new GNericPageModel('id1', 'page1').getModel(),
                new GNericPageModel('id2', 'page2').getModel()
            ]
        }
        expect(sheet.validateSheetModelLevel(model)).toBeTrue();
    });

    // ..... name problems .....

    it('sheet validation: should reject a model without name', () => {
        const model = {
            id: id,
            type: ElemTypes.sheet,
            content: [
                new GNericPageModel('id1', 'page1').getModel(),
                new GNericPageModel('id2', 'page2').getModel()
            ]
        }
        expect(sheet.validateSheetModelLevel(model)).toBeFalse();
    });

    it('sheet validation: should reject a model with falsy name', () => {
        const model = {
            id: id,
            name: undefined,
            type: ElemTypes.sheet,
            content: [
                new GNericPageModel('id1', 'page1').getModel(),
                new GNericPageModel('id2', 'page2').getModel()
            ]
        }
        expect(sheet.validateSheetModelLevel(model)).toBeFalse();
    });

    it('sheet validation: should reject a model with non-string name', () => {
        const model = {
            id: id,
            name: 1337,
            type: ElemTypes.sheet,
            content: [
                new GNericPageModel('id1', 'page1').getModel(),
                new GNericPageModel('id2', 'page2').getModel()
            ]
        }
        expect(sheet.validateSheetModelLevel(model)).toBeFalse();
    });

    it('sheet validation: should accept a model with empty name', () => {
        const model = {
            id: id,
            name: '',
            type: ElemTypes.sheet,
            content: [
                new GNericPageModel('id1', 'page1').getModel(),
                new GNericPageModel('id2', 'page2').getModel()
            ]
        }
        expect(sheet.validateSheetModelLevel(model)).toBeTrue();
    });

    // ..... content problems .....

    it('sheet validation: should reject a model without content', () => {
        const model = {
            id: id,
            name: charname,
            type: ElemTypes.sheet
        }
        expect(sheet.validateSheetModelLevel(model)).toBeFalse();
    });

    it('sheet validation: should reject a model with falsy content', () => {
        const model = {
            id: id,
            name: charname,
            type: ElemTypes.sheet,
            content: undefined
        }
        expect(sheet.validateSheetModelLevel(model)).toBeFalse();
    });

    it('sheet validation: should reject a model with non-object content', () => {
        const model = {
            id: id,
            name: charname,
            type: ElemTypes.sheet,
            content: 'a lot'
        }
        expect(sheet.validateSheetModelLevel(model)).toBeFalse();
    });

    it('sheet validation: should reject a model with non-array content', () => {
        const model = {
            id: id,
            name: charname,
            type: ElemTypes.sheet,
            content: {page1: 'introduction', page2: 'Bibliography'}
        }
        expect(sheet.validateSheetModelLevel(model)).toBeFalse();
    });

    it('sheet validation: should accept a model with empty content', () => {
        const model = {
            id: id,
            name: charname,
            type: ElemTypes.sheet,
            content: []
        }
        expect(sheet.validateSheetModelLevel(model)).toBeTrue();
    });

    // ..... page problems .....

    it('sheet validation: should reject a model where a page is falsy', () => {
        const model = {
            id: id,
            name: charname,
            type: ElemTypes.sheet,
            content: [
                new GNericPageModel('id1', 'page1').getModel(),
                undefined
            ]
        }
        expect(sheet.validateSheetModelLevel(model)).toBeFalse();
    });

    it('sheet validation: should reject a model where a page is not an object', () => {
        const model = {
            id: id,
            name: charname,
            type: ElemTypes.sheet,
            content: [
                new GNericPageModel('id1', 'page1').getModel(),
                'This page is not an object'
            ]
        }
        expect(sheet.validateSheetModelLevel(model)).toBeFalse();
    });

    it('sheet validation: should reject a model where a page i an array', () => {
        const model = {
            id: id,
            name: charname,
            type: ElemTypes.sheet,
            content: [
                new GNericPageModel('id1', 'page1').getModel(),
                [1,2,3]
            ]
        }
        expect(sheet.validateSheetModelLevel(model)).toBeFalse();
    });

    it('sheet validation: should reject a model where a page lacks the id', () => {
        const model = {
            id: id,
            name: charname,
            type: ElemTypes.sheet,
            content: [
                new GNericPageModel('id1', 'page1').getModel(),
                {type: ElemTypes.page, title: 'page2'}
            ]
        }
        expect(sheet.validateSheetModelLevel(model)).toBeFalse();
    });

    it('sheet validation: should reject a model where two distinct pages have the same id', () => {
        const model = {
            id: id,
            name: charname,
            type: ElemTypes.sheet,
            content: [
                new GNericPageModel('id1', 'page1').getModel(),
                new GNericPageModel('id1', 'page2').getModel()
            ]
        }
        expect(sheet.validateSheetModelLevel(model)).toBeFalse();
    });

});