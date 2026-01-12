import { ElemTypes } from "../elemtypes";
import { ItemListModel } from "./itemlistmodel";
import { GNericItemModel } from "./itemmodel";

describe( 'ItemListModel', () => {
    let model: ItemListModel;
    const name: string = 'itemmodel123';
    const title: string = 'awesometitle';

    beforeEach(async () => {
        model = new ItemListModel(name, title);
    });
    
    // _______________ is for me _______________
    
    it('Should accept properly addressed model', () => {
        const json = {
            id: name,
            listname: title,
            type: ElemTypes.itemlist,
            items: [
                new GNericItemModel('item1', 'name1', 'text1').getModel(),
                new GNericItemModel('item2', 'name2', 'text2').getModel()
            ]
        };
        expect(model.validateListModel(json)).toBeTrue();
    });

    it('Should reject a model with wrong id', () => {
        const json = {
            id: name+'nope',
            listname: title,
            type: ElemTypes.itemlist,
            items: [
                new GNericItemModel('item1', 'name1', 'text1').getModel(),
                new GNericItemModel('item2', 'name2', 'text2').getModel()
            ]
        };
        expect(model.validateListModel(json)).toBeFalse();
    });
    
    it('Should reject a model with missing id', () => {
        const json = {
            listname: title,
            type: ElemTypes.itemlist,
            items: [
                new GNericItemModel('item1', 'name1', 'text1').getModel(),
                new GNericItemModel('item2', 'name2', 'text2').getModel()
            ]
        };
        expect(model.validateListModel(json)).toBeFalse();
    });

    it('Should reject a model with falsy id', () => {
        const json = {
            id: undefined,
            listname: title,
            type: ElemTypes.itemlist,
            items: [
                new GNericItemModel('item1', 'name1', 'text1').getModel(),
                new GNericItemModel('item2', 'name2', 'text2').getModel()
            ]
        };
        expect(model.validateListModel(json)).toBeFalse();
    });

    it('Should reject a model with id of wrong type', () => {
        const json = {
            id: 3,
            listname: title,
            type: ElemTypes.itemlist,
            items: [
                new GNericItemModel('item1', 'name1', 'text1').getModel(),
                new GNericItemModel('item2', 'name2', 'text2').getModel()
            ]
        };
        expect(model.validateListModel(json)).toBeFalse();
    });

    it('Should reject a model with wrong type', () => {
        const json = {
            id: name,
            listname: title,
            type: ElemTypes.table,
            items: [
                new GNericItemModel('item1', 'name1', 'text1').getModel(),
                new GNericItemModel('item2', 'name2', 'text2').getModel()
            ]
        };
        expect(model.validateListModel(json)).toBeFalse();
    });

    it('Should reject a model with falsy type', () => {
        const json = {
            id: name,
            listname: title,
            type: undefined,
            items: [
                new GNericItemModel('item1', 'name1', 'text1').getModel(),
                new GNericItemModel('item2', 'name2', 'text2').getModel()
            ]
        };
        expect(model.validateListModel(json)).toBeFalse();
    });

    it('Should reject a model with missing type', () => {
        const json = {
            id: name,
            listname: title,
            items: [
                new GNericItemModel('item1', 'name1', 'text1').getModel(),
                new GNericItemModel('item2', 'name2', 'text2').getModel()
            ]
        };
        expect(model.validateListModel(json)).toBeFalse();
    });

    it('Should reject a model with type of wrong type', () => {
        const json = {
            id: name,
            listname: title,
            type: 3,
            items: [
                new GNericItemModel('item1', 'name1', 'text1').getModel(),
                new GNericItemModel('item2', 'name2', 'text2').getModel()
            ]
        };
        expect(model.validateListModel(json)).toBeFalse();
    });

    
    // _______________ listname problems _______________

    it('listname: should reject a model without listname', () => {
        const json = {
            id: name,
            type: ElemTypes.itemlist,
            items: [
                new GNericItemModel('item1', 'name1', 'text1').getModel(),
                new GNericItemModel('item2', 'name2', 'text2').getModel()
            ]
        };
        expect(model.validateListModel(json)).toBeFalse();
    });
    
    it('listname: should reject a model with falsy listname', () => {
        const json = {
            id: name,
            listname: undefined,
            type: ElemTypes.itemlist,
            items: [
                new GNericItemModel('item1', 'name1', 'text1').getModel(),
                new GNericItemModel('item2', 'name2', 'text2').getModel()
            ]
        };
        expect(model.validateListModel(json)).toBeFalse();
    });
    
    it('listname: should reject a model with listname of wrong type', () => {
        const json = {
            id: name,
            listname: 3,
            type: ElemTypes.itemlist,
            items: [
                new GNericItemModel('item1', 'name1', 'text1').getModel(),
                new GNericItemModel('item2', 'name2', 'text2').getModel()
            ]
        };
        expect(model.validateListModel(json)).toBeFalse();
    });
    
    it('listname: should accept a model with empty listname', () => {
        const json = {
            id: name,
            listname: '',
            type: ElemTypes.itemlist,
            items: [
                new GNericItemModel('item1', 'name1', 'text1').getModel(),
                new GNericItemModel('item2', 'name2', 'text2').getModel()
            ]
        };
        expect(model.validateListModel(json)).toBeTrue();
    });
    
    // _______________ items array problems _______________

    it('listname: should reject a model without items array', () => {
        const json = {
            id: name,
            listname: title,
            type: ElemTypes.itemlist
        };
        expect(model.validateListModel(json)).toBeFalse();
    });

    it('listname: should reject a model with falsy items array', () => {
        const json = {
            id: name,
            listname: title,
            type: ElemTypes.itemlist,
            items: undefined
        };
        expect(model.validateListModel(json)).toBeFalse();
    });

    it('listname: should reject a model with items array of wrong type', () => {
        const json = {
            id: name,
            listname: title,
            type: ElemTypes.itemlist,
            items: 3
        };
        expect(model.validateListModel(json)).toBeFalse();
    });

    it('listname: should reject a model with items array not an array', () => {
        const json = {
            id: name,
            listname: title,
            type: ElemTypes.itemlist,
            items: {
                item1: new GNericItemModel('item1', 'name1', 'text1').getModel(),
                item2: new GNericItemModel('item2', 'name2', 'text2').getModel()
            }
        };
        expect(model.validateListModel(json)).toBeFalse();
    });

    // _______________ item entry problems _______________

    it('item list: should reject an invalid entry model', () => {
        const json = {
            id: name,
            listname: title,
            type: ElemTypes.itemlist,
            items: [
                new GNericItemModel('item1', 'name1', 'text1').getModel(),
                {a: 1, b: '2'}
            ]
        };
        expect(model.validateListModel(json)).toBeFalse();
    });

    it('item list: should reject a model with duplicate ids of entries', () => {
        const json = {
            id: name,
            listname: title,
            type: ElemTypes.itemlist,
            items: [
                new GNericItemModel('item1', 'name1', 'text1').getModel(),
                new GNericItemModel('item1', 'name1', 'text2').getModel(),
            ]
        };
        expect(model.validateListModel(json)).toBeFalse();
    });

    // _______________ entry ok _______________

    it('item entries: should accept a proper model', () => {
        const json = {
            id: 'id123',
            name: name,
            type: ElemTypes.itementry,
            text: 'some cute text here'
        };
        expect(model.validateEntryModel(json)).toBeTrue();
    });


    // _______________ entry: id problems _______________

    it('item entries: should reject a model without id', () => {
        const json = {
            name: name,
            type: ElemTypes.itementry,
            text: 'some cute text here'
        };
        expect(model.validateListModel(json)).toBeFalse();
    });

    it('item entries: should reject a model with falsy id', () => {
        const json = {
            id: undefined,
            name: name,
            type: ElemTypes.itementry,
            text: 'some cute text here'
        };
        expect(model.validateListModel(json)).toBeFalse();
    });

    it('item entries: should reject a model with empty id', () => {
        const json = {
            id: '',
            name: name,
            type: ElemTypes.itementry,
            text: 'some cute text here'
        };
        expect(model.validateListModel(json)).toBeFalse();
    });

    it('item entries: should reject a model with id of wrong type', () => {
        const json = {
            id: 3,
            name: name,
            type: ElemTypes.itementry,
            text: 'some cute text here'
        };
        expect(model.validateListModel(json)).toBeFalse();
    });

    // _______________ entry: type problems _______________

    it('item entries: should reject a model withou type', () => {
        const json = {
            id: 'id123',
            name: name,
            text: 'some cute text here'
        };
        expect(model.validateEntryModel(json)).toBeFalse();
    });

    it('item entries: should reject a model with falsy type', () => {
        const json = {
            id: 'id123',
            name: name,
            type: undefined,
            text: 'some cute text here'
        };
        expect(model.validateEntryModel(json)).toBeFalse();
    });

    it('item entries: should reject a model with the wrong type', () => {
        const json = {
            id: 'id123',
            name: name,
            type: ElemTypes.table,
            text: 'some cute text here'
        };
        expect(model.validateEntryModel(json)).toBeFalse();
    });

    it('item entries: should reject a model with type of the wrong type', () => {
        const json = {
            id: 'id123',
            name: name,
            type: 3,
            text: 'some cute text here'
        };
        expect(model.validateEntryModel(json)).toBeFalse();
    });

    // _______________ entry: name problems _______________

    it('item entries: should reject a model without name', () => {
        const json = {
            id: 'id123',
            type: ElemTypes.itementry,
            text: 'some cute text here'
        };
        expect(model.validateEntryModel(json)).toBeFalse();
    });

    it('item entries: should reject a model with falsy name', () => {
        const json = {
            id: 'id123',
            name: undefined,
            type: ElemTypes.itementry,
            text: 'some cute text here'
        };
        expect(model.validateEntryModel(json)).toBeFalse();
    });

    it('item entries: should reject a model with name of wrong type', () => {
        const json = {
            id: 'id123',
            name: 3,
            type: ElemTypes.itementry,
            text: 'some cute text here'
        };
        expect(model.validateEntryModel(json)).toBeFalse();
    });

    it('item entries: should accept a model with empty name', () => {
        const json = {
            id: 'id123',
            name: '',
            type: ElemTypes.itementry,
            text: 'some cute text here'
        };
        expect(model.validateEntryModel(json)).toBeTrue();
    });

    // _______________ entries: text problems _______________

    it('item entries: should reject a model without text', () => {
        const json = {
            id: 'id123',
            name: name,
            type: ElemTypes.itementry,
        };
        expect(model.validateEntryModel(json)).toBeFalse();
    });

    it('item entries: should reject a model with falsy text', () => {
        const json = {
            id: 'id123',
            name: name,
            type: ElemTypes.itementry,
            text: undefined
        };
        expect(model.validateEntryModel(json)).toBeFalse();
    });

    it('item entries: should reject a model with text of wrog type', () => {
        const json = {
            id: 'id123',
            name: name,
            type: ElemTypes.itementry,
            text: 3
        };
        expect(model.validateEntryModel(json)).toBeFalse();
    });

    it('item entries: should accept a model with empty text', () => {
        const json = {
            id: 'id123',
            name: name,
            type: ElemTypes.itementry,
            text: ''
        };
        expect(model.validateEntryModel(json)).toBeTrue();
    });

});