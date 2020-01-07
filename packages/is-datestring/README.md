# is-datestring

Fix quirks inside [moment.js](https://momentjs.com/) or [day.js](https://github.com/iamkun/dayjs) `string` to `Date` converter.

Invalid date string includes,

- Numbers and number strings

```typescript
import { maybeDatestring } from 'is-datestring'
import dayjs from 'dayjs'
let d: Date
try {
  d = dayjs(maybeDatestring(USER_INPUT_DATESTRING)).toDate()
} catch (e) {
  d = new Date()  // Insert today instead of random string
}
```
