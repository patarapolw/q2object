import assert from 'assert'

import { durationRegex as re, parseDuration, parseDurationToSeconds } from '@/duration'

describe('milliseconds', () => {
  const cases = [
    '32ms',
    '32msec',
    '32msecs',
    '32millisecond',
    '32milliseconds',
    '32 ms',
  ]

  cases.forEach((t) => {
    it(t, () => {
      assert.strictEqual(parseFloat(re.unit.milliseconds.exec(t)!.groups!.milliseconds), 32)
    })
  })
})

describe('seconds', () => {
  const cases = [
    '32s',
    '32sec',
    '32secs',
    '32second',
    '32seconds',
    '32 s',
  ]

  cases.forEach((t) => {
    it(t, () => {
      assert.strictEqual(parseFloat(re.unit.seconds.exec(t)!.groups!.seconds), 32)
    })
  })
})

describe('mins', () => {
  const cases = [
    '32min',
    '32mins',
    '32minute',
    '32minutes',
    '32 min',
    '32 mins',
    '32 minute',
    '32 minutes',
  ]

  cases.forEach((t) => {
    it(t, () => {
      assert.strictEqual(parseFloat(re.unit.minutes.exec(t)!.groups!.minutes), 32)
    })
  })
})

describe('hours', () => {
  const cases = [
    '32h',
    '32hs',
    '32hr',
    '32hrs',
    '32hours',
    '32 h',
  ]

  cases.forEach((t) => {
    it(t, () => {
      assert.strictEqual(parseFloat(re.unit.hours.exec(t)!.groups!.hours), 32)
    })
  })
})

describe('days', () => {
  const cases = [
    '32.1d',
    '32.1day',
    '32.1days',
    '32.1 d',
  ]

  cases.forEach((t) => {
    it(t, () => {
      assert.strictEqual(parseFloat(re.unit.days.exec(t)!.groups!.days), 32.1)
    })
  })
})

describe('weeks', () => {
  const cases = [
    '.1w',
    '.1wk',
    '.1wks',
    '.1wks.',
    '.1 weeks',
  ]

  cases.forEach((t) => {
    it(t, () => {
      assert.strictEqual(parseFloat(re.unit.weeks.exec(t)!.groups!.weeks), 0.1)
    })
  })
})

describe('months', () => {
  const cases = [
    '.1mo',
    '.1mth',
    '.1mths',
    '.1month',
    '.1 months',
  ]

  cases.forEach((t) => {
    it(t, () => {
      assert.strictEqual(parseFloat(re.unit.months.exec(t)!.groups!.months), 0.1)
    })
  })
})

describe('years', () => {
  const cases = [
    '.1y',
    '.1yr',
    '.1yrs',
    '.1yrs.',
    '.1 years',
  ]

  cases.forEach((t) => {
    it(t, () => {
      assert.strictEqual(parseFloat(re.unit.years.exec(t)!.groups!.years), 0.1)
    })
  })
})

describe('parseDuration', () => {
  const cases = [
    { input: '+32 m 1 s', expected: { minutes: 32, seconds: 1 } },
    { input: '-32 m 1 s', expected: { minutes: -32, seconds: -1 } },
    { input: '- 32 m 1 s', expected: { minutes: -32, seconds: -1 } },
  ]

  cases.forEach((t) => {
    it(t.input, () => {
      assert.deepStrictEqual(parseDuration(t.input), t.expected)
    })
  })
})

describe('parseDurationToSeconds', () => {
  const cases = [
    { input: '+32 m 1 s', expected: 1921 },
    { input: '-32 m 1 s', expected: -1921 },
    { input: '2h32m', expected: 9120 },
    { input: '+2h32m', expected: 9120 },
    { input: '-2h32m', expected: -9120 },
  ]

  cases.forEach((t) => {
    it(t.input, () => {
      assert.strictEqual(parseDurationToSeconds(t.input), t.expected)
    })
  })
})

describe('Invalid string: in-between minus (-) not supported', () => {
  const cases = [
    { input: '32 m -1 s' },
    { input: '32 m - 1 s' },
  ]

  cases.forEach((t) => {
    it(t.input, () => {
      assert.throws(() => {
        parseDurationToSeconds(t.input)
      }, {
        message: 'Invalid string: in-between minus (-) not supported',
      })
    })
  })
})
