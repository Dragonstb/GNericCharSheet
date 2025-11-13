import { Component } from "@angular/core";
import { GNericRPMRow } from "./rpmrow.component";

@Component({
    selector: 'gneric-rpm',
    templateUrl: './rpm.component.html',
    imports: [GNericRPMRow]
})
export class GNericRessourcePointsManager {

    rowNos: number[] = [0,1,2];
}