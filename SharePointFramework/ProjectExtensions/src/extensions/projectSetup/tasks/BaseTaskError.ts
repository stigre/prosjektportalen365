
export class BaseTaskError {
    constructor(
        public task: string,
        public message: string,
    ) {
        this.task = task;
        this.message = message;
    }
}