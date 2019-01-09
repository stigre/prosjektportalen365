export default class ProjectStatusReport {
    public item: any;

    constructor(item: any) {
        this.item = item;
    }

    public toString() {
        return `${this.item.GtMonthChoice} ${this.item.created.substring(0, 4)}`;
    }
}