import { ITermData } from "@pnp/sp-taxonomy";

export default class Phase {
    public term: ITermData;
    public checkPointStatus: { [phase: string]: number };

    constructor(term: ITermData, checkPointStatus = {}) {
        this.term = term;
        this.checkPointStatus = checkPointStatus;
    }
}