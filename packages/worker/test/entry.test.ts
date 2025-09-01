import { describe, it, expect } from 'vitest';
import { MemoryStore } from '@pingu/core';
import { MockPingu } from '../src/mockPingu';
import { startWorker } from '../src/index';
import { Queue } from 'bullmq';
import Redis from 'ioredis-mock';

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe('worker entry activation', () => {
  it('activates call on position_opened and enqueues alert', async () => {
    const store = new MemoryStore();
    const redis = new Redis();
    const queue = new Queue('alerts', { connection: redis as any });
    const pingu = new MockPingu();

    // Setup call
    const discordId = '123';
    store.verifyAddress(discordId, '0xabc');
    const user = store.getUserByDiscord(discordId)!;
    const call = store.createCall({ userId: user.id, address: '0xabc', symbol: 'BTCUSD', side: 'LONG' });

    startWorker({ store, queue, pingu });

    pingu.emitPositionOpened('0xabc', 'BTCUSD', 1000);
    await delay(10);

    expect(store.getCall(call.id)?.status).toBe('ACTIVE');
    const jobs = await queue.getJobs(['waiting', 'delayed', 'active', 'completed']);
    expect(jobs.length).toBe(1);
    expect(jobs[0].data.callId).toBe(call.id);
  });
});
