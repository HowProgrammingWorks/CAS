'use strict';

class CASRecord {
  #value;
  #hash;

  constructor() {
    this.#value = null;
    this.#hash = '';
  }

  static async hash(value) {
    const data = new TextEncoder().encode(JSON.stringify(value));
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
    this.#hash = await CASRecord.hash(value);
    return true;
  }
}

// Usage

const main = async () => {
  const reg = new CASRecord();

  const record1 = { value: 13.5, unit: 'm/s', precision: 0.1 };
  await reg.cas('', record1);
  const state1 = reg.read();
  console.log('Initial:', state1);

  const record2 = { value: 13.6, unit: 'm/s', precision: 0.01 };
  const res2 = await reg.cas(state1.hash, record2);
  const state2 = reg.read();
  console.log('CAS success:', res2);
  console.log('State:', state2);

  const record3 = { value: 13.2, unit: 'm/s', precision: 0.001 };
  const res3 = await reg.cas(state1.hash, record3);
  const state3 = reg.read();
  console.log('CAS success:', res3);
  console.log('State:', state3);

  const record4 = { value: 13.4, unit: 'm/s', precision: 0.1 };
  const res4 = await reg.cas(state2.hash, record4);
  const state4 = reg.read();
  console.log('CAS success:', res4);
  console.log('State:', state4);
};

main();
