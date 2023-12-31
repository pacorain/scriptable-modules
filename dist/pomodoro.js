var pomodoro = (function (exports) {

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

    return exports;

})({});
