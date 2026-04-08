import { Component, inject, Input, output, signal } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
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
    uploadInput = new FormControl('');
    errMsg = signal('');

    uploadMergeEvent = output<any>();

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

    upload(event: Event): void {
        console.log('upload');
        console.log(this.uploadInput.value ?? '-- no value --');

        const input = event.target as HTMLInputElement;

        if(!input.files?.length) {
            this.errMsg.set('No readable files');
            return;
        }

        const file = input.files[0]; // TODO: read more files at once and join all valid files to a single json
        const reader = new FileReader();

        reader.onload = () => {
            try {
                const json = JSON.parse(reader.result as string);
                this.uploadMergeEvent.emit(json);
                this.errMsg.set('Uploaded data');
                this.uploadInput.setValue('');
            } catch (error) {
                this.errMsg.set('File content is not a proper json');
                this.uploadInput.setValue('');
            }
        }

        reader.readAsText(file);
    }
}