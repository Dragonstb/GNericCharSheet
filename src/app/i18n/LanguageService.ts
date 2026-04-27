import { Injectable } from "@angular/core";
import {TranslateService} from "@ngx-translate/core";

@Injectable({
    providedIn: 'root'
})
export class LanguageService {
    private langNames: Map<string, string> = new Map();

    constructor(private translator: TranslateService) {
        const useLang: string = 'en';
        this.translator.setFallbackLang(useLang);
        this.translator.use(useLang);

        this.langNames.set('de', 'Deutsch');
        this.langNames.set('en', 'English');

        const arr: Array<string> = [];
        this.langNames.forEach((val,key) => {
            arr.push(key);
        });
        this.translator.addLangs(arr);
    }

    setLang(lang: string): void {
        this.translator.use(lang);
    }

    getLang(): string {
        return this.translator.getCurrentLang();
    }

    getLangName(code: string): string {
        const name = this.langNames.get(code);
        return name ?? '???';
    }

    getAvailabelLangs() {
        return this.translator.getLangs();
    }

    /** Gets the possesive form (genitive) of a noun based on the current language.
     * 
     * @param name The noun of interest.
     * @returns Possesive form if one exists, or 'name' itself.
     */
    getPossesiveForm(name: string): string {
        let result = name;
        switch(this.translator.getCurrentLang()) {
            case 'de': result = this.getPossesiveFormGerman(name); break;
            case 'en': result = this.getPossessiveFormEnglish(name); break;
        }
        return result;
    }

    private getPossessiveFormEnglish(name: string): string {
        const lastLetter = name[name.length-1];
        return lastLetter === 's' || lastLetter === 'x' ? name+"'" : name+"'s";
    }

    private getPossesiveFormGerman(name: string): string {
        const lastLetter = name[name.length-1];
        return lastLetter === 's' || lastLetter === 'x' || lastLetter === 'z' ? name+"'" : name+"s";
    }
}