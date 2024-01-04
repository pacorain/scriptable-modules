import { ITask, Task, OngoingTask } from './Task';


export class ActivityInventory {
    tasks: ITask[];

    constructor() {
        this.tasks = [];
    }

    addTask(task: ITask) {
        this.tasks.push(task);
    }

    createTask(description: string, estimate: number) {
        let task = new Task(description, estimate);
        this.addTask(task);
    }

    createOngoingTask(description: string) {
        let task = new OngoingTask(description);
        this.addTask(task);
    }

    get activeTasks() {
        return this.tasks.filter(task => task.active);
    }

    static load() {
        let icloud = FileManager.iCloud();
        let path = icloud.joinPath(icloud.documentsDirectory(), "pomodoro/inventory.json");
        if (icloud.fileExists(path)) {
            let contents = icloud.readString(path);
            let inventory = JSON.parse(contents);
            return ActivityInventory.deserialize(inventory);
        } else {
            let inventory = new ActivityInventory();
            inventory.save();
            return inventory;
        }
    }

    static deserialize(json: any) {
        let inventory = new ActivityInventory();
        for (let task_obj of json.tasks) {
            let task = Task.deserialize(task_obj);
            inventory.addTask(task);
        }
        return inventory;
    }

    save() {
        let icloud = FileManager.iCloud();
        let path = icloud.joinPath(icloud.documentsDirectory(), "pomodoro/inventory.json");
        let contents = JSON.stringify(this);
        icloud.writeString(path, contents);
    }
}
