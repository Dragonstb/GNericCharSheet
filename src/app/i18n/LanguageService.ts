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
}