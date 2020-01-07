const pd = require('parse-duration');

[
  '+1h',
  '-1h',
  '1hr',
  '1d',
  '1mo',
  '1M',
  '1min',
].map((t) => {
  console.log(pd(t))
})
