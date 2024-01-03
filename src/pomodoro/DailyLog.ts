import { ITask } from './Task';
import { ActivityInventory } from './ActivityInventory';

export class DailyLog {
    constructor(private inventory: ActivityInventory, public date: Date, public tasks: Map<ITask, number>, public goal_pomodoros: number = 0) { }

    get total_pomodoros() {
        return [...this.tasks.values()].reduce((a, b) => a + b, 0);
    }
}