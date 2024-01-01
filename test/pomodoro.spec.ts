import { ActivityInventory }  from '../src/pomodoro';
import { mockFileManager } from './mocks';

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
})