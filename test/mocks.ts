// The type and the mock need to be defined separately because somme functions return the mock itself
type MockFileManager = {
    iCloud: jest.Mock<MockFileManager, []>;
    local: jest.Mock<MockFileManager, []>;
    documentsDirectory: jest.Mock<string, []>;
    joinPath: jest.Mock<string, [string, string]>;
    fileExists: jest.Mock<boolean, [string]>;
    readString: jest.Mock<string, [string]>;
}

export const mockFileManager: MockFileManager = {
    iCloud: jest.fn(),
    local: jest.fn(),
    documentsDirectory: jest.fn().mockReturnValue("/Documents"),
    joinPath: jest.fn((path1: string, path2: string) => path1 + "/" + path2),
    fileExists: jest.fn().mockReturnValue(true),
    readString: jest.fn().mockReturnValue("{}")
}
mockFileManager.iCloud.mockReturnValue(mockFileManager);
mockFileManager.local.mockReturnValue(mockFileManager);


export type ScriptableGlobal = typeof global & {
    FileManager: MockFileManager;
};

export const mockGlobal = global as ScriptableGlobal;

mockGlobal.FileManager = mockFileManager;