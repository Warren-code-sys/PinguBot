import { Queue } from 'bullmq';
import { MemoryStore } from '@pingu/core';
import { MockPingu, PositionOpened } from './mockPingu';

export interface WorkerDeps {
  store: MemoryStore;
  queue: Queue;
  pingu: MockPingu;
}

export function startWorker({ store, queue, pingu }: WorkerDeps) {
  const processed = new Set<string>();
  pingu.on('position_opened', (ev: PositionOpened) => {
    for (const call of store.calls.values()) {
      if (
        call.status === 'PENDING_ENTRY' &&
        call.address.toLowerCase() === ev.address.toLowerCase() &&
        call.symbol === ev.symbol
      ) {
        store.setCallStatus(call.id, 'ACTIVE');
        if (!processed.has(call.id)) {
          queue.add('entry', { callId: call.id, price: ev.price });
          processed.add(call.id);
        }
      }
    }
  });
}
