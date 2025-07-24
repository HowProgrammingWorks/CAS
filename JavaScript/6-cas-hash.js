'use strict';

class CASRegister {
  #value = 0;
  #hash;

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

  async cas(value, expectedHash) {
    if (this.#hash !== expectedHash) return false;
    this.#value = value;
    this.#hash = await CASRegister.hash(value);
    return true;
  }
}

// Usage

const main = async () => {
  const reg = new CASRegister();

  await reg.cas(42);
  const state1 = reg.read();
  console.log('Initial:', state1);

  const res2 = await reg.cas(42, state1.hash);
  const state2 = reg.read();
  console.log('CAS success:', res2);
  console.log('State:', state2);

  const res3 = await reg.cas(99, state1.hash);
  const state3 = reg.read();
  console.log('CAS success:', res3);
  console.log('State:', state3);

  const res4 = await reg.cas(77, state1.hash);
  const state4 = reg.read();
  console.log('CAS success:', res4);
  console.log('State:', state4);
};

main();
