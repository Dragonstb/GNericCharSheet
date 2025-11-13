import { RPStatus } from "./rpstatus";

export class GNericRPRowStats {

    id: number;
    status: RPStatus[] = [
        new RPStatus(0)
    ]

    constructor(id: number, points: number) {
        this.id = id;
        while(this.status.length < points) {
            this.status.push(new RPStatus(this.status.length));
        }
    }

}