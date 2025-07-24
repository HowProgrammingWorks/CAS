'use strict';

class CASRegister {
  #value;
  #hash;

  constructor(initialValue = 0) {
    this.#value = initialValue;
    this.#hash = null;
    return this.#init();
  }

  async #init() {
    this.#hash = await CASRegister.hash(this.#value);
    return this;
  }

  static async hash(value) {
    const data = new TextEncoder().encode(value.toString());
    const digest = await crypto.subtle.digest('SHA-256', data);
    const array = Array.from(new Uint8Array(digest));
    const toHex = (byte) => byte.toString(16).padStart(2, '0');
    return array.map(toHex).join('');
  }

  read() {
    return {
      hash: this.#hash,
      value: this.#value,
    };
  }

  async cas(expectedHash, value) {
    if (this.#hash !== expectedHash) return false;
    this.#value = value;
    this.#hash = await CASRegister.hash(value);
    return true;
  }
}

// Usage

const main = async () => {
  const reg = await new CASRegister(100);
  const state1 = reg.read();
  console.log('Initial:', state1);

  const res2 = await reg.cas(state1.hash, 42);
  const state2 = reg.read();
  console.log('CAS success:', res2);
  console.log('State:', state2);

  const res3 = await reg.cas(state1.hash, 99);
  const state3 = reg.read();
  console.log('CAS success:', res3);
  console.log('State:', state3);

  const res4 = await reg.cas(state2.hash, 77);
  const state4 = reg.read();
  console.log('CAS success:', res4);
  console.log('State:', state4);
};

main();
