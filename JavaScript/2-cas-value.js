'use strict';

class CASRegister {
  #value;

  constructor(initialValue = 0) {
    this.#value = initialValue;
  }

  read() {
    return this.#value;
  }

  cas(expected, value) {
    if (this.#value !== expected) return false;
    this.#value = value;
    return true;
  }
}

// Usage

const reg = new CASRegister(100);
console.log('Initial:', reg.read());

const res1 = reg.cas(100, 42);
console.log('CAS success:', res1, 'State:', reg.read());

const res2 = reg.cas(100, 99);
console.log('CAS success:', res2, 'State:', reg.read());

const res3 = reg.cas(42, 77);
console.log('CAS success:', res3, 'State:', reg.read());
