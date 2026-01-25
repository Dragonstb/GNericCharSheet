import { Component, inject, Input, output, ViewChild } from "@angular/core";
import { GNericSheetCollectionModel } from "./sheetcollectionmodel";
import { GNericSheet } from "../sheet/sheet.component";
import { GNericSheetModel } from "../sheet/sheetmodel";
import { FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { ElemTypes } from "../elemtypes";
import { ActionTypes } from "../ActionTypes";
import { Utils } from "../../services/utils";
import { GNericDeletionModal } from "../deletionmodal/delmodal.component";
import { Player } from "@owlbear-rodeo/sdk";
import { GNericSheetPlayerAssignment } from "../../services/sheetPlayerAssignment";

@Component({
    selector: 'gneric-sheetcollection',
    templateUrl: './sheetcollection.component.html',
    imports: [GNericSheet, ReactiveFormsModule, GNericDeletionModal]
})
export class GNericSheetCollection {

    @Input() sheets: GNericSheetCollectionModel = new GNericSheetCollectionModel();
    @Input() editable: boolean = true;
    @Input() isGM: boolean = true;
    @Input() otherPlayers: Player[] = [];

    @ViewChild('dialog') dialog!: GNericDeletionModal; 

    sheetSelect = new FormControl();
    playerSelect = new FormControl();
    newCharName = new FormControl('', [Validators.required, Validators.minLength(1)]);

    currentSheet: GNericSheetModel | undefined = undefined;
    gNericElemChangedEvent = output<object>();
    playerSelectEvent = output<GNericSheetPlayerAssignment>();

    private utils = inject(Utils);
    private idCounter: number = 0;
    private idKey = this.utils.getRandomString(4);

    private getNextId(): string {
        const num = this.idCounter++;
        return this.idKey+'-'+String(num);
    }

    selectSheet(): void {
        const id = this.sheetSelect.value ?? '';
        this.currentSheet = this.sheets.getSheetById(id);
    }

    selectPlayer(): void {
        if(!this.currentSheet) {
            return;
        }

        const sheetId = this.currentSheet.getId();
        const playerId = this.playerSelect.value ?? '';
        console.log('selected player '+playerId);
        const assignment = new GNericSheetPlayerAssignment(sheetId, playerId);
        this.playerSelectEvent.emit(assignment);
    }

    getPossesiveFormOfName(): string {
        if(this.currentSheet) {
            const name = this.currentSheet.getCharName();
            const lastLetter = name[name.length-1];
            return lastLetter === 's' || lastLetter === 'x' ? name+"'" : name+"'s";
        }
        else {
            return '';
        }
    }

    addSheet(): void {
        if(!this.isGM) {
            return;
        }

        const charName = this.newCharName.value ?? '';
        if(charName.length > 0) {
            const id = this.getNextId();
            const newSheet = new GNericSheetModel(id, charName);
            this.sheets.addSheet(newSheet);
            this.newCharName.setValue('');
            this.currentSheet = newSheet;
            this.sheetSelect.setValue(id);
            this.reactOnCollectionUpdate();
        }
    }

    openDeleteDialog(): void {
        this.dialog.openDialog();
    }

    deleteSheet(): void {
        if(!this.currentSheet || !this.isGM) {
            return;
        }
        
        const oldSheet = this.currentSheet;
        if(this.sheets.removeSheet(oldSheet.getId())) {
            if(this.sheets.sheets.length > 0) {
                this.currentSheet = this.sheets.sheets[0];
                this.sheetSelect.setValue(this.currentSheet.getId());
            }
            else {
                this.clearCurrentSheet();
            }
            this.reactOnCollectionUpdate();
        }
    }
    
    copySheet(): void {
        if(!this.currentSheet || !this.isGM) {
            return;
        }

        const model = this.currentSheet.getModel() as any;
        const newCharName = this.currentSheet.getCharName()+' '+this.utils.getRandomString(4);
        const newId = this.getNextId();
        model.id = newId;
        model.name = newCharName;
        const json = {...model, action: ActionTypes.sheetupdate};

        const newSheet = new GNericSheetModel(newId, newCharName);
        newSheet.updateModel(json);
        this.sheets.addSheet(newSheet);
        this.currentSheet = newSheet;
        this.sheetSelect.setValue(newId);
        this.reactOnCollectionUpdate();
    }

    clearCurrentSheet(): void {
        this.currentSheet = undefined;
        this.sheetSelect.setValue(undefined);
    }

    checkCurrentSheet(): void {
        if(!this.currentSheet) {
            return;
        }

        const sheetId = this.currentSheet.getId();
        let needsUpdate: boolean = true;
        for (const sheet of this.sheets.sheets) {
            if(sheet.getId() === sheetId) {
                needsUpdate = false;
                break;
            }
        }

        if(needsUpdate) {
            this.clearCurrentSheet();
        }
    }

    // _______________ broadcast changes _______________

    reactOnSheetUpdate(model: object): void {
        const json = {
            type: ElemTypes.sheetcollection,
            action: ActionTypes.sheetupdate,
            model: model
        }
        this.gNericElemChangedEvent.emit(json);
    }

    reactOnCollectionUpdate(): void {
        const model = this.sheets.getModel();
        const json = {...model, action: ActionTypes.collectionupdate};
        this.gNericElemChangedEvent.emit(json);
    }

}