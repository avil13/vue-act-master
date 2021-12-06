# Act-Master

A way to separate business logic from application view.

The easiest library to create a flexible application architecture.

![npm bundle size](https://img.shields.io/bundlephobia/minzip/act-master)
![npm version](https://img.shields.io/npm/v/act-master)

<div align="center">
  <img  src="https://raw.githubusercontent.com/avil13/vue-act-master/master/assets/act-master-logo.svg" alt="vue-act-master">
</div>

---
## 📗 [Documentation](https://avil13.github.io/vue-act-master/)


## 🗺 [Example project structure](https://github.com/avil13/vue-act-master/blob/master/packages/example/README.md)

## 🧪 [Test writing with "ActTest"](https://github.com/avil13/vue-act-master/blob/master/packages/act-master/src/test-utils/README.md)

---

# Example

## Installation

```bash
npm install act-master
```

# Usage

```ts
import { ActMaster } from 'act-master';

const $act = new ActMaster();

const action = {
  name: 'LogData',
  exec(message) {
    console.log('Log:', message);
    return 'Success!!!';
  }
};

$act.addAction(action);

// Use action
const result = await $act.exec('LogData', 'Hello world');

console.log('Result:', result);
```
console.log
```bash
Log: Hello world
Result: Success!!!
```
