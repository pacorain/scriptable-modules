interface ITask {
    description: string;
    active: boolean;
    workLogs: any[];
    original_estimate?: number;
    remaining_estimate?: number;
}

export enum TaskStatus {
    Todo,
    Complete,
    Cancelled
}

export class Task implements ITask { 
    description: string;
    status: TaskStatus;
    original_estimate: number;
    remaining_estimate: number;
    workLogs: any[];

    constructor(description: string, estimate: number) {
        this.description = description;
        this.status = TaskStatus.Todo;
        this.original_estimate = estimate;
        this.remaining_estimate = estimate;
        this.workLogs = [];
    }

    get active() {
        return this.status == TaskStatus.Todo;
    }

    cancel() {
        this.status = TaskStatus.Cancelled;
    }

    complete() {
        this.status = TaskStatus.Complete;
    }

    restart() {
        this.status = TaskStatus.Todo;
    }
}

export class OngoingTask implements ITask {
    description: string;
    active: boolean;
    workLogs: any[];

    constructor(description: string) {
        this.description = description;
        this.active = true;
        this.workLogs = [];
    }

    archive() {
        this.active = false;
    }

    unarchive() {
        this.active = true;
    }
}

export class ActivityInventory {
    tasks: ITask[];

    constructor(json: any = {}) {
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
        return this.tasks.filter(task => task.active)
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
        let icloud = FileManager.iCloud();
        let path = icloud.joinPath(icloud.documentsDirectory(), "pomodoro/inventory.json");
        let contents = JSON.stringify(this);
        icloud.writeString(path, contents);
    }
}