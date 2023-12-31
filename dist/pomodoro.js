/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */


function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

class ActivityInventory {
    constructor(json = {}) {
        this.tasks = [];
    }
    get activeTasks() {
        // TODO: Filter out complete/cancelled tasks and ongoing tasks that have been deactivated
        return this.tasks;
    }
    static load() {
        return __awaiter(this, void 0, void 0, function* () {
            let icloud = FileManager.iCloud();
            let path = icloud.joinPath(icloud.documentsDirectory(), "pomodoro/inventory.json");
            if (icloud.fileExists(path)) {
                let contents = icloud.readString(path);
                let inventory = JSON.parse(contents);
                return new ActivityInventory(inventory);
            }
            else {
                let inventory = new ActivityInventory();
                yield inventory.save();
            }
        });
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: Save to iCloud
        });
    }
}

exports.ActivityInventory = ActivityInventory;
