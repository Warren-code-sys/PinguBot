import { randomUUID } from "crypto";
import Fastify from 'fastify';
import Redis from 'ioredis';
import { z } from 'zod';
import { MemoryStore } from '@pingu/core';
import { ethers } from 'ethers';

export interface ServerDeps {
  store?: MemoryStore;
  redis?: Redis;
}

export function buildServer(deps: ServerDeps = {}) {
  const store = deps.store ?? new MemoryStore();
  const redis = deps.redis ?? new Redis(process.env.REDIS_URL ?? '');

  const app = Fastify();

  app.post('/link/nonce', async (req, res) => {
    const body = z.object({ discordId: z.string() }).parse(req.body);
    const nonce = randomUUID();
    await redis.set(`nonce:${body.discordId}`, nonce, 'EX', 300);
    return { nonce };
  });

  app.post('/link/verify', async (req, res) => {
    const body = z
      .object({ discordId: z.string(), address: z.string(), signature: z.string() })
      .parse(req.body);
    const nonce = await redis.get(`nonce:${body.discordId}`);
    if (!nonce) return res.status(400).send({ error: 'nonce_not_found' });
    const recovered = ethers.verifyMessage(nonce, body.signature);
    if (recovered.toLowerCase() !== body.address.toLowerCase()) {
      return res.status(400).send({ error: 'bad_signature' });
    }
    store.verifyAddress(body.discordId, body.address);
    return { success: true };
  });

  app.post('/v1/calls', async (req, res) => {
    const body = z
      .object({
        discordId: z.string(),
        symbol: z.string(),
        side: z.enum(['LONG', 'SHORT']),
        address: z.string(),
      })
      .parse(req.body);
    if (!store.isAddressVerified(body.address)) {
      return res.status(400).send({ error: 'address_not_verified' });
    }
    const user = store.getUserByDiscord(body.discordId);
    if (!user) return res.status(400).send({ error: 'user_not_found' });
    const call = store.createCall({
      userId: user.id,
      address: body.address,
      symbol: body.symbol,
      side: body.side,
    });
    return { id: call.id, status: call.status };
  });

  app.get('/v1/calls/:id', async (req, res) => {
    const params = z.object({ id: z.string() }).parse(req.params);
    const call = store.getCall(params.id);
    if (!call) return res.status(404).send({ error: 'not_found' });
    return call;
  });

  app.get('/healthz', async () => ({ ok: true }));

  return app;
}
