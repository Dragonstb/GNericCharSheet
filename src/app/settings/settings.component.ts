import { Component, inject, Input } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { CompendiumService } from "../../services/compendium";
import { GNericCompendiumModel } from "../compendium/compendiummodel";
import { GNericSheetCollectionModel } from "../sheetcollection/sheetcollectionmodel";

@Component({
    selector: 'gneric-settings',
    templateUrl: './settings.component.html',
    imports: [ReactiveFormsModule]
})
export class GNericSettings {

    @Input() sheets: GNericSheetCollectionModel = new GNericSheetCollectionModel();
    compService = inject(CompendiumService);

    downloadLink: HTMLAnchorElement | null = null;

    downloadCompendium(): void {
        const compModel: GNericCompendiumModel = this.compService.getCompendium();
        
        const json = {
            compendium: compModel.getModel()
        }

        this.executeDownload(json, 'ttrpg-compendium.json');
    }

    downloadSheets(): void {
        const json = {
            sheets: this.sheets.getModel(),
        }
        this.executeDownload(json, 'ttrpg-sheets.json');
    }

    downloadData(): void {
        const compModel: GNericCompendiumModel = this.compService.getCompendium();
        
        const json = {
            sheets: this.sheets.getModel(),
            compendium: compModel.getModel()
        }

        this.executeDownload(json, 'ttrpg-data.json');
    }

    private executeDownload(json: Object, filename: String): void {
        const output = JSON.stringify(json, null, 2);

        const blob = new Blob([output], {type: 'application/json'});
        const url = window.URL.createObjectURL(blob);
        console.dir(url);

        if(!this.downloadLink) {
            this.downloadLink = document.createElement('a');
        }
        this.downloadLink.setAttribute('href', url);
        this.downloadLink.setAttribute('download', String(filename));
        this.downloadLink.dispatchEvent(new MouseEvent('click'));

        window.URL.revokeObjectURL(url);
    }
}