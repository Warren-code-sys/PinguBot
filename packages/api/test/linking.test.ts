import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { buildServer } from '../src/index';
import { MemoryStore } from '@pingu/core';
import Redis from 'ioredis-mock';
import { Wallet } from 'ethers';

describe('linking flow', () => {
  it('verifies signature and stores address', async () => {
    const store = new MemoryStore();
    const redis = new Redis();
    const app = buildServer({ store, redis });

    const wallet = Wallet.createRandom();
    const nonceRes = await request(app.server).post('/link/nonce').send({ discordId: '123' });
    const nonce = nonceRes.body.nonce as string;
    const signature = await wallet.signMessage(nonce);
    const verifyRes = await request(app.server)
      .post('/link/verify')
      .send({ discordId: '123', address: wallet.address, signature });
    expect(verifyRes.status).toBe(200);
    expect(store.isAddressVerified(wallet.address)).toBe(true);
  });
});
