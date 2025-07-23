'use strict';

class CASRegister {
  #version;
  #value;

  constructor(initialValue = 0) {
    this.#version = 0;
    this.#value = initialValue;
  }

  read() {
    return {
      version: this.#version,
      value: this.#value,
    };
  }

  cas(expectedVersion, value) {
    if (this.#version !== expectedVersion) return false;
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
