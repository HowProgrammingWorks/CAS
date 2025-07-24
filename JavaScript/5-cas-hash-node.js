'use strict';

const crypto = require('node:crypto');

class CASRegister {
  #value = 0;
  #hash;

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

  cas(value, expectedHash) {
    if (this.#hash !== expectedHash) return false;
    this.#value = value;
    this.#hash = CASRegister.hash(value);
    return true;
  }
}

// Usage

const reg = new CASRegister();

reg.cas(100);
const state1 = reg.read();
console.log('Initial:', state1);

const res2 = reg.cas(42, state1.hash);
const state2 = reg.read();
console.log('CAS success:', res2);
console.log('State:', state2);

const res3 = reg.cas(99, state1.hash);
const state3 = reg.read();
console.log('CAS success:', res3);
console.log('State:', state3);

const res4 = reg.cas(77, state2.hash);
const state4 = reg.read();
console.log('CAS success:', res4);
console.log('State:', state4);
