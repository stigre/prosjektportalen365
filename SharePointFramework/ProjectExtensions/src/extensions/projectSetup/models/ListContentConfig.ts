export default class ListContentConfig {
    public fields: string[];

    constructor(
        public title: string,
        public sourceList: string,
        public destinationList: string,
        public destinationLibrary: string,
        fields: string,
        public isDefault: boolean,
        public web: any
    ) {
        this.fields = fields.split(',');
    }
}