export class ActivityInventory {
    tasks: any[];

    constructor(json: any = {}) {
        this.tasks = [];
    }

    get activeTasks() {
        // TODO: Filter out complete/cancelled tasks and ongoing tasks that have been deactivated
        return this.tasks;
    }

    static async load() {
        let icloud = FileManager.iCloud();
        let path = icloud.joinPath(icloud.documentsDirectory(), "pomodoro/inventory.json");
        if (icloud.fileExists(path)) {
            let contents = icloud.readString(path);
            let inventory = JSON.parse(contents);
            return new ActivityInventory(inventory);
        } else {
            let inventory = new ActivityInventory();
            await inventory.save();
        }
    }

    async save() {
        // TODO: Save to iCloud
    }
}