import type { WebSocket } from "@fastify/websocket";

type NotifyRequestData = {
  key: string,
  message: { 
    [key: string]: unknown
  }
}

export class Observer {
  observers = {} as { [key: string]: Set<WebSocket> }

  subscribe (socket: WebSocket, key: string) {
    if (!this.observers[key]) {
      this.observers[key] = new Set()
    }

    this.observers[key].add(socket)
  }

  unsubscribe (socket: WebSocket, key: string) {
    this.observers[key].delete(socket)

    if (this.observers[key].size === 0) {
      delete this.observers[key]
    }
  }

  notifyAll({ key, message }: NotifyRequestData) {
    if (this.observers[key]) {
      for (const observer of this.observers[key]) {
        observer.send(JSON.stringify(message))
      }
    }
  }
}