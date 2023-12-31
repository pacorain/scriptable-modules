"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityInventory = void 0;
class ActivityInventory {
    constructor() {
        this.tasks = [];
    }
    get activeTasks() {
        // TODO: Filter out complete/cancelled tasks and ongoing tasks that have been deactivated
        return this.tasks;
    }
}
exports.ActivityInventory = ActivityInventory;
