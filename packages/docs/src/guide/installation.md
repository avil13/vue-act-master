---
title: Install Vue-Act-Master | Guide
---

# Установка

Для установки достаточно просто набрать команду

```sh
npm install act-master
```

Если вы используете Vue и optional syntax то вам будет удобно установить обертку и пользоваться ее преимуществами.

```sh
npm install vue-act-master
```

Теперь ван нужно инициализировать библиотеку.

Можно использовать два варианта, один больше подходит в вашем приложении преобладает функциональный стиль, к примеру "Composition API" во Vue или функциональные компоненты в React.
Если же вы чаще используете классы, как анпример в Angular, то можно использовать этот подход.


::: code-group
```ts [Function Style]
import { act } from 'act-master';
import { actions } from '../you/actions/path';

act.init({
  actions,
});
```
```ts [Class Style]
import { ActMaster } from 'act-master';
import { actions } from '../you/actions/path';

const $act = new ActMaster({
  actions
});
```
:::

Добавляем типы tsconfig.json
```json
// tsconfig.json
{
  "compilerOptions": {
    ...
    "types": [
      "vue-act-master", // Add the types in typescript
    ],
  }
}
```

Описание параметров конфига
