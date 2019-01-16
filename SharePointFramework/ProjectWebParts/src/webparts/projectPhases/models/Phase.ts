import { ITermData } from "@pnp/sp-taxonomy";

export type PhaseChecklistData = { stats?: { [status: string]: number }, items?: any[] };

export default class Phase {
    public term: ITermData;
    public id: string;
    public name: string;
    public checklistData: PhaseChecklistData;

    constructor(term: ITermData, checklistData: PhaseChecklistData) {
        this.term = term;
        this.id = this.term.Id.substring(6, 42);
        this.name = this.term.Name;
        this.checklistData = checklistData;
    }

    public toString() {
        return `-1;#${this.name}|${this.id}`;
    }
}