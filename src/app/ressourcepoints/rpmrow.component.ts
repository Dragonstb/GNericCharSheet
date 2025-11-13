import { Component } from "@angular/core";
import { GNericCross1 } from "./cross1.component";
import { GNericCross2 } from "./cross2.component";
import { GNericCross3 } from "./cross3.component";
import { GNericCross4 } from "./cross4.component";
import { GNericCross5 } from "./cross5.component";
import { GNericCross6 } from "./cross6.component";
import { RPStatus } from "./rpstatus";

@Component ({
    selector: 'gneric-rpmrow',
    imports: [GNericCross1, GNericCross2, GNericCross3, GNericCross4, GNericCross5, GNericCross6],
    templateUrl: './rpmrow.component.html'
})
export class GNericRPMRow {

    status: RPStatus[] = [
        new RPStatus(0), new RPStatus(1), new RPStatus(2), new RPStatus(3)
    ]
}