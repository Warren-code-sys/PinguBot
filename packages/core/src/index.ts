import { randomUUID } from "crypto";
export type CallStatus = 'PENDING_ENTRY' | 'ACTIVE' | 'PARTIALLY_CLOSED' | 'CLOSED' | 'CANCELLED';
export type Side = 'LONG' | 'SHORT';

export interface User {
  id: number;
  discordId: string;
  addresses: Address[];
}

export interface Address {
  id: number;
  userId: number;
  address: string;
  verified: boolean;
}

export interface Call {
  id: string;
  userId: number;
  address: string;
  symbol: string;
  side: Side;
  status: CallStatus;
  createdAt: Date;
}

let userId = 1;
let addressId = 1;

export class MemoryStore {
  users = new Map<number, User>();
  addresses = new Map<string, Address>(); // key: address
  calls = new Map<string, Call>();

  createUser(discordId: string): User {
    const u: User = { id: userId++, discordId, addresses: [] };
    this.users.set(u.id, u);
    return u;
  }

  getUserByDiscord(discordId: string): User | undefined {
    for (const u of this.users.values()) if (u.discordId === discordId) return u;
    return undefined;
  }

  verifyAddress(discordId: string, address: string) {
    let user = this.getUserByDiscord(discordId);
    if (!user) user = this.createUser(discordId);
    const addr: Address = { id: addressId++, userId: user.id, address, verified: true };
    user.addresses.push(addr);
    this.addresses.set(address.toLowerCase(), addr);
    return addr;
  }

  isAddressVerified(address: string): boolean {
    const addr = this.addresses.get(address.toLowerCase());
    return !!addr && addr.verified;
  }

  createCall(call: Omit<Call, 'createdAt' | 'status' | 'id'> & { id?: string }): Call {
    const id = call.id ?? randomUUID();
    const c: Call = { ...call, id, status: 'PENDING_ENTRY', createdAt: new Date() };
    this.calls.set(id, c);
    return c;
  }

  getCall(id: string): Call | undefined {
    return this.calls.get(id);
  }

  setCallStatus(id: string, status: CallStatus) {
    const c = this.calls.get(id);
    if (c) c.status = status;
  }
}
