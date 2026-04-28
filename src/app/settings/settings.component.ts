import { Component, inject } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { LanguageService } from "../i18n/LanguageService";
import { TranslatePipe } from "@ngx-translate/core";

@Component({
    selector: 'gneric-settings',
    templateUrl: './settings.component.html',
    imports: [ReactiveFormsModule, TranslatePipe]
})
export class GNericSettings {

    langService = inject(LanguageService);
    langSelect = new FormControl();

    // _______________  language  _______________

    selectLanguage(): void {
        this.langService.setLang(this.langSelect.value);
    }

}