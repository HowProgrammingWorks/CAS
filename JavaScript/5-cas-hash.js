'use strict';

const crypto = require('node:crypto');

class CASRegister {
  #value;
  #hash;

  constructor(initialValue = 0) {
    this.#value = initialValue;
    this.#hash = CASRegister.hash(initialValue);
  }

  static hash(value) {
    const data = JSON.stringify(value);
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  read() {
    return {
      hash: this.#hash,
      value: this.#value,
    };
  }

  cas(expectedHash, value) {
    if (this.#hash !== expectedHash) return false;
    this.#value = value;
    this.#hash = CASRegister.hash(value);
    return true;
  }
}

// Usage

const reg = new CASRegister(100);
const state1 = reg.read();
console.log('Initial:', state1);

const res2 = reg.cas(state1.hash, 42);
const state2 = reg.read();
console.log('CAS success:', res2);
console.log('State:', state2);

const res3 = reg.cas(state1.hash, 99);
const state3 = reg.read();
console.log('CAS success:', res3);
console.log('State:', state3);

const res4 = reg.cas(state2.hash, 77);
const state4 = reg.read();
console.log('CAS success:', res4);
console.log('State:', state4);
