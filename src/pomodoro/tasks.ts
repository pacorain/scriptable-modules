export class ActivityInventory {
    tasks: any[];

    constructor() {
        this.tasks = [];
    }

    get activeTasks() {
        // TODO: Filter out complete/cancelled tasks and ongoing tasks that have been deactivated
        return this.tasks;
    }
}