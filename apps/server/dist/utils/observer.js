"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Observer = void 0;
class Observer {
    observers = {};
    subscribe(socket, key) {
        if (!this.observers[key]) {
            this.observers[key] = new Set();
        }
        this.observers[key].add(socket);
    }
    unsubscribe(socket, key) {
        this.observers[key].delete(socket);
        if (this.observers[key].size === 0) {
            delete this.observers[key];
        }
    }
    notifyAll({ key, message }) {
        if (this.observers[key]) {
            for (const observer of this.observers[key]) {
                observer.send(JSON.stringify(message));
            }
        }
    }
}
exports.Observer = Observer;
