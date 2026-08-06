export type QueueActionType = 'BOOK_CONSULTATION' | 'CANCEL_CONSULTATION' | 'CHECKOUT_CART';

export interface QueuedAction {
  id: string;
  type: QueueActionType;
  payload: any;
  createdAt: number;
}

class OfflineSyncService {
  private queue: QueuedAction[] = [];
  private isOnline: boolean = true;
  private listeners: ((isOnline: boolean) => void)[] = [];

  constructor() {
    this.isOnline = true;
  }

  setOnlineStatus(online: boolean) {
    this.isOnline = online;
    this.listeners.forEach((listener) => listener(online));
    if (online) {
      this.syncQueue();
    }
  }

  getOnlineStatus(): boolean {
    return this.isOnline;
  }

  subscribe(listener: (isOnline: boolean) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  enqueueAction(type: QueueActionType, payload: any): QueuedAction {
    const action: QueuedAction = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      payload,
      createdAt: Date.now(),
    };
    this.queue.push(action);
    return action;
  }

  getQueue(): QueuedAction[] {
    return [...this.queue];
  }

  async syncQueue(): Promise<{ processed: number; remaining: number }> {
    if (!this.isOnline || this.queue.length === 0) {
      return { processed: 0, remaining: this.queue.length };
    }

    let processedCount = 0;
    const actionsToProcess = [...this.queue];
    this.queue = [];

    for (const action of actionsToProcess) {
      // Simulate API sync per queued item
      processedCount++;
    }

    return { processed: processedCount, remaining: this.queue.length };
  }
}

export const offlineSync = new OfflineSyncService();
