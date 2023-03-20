# Convert function to action

There are cases where business logic can be solved in a single function. Then creating an action object may seem redundant.

Then you can convert a function into an action with the "functionToAction" handler. Or its alias "fn2act".

The name of the action will be the name of the function.

```ts
import { fn2act, act } from 'act-master';

function SumAction(a, b) {
  return a + b;
}

act.addActions([
  fn2act(SumAction), // Convert to action
]);

const result = await act.exec('SumAction', 2, 3);
console.log(result); // 5
```
