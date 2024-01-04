import { ActivityInventory, OngoingTask, Task, TaskStatus }  from '../src/pomodoro';
import { mockFileManager } from './mocks';

beforeEach(() => {
    jest.resetAllMocks();
    mockFileManager.iCloud.mockReturnValue(mockFileManager);
    mockFileManager.local.mockReturnValue(mockFileManager);
    mockFileManager.documentsDirectory.mockReturnValue("/FakeDocuments");
    mockFileManager.joinPath.mockImplementation((path1: string, path2: string) => path1 + "/" + path2);
    mockFileManager.fileExists.mockReturnValue(true);
    mockFileManager.readString.mockReturnValue('{"tasks": []}');
});

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
    it('should initialize with no tasks', () => {
        let inventory = new ActivityInventory();
        expect(inventory.tasks.length).toBe(0);
        expect(inventory.activeTasks.length).toBe(0);
        // TODO: If there is a method for calculating effort remaining, test that it is 0
    });

    it('loads from iCloud by default', () => {
        mockFileManager.fileExists.mockReturnValue(true);
        ActivityInventory.load();
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

    it('creates a new ongoing task', () => {
        let inventory = new ActivityInventory();
        inventory.createOngoingTask("Test");
        expect(inventory.tasks.length).toBe(1);
        expect(inventory.tasks[0].description).toBe("Test");
        expect(inventory.tasks[0].original_estimate).toBeUndefined();
    });

    it('serializes to JSON', async () => {
        mockFileManager.writeString.mockClear();
        let inventory = new ActivityInventory();
        inventory.createTask("Test", 2);
        inventory.createOngoingTask("Test2")
        inventory.save();
        expect(mockFileManager.writeString).toHaveBeenCalled();
        let args = mockFileManager.writeString.mock.calls[0];
        expect(args[0]).toBe('/FakeDocuments/pomodoro/inventory.json');
        let contents = args[1];
        let json = JSON.parse(contents);
        expect(json.tasks.length).toBe(2);
        expect(json.tasks[0].description).toBe("Test");
        expect(json.tasks[0].original_estimate).toBe(2);
        expect(json.tasks[0].hasOwnProperty("active")).toBe(false);
        expect(json.tasks[1].description).toBe("Test2");
        expect(json.tasks[1].hasOwnProperty("original_estimate")).toBe(false);
        expect(json.tasks[1].active).toBe(true);
    });

    it('restores from JSON', () => {
        mockFileManager.readString.mockReturnValue('{"tasks":[{"description":"Test","original_estimate":2},{"description":"Test2"}]}');
        let inventory = ActivityInventory.load();
        expect(inventory.tasks.length).toBe(2);
        expect(inventory.tasks[0].description).toBe("Test");
        expect(inventory.tasks[0].original_estimate).toBe(2);
        expect(inventory.tasks[0].active).toBe(true);
        expect(inventory.tasks[1].description).toBe("Test2");
        expect(inventory.tasks[1].original_estimate).toBeUndefined();
        expect(inventory.tasks[1].active).toBe(true);
    });

})