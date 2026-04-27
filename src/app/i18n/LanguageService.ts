import { Injectable } from "@angular/core";
import {TranslateService} from "@ngx-translate/core";

@Injectable({
    providedIn: 'root'
})
export class LanguageService {
    private LANG_STORAGE = 'GNericCharSheet_language';
    private langNames: Map<string, string> = new Map();

    constructor(private translator: TranslateService) {
        this.langNames.set('de', 'Deutsch');
        this.langNames.set('en', 'English');
        
        const arr: Array<string> = [];
        this.langNames.forEach((val,key) => {
            arr.push(key);
        });
        this.translator.addLangs(arr);
        this.translator.setFallbackLang('en');
        
        let useLang: string | undefined | null = undefined;
        try {
            useLang = localStorage.getItem(this.LANG_STORAGE);
        } catch (error) {
            console.log('GNericCharSheet: Error when loading language data. Falling back to defaults now. You can cahnge the language in the setting panel.');
        }

        if(!useLang || !this.translator.getLangs().includes(useLang)) {
            useLang = this.translator.getBrowserLang();
            if(!useLang || !this.translator.getLangs().includes(useLang)) {
                useLang = 'en';
            }
        }

        this.translator.use(useLang);
        localStorage.setItem(this.LANG_STORAGE, useLang);
    }

    setLang(lang: string): void {
        if(this.translator.getLangs().includes(lang)) {
            this.translator.use(lang);
            localStorage.setItem(this.LANG_STORAGE, lang);
        }
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