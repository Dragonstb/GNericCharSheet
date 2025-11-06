import { ComponentFixture, TestBed } from "@angular/core/testing";
import { GnericTextfield } from "./textfield.component";
import { DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser";
import { ElemTypes } from "../elemtypes";

describe( 'DiceHeapComponent', () => {
    let fixture: ComponentFixture<GnericTextfield>;
    let textfield: GnericTextfield;
    let natElem: HTMLElement;
    let dbgElem: DebugElement;
    const id: string = "comp-01-01";
    const fullId = "textfield-"+id;


    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GnericTextfield],
        }).compileComponents();
        
        fixture = TestBed.createComponent( GnericTextfield );
        fixture.autoDetectChanges();
        textfield = fixture.componentInstance;
        natElem = fixture.nativeElement;
        dbgElem = fixture.debugElement;
        // fixture.componentRef.setInput( 'id', id );
        await fixture.whenStable();
    });

    // _______________ create _______________

    it('Should create the textfield', () => {
        expect( textfield ).toBeTruthy();
    });

    it('Should start woth 10 rows', () => {
        expect( textfield.rows ).toEqual( 10 );
    });
    
    it( 'The legend should display the correct name', () => {
        const title = natElem.querySelector('legend')!;
        const expected = fullId;
        expect( title.textContent ).toEqual( expected );
    });

    it('Should have the edit panel visible', () => {
        const btn = dbgElem.query( By.css('#'+id+'-editPanel') );
        expect( btn.classes['hidden'] ).toBeFalsy();
    });

    // _______________  changing the number of rows  _______________

    it( 'Should have the correct number of rows after expanding the textfield', () => {
        const newCount = textfield.rows+1;
        textfield.addRow();
        expect( textfield.rows ).toEqual( newCount );
    });

    it( 'Should have the correct number of rows after shrinking the textfield', () => {
        const newCount = textfield.rows-1;
        textfield.deleteRow();
        expect( textfield.rows ).toEqual( newCount );
    });

    it( 'Should disable the shrink button when reaching a size of one row', () => {
        const tooManyRows = textfield.rows-1;
        for (let idx = 0; idx < tooManyRows; idx++) {   
            textfield.deleteRow();
        }
        const btn = dbgElem.query( By.css('#'+id+'-shrink') );
        expect( btn.attributes['disabled'] ).toBeFalsy();
    });

    it( 'Should activate the shrink button when getting back a second row', () => {
        const tooManyRows = textfield.rows-1;
        for (let idx = 0; idx < tooManyRows; idx++) {   
            textfield.deleteRow();
        }
        textfield.addRow();
        const btn = dbgElem.query( By.css('#'+id+'-shrink') );
        expect( btn.attributes['disabled'] ).toBeFalsy();
    });

    it( 'Should not disable the shrink button when having more than one row', () => {
        const tooManyRows = textfield.rows-2;
        for (let idx = 0; idx < tooManyRows; idx++) {   
            textfield.deleteRow();
        }
        // const btn = dbgElem.query( By.css('#'+id+'-shrink') );
        const btn = dbgElem.query( By.css('#'+id+'-shrink') );
        expect( btn.attributes['disabled'] ).toBeFalsy();
    });

    it( 'Should have the correct hint for the number of rows after shrinking/expanding', () => {
        const newCount = textfield.rows+1;
        textfield.addRow();
        const text = natElem.querySelector('span')!;
        const expected = "Currently "+newCount+" rows";
        fixture.detectChanges();
        expect( text.textContent ).toEqual( expected );
    });

    // _______________  deleting the textfield  _______________

    it( 'Should fire a delete event when pressing the dispose button', () => {
        let fired = false;
        textfield.deleteTextfieldEvent.subscribe( () => {fired = true;} );
        textfield.deleteTextfield();
        expect( fired ).toBeTrue();
    });

    // _______________  set editable  _______________

    it('Should hide the edit panel visible when not editable', () => {
        textfield.setEditable(true);
        textfield.setEditable(false);
        const btn = dbgElem.query( By.css('#'+id+'-editPanel') );
        expect( btn.classes['hidden'] ).toBeTruthy();
    });

    it('Should hide the legend visible when not editable', () => {
        textfield.setEditable(true);
        textfield.setEditable(false);
        const btn = dbgElem.query( By.css('legend') );
        expect( btn.classes['hidden'] ).toBeTruthy();
    });

    it('Should not display the field set as editable when not editable', () => {
        textfield.setEditable(true);
        textfield.setEditable(false);
        const btn = dbgElem.query( By.css('fieldset') );
        expect( btn.classes['editable'] ).toBeFalsy();
    });

    it('Should show the edit panel visible when editable', () => {
        textfield.setEditable(false);
        textfield.setEditable(true);
        const btn = dbgElem.query( By.css('#'+id+'-editPanel') );
        expect( btn.classes['hidden'] ).toBeFalsy();
    });

    it('Should show the legend visible when editable', () => {
        textfield.setEditable(false);
        textfield.setEditable(true);
        const btn = dbgElem.query( By.css('legend') );
        expect( btn.classes['hidden'] ).toBeFalsy();
    });

    it('Should display the field set as editable when editable', () => {
        textfield.setEditable(false);
        textfield.setEditable(true);
        const btn = dbgElem.query( By.css('fieldset') );
        expect( btn.classes['editable'] ).toBeTruthy();
    });

    // _______________  fire change event  _______________
    
    it( 'Should fire a change event when pressing the increase button', () => {
        let fired = false;
        textfield.gNericElemChangedEvent.subscribe( () => {fired = true;} );
        textfield.addRow();
        expect( fired ).toBeTrue();
    });

    it( 'Should fire a change event when pressing the shrink button', () => {
        let fired = false;
        textfield.gNericElemChangedEvent.subscribe( () => {fired = true;} );
        textfield.deleteRow();
        expect( fired ).toBeTrue();
    });

    it( 'Should fire a change event when changing the text content', () => {
        let fired = false;
        textfield.gNericElemChangedEvent.subscribe( () => {fired = true;} );
        textfield.textPanel.nativeElement.dispatchEvent(new InputEvent('input'));
        expect( fired ).toBeTrue();
    });

    it( 'Should bubble the correct json when the change event is fired', () => {
        let json = undefined;
        const rows = 5;
        const text = "Hello";
        textfield.rows = rows;
        textfield.textPanel.nativeElement.value = text;
        textfield.gNericElemChangedEvent.subscribe( (evt) => {json = evt;} );
        textfield.textPanel.nativeElement.dispatchEvent(new InputEvent('input'));
        expect( json ).toBeTruthy();
        if(json) {
            expect( json['id'] ).toBe(id);
            expect( json['rows'] ).toBe(rows);
            expect( json['text'] ).toBe(text);
            expect( json['type'] ).toBe(ElemTypes.textfield);
        }
    });


    // _______________  accessors  _______________

    it( 'Should return the correct id', () => {
        const result = textfield.getId();
        expect( id ).toEqual( result );
    });

});