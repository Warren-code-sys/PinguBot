import { EventEmitter } from 'events';

export interface PositionOpened {
  address: string;
  symbol: string;
  price: number;
}

export class MockPingu extends EventEmitter {
  emitPositionOpened(address: string, symbol: string, price: number) {
    const event: PositionOpened = { address, symbol, price };
    this.emit('position_opened', event);
  }
}
