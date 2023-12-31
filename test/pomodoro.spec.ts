import { ActivityInventory }  from '../pomodoro/index';

describe('ActivityInventory', () => {
    it('should initialize with no tasks', async () => {
        let inventory = new ActivityInventory();
        expect(inventory.tasks.length).toBe(0);
        expect(inventory.activeTasks.length).toBe(0);
        // TODO: If there is a method for calculating effort remaining, test that it is 0
    })
})