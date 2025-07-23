'use strict';

class ConcurrentSet {
  constructor(size) {
    const bufferSize = size * Uint32Array.BYTES_PER_ELEMENT;
    this.buffer = new SharedArrayBuffer(bufferSize);
    this.array = new Uint32Array(this.buffer);
    this.size = size;
  }

  add(value) {
    for (let i = 0; i < this.size; i++) {
      const slot = Atomics.load(this.array, i);
      if (slot === value) return;
      if (slot === 0) {
        const res = Atomics.compareExchange(this.array, i, 0, value);
        if (res === 0) return;
      }
    }
    throw new Error('Set is full');
  }

  has(value) {
    for (let i = 0; i < this.size; i++) {
      if (Atomics.load(this.array, i) === value) return true;
    }
    return false;
  }

  remove(value) {
    for (let i = 0; i < this.size; i++) {
      if (Atomics.load(this.array, i) === value) {
        Atomics.store(this.array, i, 0);
        return;
      }
    }
  }

  toArray() {
    return Array.from(this.array).filter((x) => x !== 0);
  }
}

// Usage

const set = new ConcurrentSet(5);
set.add(3);
set.add(5);
set.add(6);
set.add(8);
console.log('set: ', set.toArray());
console.log('has(5): ', set.has(5));
console.log('has(2): ', set.has(2));
set.remove(3);
console.log('remove(3)');
console.log('set: ', set.toArray());
