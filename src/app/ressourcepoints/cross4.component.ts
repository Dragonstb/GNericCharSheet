import { Component } from "@angular/core";

@Component({
    selector: 'gneric-cross4',
    template:'<svg class="svgicon" \
        viewBox="0 0 10 10" \
        xmlns="http://www.w3.org/2000/svg" \
        xmlns:svg="http://www.w3.org/2000/svg"> \
        <path \
            class="crossbar" \
            d="M 1,9 9,1" /> \
        <path \
            class="crossbar" \
            d="M 9,9 1,1" /> \
        <path \
            class="crossbar" \
            d="M 1,5 H 9" /> \
    </svg>'
})
export class GNericCross4{}