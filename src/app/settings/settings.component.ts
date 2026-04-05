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

    downloadData(): void {
        const compModel: GNericCompendiumModel = this.compService.getCompendium();
        
        const json = {
            sheets: this.sheets.getModel(),
            compendium: compModel.getModel()
        }

        const output = JSON.stringify(json, null, 2);
        console.dir(output);
    }
}