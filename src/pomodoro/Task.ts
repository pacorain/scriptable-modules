export interface ITask {
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

    static deserialize(json: any): ITask {
        if ('original_estimate' in json) {
            return Object.assign(new Task("", 0), json);
        } else {
            return Object.assign(new OngoingTask(""), json);
        }
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

