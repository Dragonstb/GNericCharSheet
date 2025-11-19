import { ComponentFixture, TestBed } from "@angular/core/testing";
import { GNericItemList } from "./itemlist.component";
import { DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser";
import { ElemTypes } from "../elemtypes";

describe( 'GNericItemList', () => {
    let fixture: ComponentFixture<GNericItemList>;
    let list: GNericItemList;
    let natElem: HTMLElement;
    let dbgElem: DebugElement;
    const id: string = "comp-04-04";
    const fullId = "itemlist-"+id;
    const listname = "Magic items";


    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GNericItemList],
        }).compileComponents();
        
        fixture = TestBed.createComponent( GNericItemList );
        fixture.autoDetectChanges();
        list = fixture.componentInstance;
        natElem = fixture.nativeElement;
        dbgElem = fixture.debugElement;
        // fixture.componentRef.setInput( 'id', id );
        await fixture.whenStable();
    });

    // _______________ create _______________

    it('Should create the list', () => {
        expect( list ).toBeTruthy();
    });

    // _______________ input validation _______________

    it('Should accept a proper model', () => {
        const model = {
            id: id,
            type: ElemTypes.itemlist,
            listname: listname,
            items: [
                {id: 'item1', name: 'name1', text: 'very interesting text 1'},
                {id: 'item2', name: 'name2', text: 'very interesting text 2'},
                {id: 'item3', name: 'name3', text: 'very interesting text 3'},
            ]
        }
        expect(list.validateListModel(model)).toBeTrue();
    });
    
    // ..... id problems .....
    
    it('Should recject a model with missing id', () => {
        const model = {
            type: ElemTypes.itemlist,
            listname: listname,
            items: [
                {id: 'item1', name: 'name1', text: 'very interesting text 1'},
                {id: 'item2', name: 'name2', text: 'very interesting text 2'},
                {id: 'item3', name: 'name3', text: 'very interesting text 3'},
            ]
        }
        expect(list.validateListModel(model)).toBeFalse();
    });

    it('Should recject a model with falsy id', () => {
        const model = {
            id: undefined,
            type: ElemTypes.itemlist,
            listname: listname,
            items: [
                {id: 'item1', name: 'name1', text: 'very interesting text 1'},
                {id: 'item2', name: 'name2', text: 'very interesting text 2'},
                {id: 'item3', name: 'name3', text: 'very interesting text 3'},
            ]
        }
        expect(list.validateListModel(model)).toBeFalse();
    });

    it('Should recject a model with an id of the wrong type', () => {
        const model = {
            id: 4,
            type: ElemTypes.itemlist,
            listname: listname,
            items: [
                {id: 'item1', name: 'name1', text: 'very interesting text 1'},
                {id: 'item2', name: 'name2', text: 'very interesting text 2'},
                {id: 'item3', name: 'name3', text: 'very interesting text 3'},
            ]
        }
        expect(list.validateListModel(model)).toBeFalse();
    });

    // ..... type problems .....

    it('Should recject a model with missing type', () => {
        const model = {
            id: id,
            listname: listname,
            items: [
                {id: 'item1', name: 'name1', text: 'very interesting text 1'},
                {id: 'item2', name: 'name2', text: 'very interesting text 2'},
                {id: 'item3', name: 'name3', text: 'very interesting text 3'},
            ]
        }
        expect(list.validateListModel(model)).toBeFalse();
    });

    it('Should recject a model with falsy type', () => {
        const model = {
            id: id,
            type: undefined,
            listname: listname,
            items: [
                {id: 'item1', name: 'name1', text: 'very interesting text 1'},
                {id: 'item2', name: 'name2', text: 'very interesting text 2'},
                {id: 'item3', name: 'name3', text: 'very interesting text 3'},
            ]
        }
        expect(list.validateListModel(model)).toBeFalse();
    });

    it('Should recject a model with a type of the wrong type', () => {
        const model = {
            id: id,
            type: 7,
            listname: listname,
            items: [
                {id: 'item1', name: 'name1', text: 'very interesting text 1'},
                {id: 'item2', name: 'name2', text: 'very interesting text 2'},
                {id: 'item3', name: 'name3', text: 'very interesting text 3'},
            ]
        }
        expect(list.validateListModel(model)).toBeFalse();
    });

    it('Should recject a model with a type of the wrong value', () => {
        const model = {
            id: id,
            type: ElemTypes.rpm,
            listname: listname,
            items: [
                {id: 'item1', name: 'name1', text: 'very interesting text 1'},
                {id: 'item2', name: 'name2', text: 'very interesting text 2'},
                {id: 'item3', name: 'name3', text: 'very interesting text 3'},
            ]
        }
        expect(list.validateListModel(model)).toBeFalse();
    });

    // ..... listname problems .....

    it('Should recject a model with missing name', () => {
        const model = {
            id: id,
            type: ElemTypes.itemlist,
            items: [
                {id: 'item1', name: 'name1', text: 'very interesting text 1'},
                {id: 'item2', name: 'name2', text: 'very interesting text 2'},
                {id: 'item3', name: 'name3', text: 'very interesting text 3'},
            ]
        }
        expect(list.validateListModel(model)).toBeFalse();
    });

    it('Should recject a model with falsy name', () => {
        const model = {
            id: id,
            type: ElemTypes.itemlist,
            listname: undefined,
            items: [
                {id: 'item1', name: 'name1', text: 'very interesting text 1'},
                {id: 'item2', name: 'name2', text: 'very interesting text 2'},
                {id: 'item3', name: 'name3', text: 'very interesting text 3'},
            ]
        }
        expect(list.validateListModel(model)).toBeFalse();
    });

    it('Should recject a model with name of the wrong type', () => {
        const model = {
            id: id,
            type: ElemTypes.itemlist,
            listname: 4,
            items: [
                {id: 'item1', name: 'name1', text: 'very interesting text 1'},
                {id: 'item2', name: 'name2', text: 'very interesting text 2'},
                {id: 'item3', name: 'name3', text: 'very interesting text 3'},
            ]
        }
        expect(list.validateListModel(model)).toBeFalse();
    });

    it('Should recject a model with empty name', () => {
        const model = {
            id: id,
            type: ElemTypes.itemlist,
            listname: '',
            items: [
                {id: 'item1', name: 'name1', text: 'very interesting text 1'},
                {id: 'item2', name: 'name2', text: 'very interesting text 2'},
                {id: 'item3', name: 'name3', text: 'very interesting text 3'},
            ]
        }
        expect(list.validateListModel(model)).toBeFalse();
    });

    // ..... item array problems .....

    it('Should recject a model with missing item list', () => {
        const model = {
            id: id,
            type: ElemTypes.itemlist,
            listname: listname
        }
        expect(list.validateListModel(model)).toBeFalse();
    });

    it('Should recject a model with falsy item list', () => {
        const model = {
            id: id,
            type: ElemTypes.itemlist,
            listname: listname,
            items: undefined
        }
        expect(list.validateListModel(model)).toBeFalse();
    });

    it('Should recject a model with items being a non-array object', () => {
        const model = {
            id: id,
            type: ElemTypes.itemlist,
            listname: listname,
            items: {id: 'item1', name: 'name1', text: 'very interesting text 1'}
        }
        expect(list.validateListModel(model)).toBeFalse();
    });

    it('Should recject a model with item list not being an object at all', () => {
        const model = {
            id: id,
            type: ElemTypes.itemlist,
            listname: listname,
            items: 4
        }
        expect(list.validateListModel(model)).toBeFalse();
    });

    // ..... item entry problems .....

    it('Should recject a model with falsy entry', () => {
        const model = {
            id: id,
            type: ElemTypes.itemlist,
            listname: listname,
            items: [
                {id: 'item1', name: 'name1', text: 'very interesting text 1'},
                undefined,
                {id: 'item3', name: 'name3', text: 'very interesting text 3'},
            ]
        }
        expect(list.validateListModel(model)).toBeFalse();
    });

    it('Should recject a model with non-object entry', () => {
        const model = {
            id: id,
            type: ElemTypes.itemlist,
            listname: listname,
            items: [
                {id: 'item1', name: 'name1', text: 'very interesting text 1'},
                2,
                {id: 'item3', name: 'name3', text: 'very interesting text 3'},
            ]
        }
        expect(list.validateListModel(model)).toBeFalse();
    });

    it('Should recject a model with missing id', () => {
        const model = {
            id: id,
            type: ElemTypes.itemlist,
            listname: listname,
            items: [
                {id: 'item1', name: 'name1', text: 'very interesting text 1'},
                {name: 'name2', text: 'very interesting text 2'},
                {id: 'item3', name: 'name3', text: 'very interesting text 3'},
            ]
        }
        expect(list.validateListModel(model)).toBeFalse();
    });

    it('Should recject a model with entry with non-string id', () => {
        const model = {
            id: id,
            type: ElemTypes.itemlist,
            listname: listname,
            items: [
                {id: 'item1', name: 'name1', text: 'very interesting text 1'},
                {id: 2, name: 'name2', text: 'very interesting text 2'},
                {id: 'item3', name: 'name3', text: 'very interesting text 3'},
            ]
        }
        expect(list.validateListModel(model)).toBeFalse();
    });

    it('Should recject a model with entry with falsy id', () => {
        const model = {
            id: id,
            type: ElemTypes.itemlist,
            listname: listname,
            items: [
                {id: 'item1', name: 'name1', text: 'very interesting text 1'},
                {id: undefined, name: 'name2', text: 'very interesting text 2'},
                {id: 'item3', name: 'name3', text: 'very interesting text 3'},
            ]
        }
        expect(list.validateListModel(model)).toBeFalse();
    });

    it('Should recject a model with duplicate ids', () => {
        const model = {
            id: id,
            type: ElemTypes.itemlist,
            listname: listname,
            items: [
                {id: 'item1', name: 'name1', text: 'very interesting text 1'},
                {id: 'item2', name: 'name2', text: 'very interesting text 2'},
                {id: 'item1', name: 'name3', text: 'very interesting text 3'},
            ]
        }
        expect(list.validateListModel(model)).toBeFalse();
    });

    it('Should reject a model where an entry has no name', () => {
        const model = {
            id: id,
            type: ElemTypes.itemlist,
            listname: listname,
            items: [
                {id: 'item1', name: 'name1', text: 'very interesting text 1'},
                {id: 'item2', text: 'very interesting text 2'},
                {id: 'item3', name: 'name3', text: 'very interesting text 3'},
            ]
        }
        expect(list.validateListModel(model)).toBeFalse();
    });

    it('Should reject a model where an entry has no text', () => {
        const model = {
            id: id,
            type: ElemTypes.itemlist,
            listname: listname,
            items: [
                {id: 'item1', name: 'name1', text: 'very interesting text 1'},
                {id: 'item2', name: 'name2'},
                {id: 'item3', name: 'name3', text: 'very interesting text 3'},
            ]
        }
        expect(list.validateListModel(model)).toBeFalse();
    });

    it('Should accept a model where an entry has an empty name', () => {
        const model = {
            id: id,
            type: ElemTypes.itemlist,
            listname: listname,
            items: [
                {id: 'item1', name: 'name1', text: 'very interesting text 1'},
                {id: 'item2', name: '', text: 'very interesting text 2'},
                {id: 'item3', name: 'name3', text: 'very interesting text 3'},
            ]
        }
        expect(list.validateListModel(model)).toBeTrue();
    });

    it('Should accept a model where an entry has an empty text', () => {
        const model = {
            id: id,
            type: ElemTypes.itemlist,
            listname: listname,
            items: [
                {id: 'item1', name: 'name1', text: 'very interesting text 1'},
                {id: 'item2', name: 'name2', text: ''},
                {id: 'item3', name: 'name3', text: 'very interesting text 3'},
            ]
        }
        expect(list.validateListModel(model)).toBeTrue();
    });

});
