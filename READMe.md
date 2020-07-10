## Usage

```js
npm install vue-snowflake

const Snowflake = require('vue-snowflake');
// var node = new Snowflake(workerId, datacenterId ,sequence);
var node = new Snowflake(1, 1 ,0);
// BigInteger.
console.log(node.creatID());
```