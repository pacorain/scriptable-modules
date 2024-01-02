import { ActivityInventory, Task, TaskStatus }  from '../src/pomodoro';
import { mockFileManager } from './mocks';

describe('Task', () => {
    it('should initialize with a description and estimate', async () => {
        let task = new Task("Test", 2);
        expect(task.description).toBe("Test");
        expect(task.original_estimate).toBe(2);
        expect(task.remaining_estimate).toBe(2);
        expect(task.workLogs.length).toBe(0);
    });

    it('should be active by default', async () => {
        let task = new Task("Test", 2);
        expect(task.active).toBe(true);
    });

    it('should be inactive if cancelled', async () => {
        let task = new Task("Test", 2);
        task.cancel();
        expect(task.active).toBe(false);
        expect(task.status).toBe(TaskStatus.Cancelled);
    });

    it('should be inactive if complete', async () => {
        let task = new Task("Test", 2);
        task.complete();
        expect(task.active).toBe(false);
        expect(task.status).toBe(TaskStatus.Complete);
    });

    it('should be active if restarted', async () => {
        let task = new Task("Test", 2);
        task.cancel();
        task.restart();
        expect(task.active).toBe(true);
        expect(task.status).toBe(TaskStatus.Todo);
    });
});

describe('ActivityInventory', () => {
    it('should initialize with no tasks', async () => {
        let inventory = new ActivityInventory();
        expect(inventory.tasks.length).toBe(0);
        expect(inventory.activeTasks.length).toBe(0);
        // TODO: If there is a method for calculating effort remaining, test that it is 0
    });

    it('loads from iCloud by default', async () => {
        mockFileManager.fileExists.mockReturnValue(true);
        await ActivityInventory.load();
        expect(mockFileManager.iCloud).toHaveBeenCalled();
        expect(mockFileManager.readString).toHaveBeenCalledWith('/FakeDocuments/pomodoro/inventory.json');
    });

    it('creates a new inventory if none exists', async () => {
        mockFileManager.fileExists.mockReturnValue(false);
        await ActivityInventory.load();
        expect(mockFileManager.writeString).toHaveBeenCalled();
        let args = mockFileManager.writeString.mock.calls[0];
        expect(args[0]).toBe('/FakeDocuments/pomodoro/inventory.json');
    });

    it('stores a task', () => {
        let inventory = new ActivityInventory();
        let testTask = new Task("Test", 2);
        inventory.addTask(testTask);
        expect(inventory.tasks).toContain(testTask);
        expect(inventory.activeTasks).toContain(testTask);
        testTask.cancel();
        expect(inventory.tasks).toContain(testTask);
        expect(inventory.activeTasks).not.toContain(testTask);
    });

    it('creates a new task', () => {
        let inventory = new ActivityInventory();
        inventory.createTask("Test", 2);
        expect(inventory.tasks.length).toBe(1);
        expect(inventory.tasks[0].description).toBe("Test");
        expect(inventory.tasks[0].original_estimate).toBe(2);
    });
})