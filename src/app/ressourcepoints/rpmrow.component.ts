import { Component, ElementRef, Input, signal, Signal, ViewChild } from "@angular/core";
import { GNericCross1 } from "./cross1.component";
import { GNericCross2 } from "./cross2.component";
import { GNericCross3 } from "./cross3.component";
import { GNericCross4 } from "./cross4.component";
import { GNericCross5 } from "./cross5.component";
import { GNericCross6 } from "./cross6.component";
import { GNericRPRowStats } from "./rprowstatus";
import { ReactiveFormsModule } from "@angular/forms";

@Component ({
    selector: 'gneric-rpmrow',
    imports: [GNericCross1, GNericCross2, GNericCross3, GNericCross4, GNericCross5, GNericCross6, ReactiveFormsModule],
    templateUrl: './rpmrow.component.html',
    standalone: true
})
export class GNericRPMRow {

    @Input() status!: GNericRPRowStats;
    @Input() showText: boolean = true;
    @Input() textEditable: boolean = true;

}