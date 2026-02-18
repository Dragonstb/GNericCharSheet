import { Injectable } from "@angular/core";
import { GNericCompendiumModel } from "../app/compendium/compendiummodel";
import { ActionTypes } from "../app/ActionTypes";

@Injectable({providedIn: 'root'})
export class CompendiumService {

    private COMPENDIUM_STORAGE: string = 'GNericCharSheet_compendium';
    private compendium: GNericCompendiumModel = new GNericCompendiumModel();

    updateModel(model: any): boolean {
        return this.compendium.updateModel(model);
    }

    storeCompendium(): void {
        localStorage.setItem(this.COMPENDIUM_STORAGE, JSON.stringify(this.compendium.getModel()));
    }
    
    loadCompendium(): void {
        try {
            const compModel: string | null = localStorage.getItem(this.COMPENDIUM_STORAGE);
            if(compModel) {
                const json = {...JSON.parse(compModel), action: ActionTypes.compendiumupdate};
                console.dir(json);
                this.compendium.updateModel(json);
            }
        } catch (error) {
          console.log('GNeric Char Sheet: Error when loading compendium data from local storage.');
        }
    }
    
    clearCompendiumStorage(): void {
        localStorage.removeItem(this.COMPENDIUM_STORAGE);
    }

    getCompendium(): GNericCompendiumModel {
        return this.compendium;
    }
}