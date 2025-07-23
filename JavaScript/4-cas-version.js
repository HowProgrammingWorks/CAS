'use strict';

class CASRegister {
  constructor(initialValue = 0) {
    this.buffer = new SharedArrayBuffer(2 * Uint32Array.BYTES_PER_ELEMENT);
    this.array = new Uint32Array(this.buffer);
    this.#version = 0;
    this.#value = initialValue;
  }

  get #version() {
    return Atomics.load(this.array, 0);
  }

  set #version(ver) {
    Atomics.store(this.array, 0, ver);
  }

  get #value() {
    return Atomics.load(this.array, 1);
  }

  set #value(val) {
    Atomics.store(this.array, 1, val);
  }

  read() {
    return {
      version: this.#version,
      value: this.#value,
    };
  }

  cas(expectedVersion, value) {
    const currentVersion = this.#version;
    if (currentVersion !== expectedVersion) return false;
    this.#value = value;
    this.#version++;
    return true;
  }
}

// Usage

const reg = new CASRegister(100);
console.log('Initial:', reg.read());

const res1 = reg.cas(0, 42);
console.log('CAS success:', res1, 'State:', reg.read());

const res2 = reg.cas(0, 99);
console.log('CAS success:', res2, 'State:', reg.read());

const res3 = reg.cas(1, 77);
console.log('CAS success:', res3, 'State:', reg.read());
