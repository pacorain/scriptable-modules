type MockFileManager = {
    iCloud: () => MockFileManager;
    local: () => MockFileManager;
    documentsDirectory: jest.Mock<string, []>;
    joinPath: jest.Mock<string, [string, string]>;
    fileExists: jest.Mock<boolean, [string]>;
    readString: jest.Mock<string, [string]>;
}

export const mockFileManager: MockFileManager = {
    iCloud: () => mockFileManager,
    local: () => mockFileManager,
    documentsDirectory: jest.fn().mockReturnValue("/Documents"),
    joinPath: jest.fn((path1: string, path2: string) => path1 + "/" + path2),
    fileExists: jest.fn().mockReturnValue(true),
    readString: jest.fn().mockReturnValue("{}")
}
    


export type ScriptableGlobal = typeof global & {
    FileManager: MockFileManager;
};

export const mockGlobal = global as ScriptableGlobal;

mockGlobal.FileManager = mockFileManager;