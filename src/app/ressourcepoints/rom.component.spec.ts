import { ComponentFixture, TestBed } from "@angular/core/testing";
import { GNericRessourcePointsManager } from "./rpm.component";
import { DebugElement } from "@angular/core";
import { ElemTypes } from "../elemtypes";

describe( 'GNericRessourcePointsManager', () => {
    let fixture: ComponentFixture<GNericRessourcePointsManager>;
    let rpm: GNericRessourcePointsManager;
    let natElem: HTMLElement;
    let dbgElem: DebugElement;
    const id: string = "comp-03-03";
    const fullId = "ressource-points-"+id;


    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GNericRessourcePointsManager],
        }).compileComponents();
        
        fixture = TestBed.createComponent( GNericRessourcePointsManager );
        fixture.autoDetectChanges();
        rpm = fixture.componentInstance;
        natElem = fixture.nativeElement;
        dbgElem = fixture.debugElement;
        // fixture.componentRef.setInput( 'id', id );
        await fixture.whenStable();
    });

    // _______________ create _______________

    it('Should create the rpm', () => {
        expect( rpm ).toBeTruthy();
    });

});