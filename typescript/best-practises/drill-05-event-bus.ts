type Events = {
  "user:updated": { userId: string; newName: string };
  "user:deleted": { userId: string };
};

class EventBus {
  private listeners: {
    [K in keyof Events]?: Array<(payload: Events[K]) => void>;
  } = {};

  on<K extends keyof Events>(
    event: K,
    handler: (payload: Events[K]) => void
  ) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }

    this.listeners[event]!.push(handler);
  }

  emit<K extends keyof Events>(event: K, payload: Events[K]) {
    this.listeners[event]?.forEach((fn) => fn(payload));
  }
}

const bus = new EventBus();

bus.on("user:updated", ({ userId, newName }) => {
  console.log(userId, newName);
});

bus.emit("user:updated", {
  userId: "u1",
  newName: "Aarav",
});

