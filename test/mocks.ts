// The type and the mock need to be defined separately because somme functions return the mock itself
type MockFileManager = {
    iCloud: jest.Mock<MockFileManager, []>;
    local: jest.Mock<MockFileManager, []>;
    documentsDirectory: jest.Mock<string, []>;
    joinPath: jest.Mock<string, [string, string]>;
    fileExists: jest.Mock<boolean, [string]>;
    readString: jest.Mock<string, [string]>;
    writeString: jest.Mock<void, [string, string]>;
}

export const mockFileManager: MockFileManager = {
    iCloud: jest.fn(() => mockFileManager),
    local: jest.fn(() => mockFileManager),
    documentsDirectory: jest.fn().mockReturnValue("/FakeDocuments"),
    joinPath: jest.fn((path1: string, path2: string) => path1 + "/" + path2),
    fileExists: jest.fn().mockReturnValue(true),
    readString: jest.fn().mockReturnValue('{"tasks": []}'),
    writeString: jest.fn(),
};


export type ScriptableGlobal = typeof global & {
    FileManager: MockFileManager;
};

export const mockGlobal = global as ScriptableGlobal;

mockGlobal.FileManager = mockFileManager;