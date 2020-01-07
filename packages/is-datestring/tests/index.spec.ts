import assert from 'assert'

import yaml from 'js-yaml'

import { maybeDatestring } from '@/.'

describe('Is a valid Number string', () => {
  [
    ['20190101', '2019-01-01'],
    ['201902', '2019-02-01'],
  ].forEach(([t, expected]) => {
    it(yaml.dump(t), () => {
      const d = maybeDatestring(t)
      assert.strictEqual(d, expected)
    })
  })
})

describe('Is an invalid Number string', () => {
  [
    '1',
    '0',
    '-1',
    '1.1',
    '0.1',
    '.1',
    '-.1',
  ].forEach((t) => {
    it(yaml.dump(t), () => {
      assert.throws(() => {
        maybeDatestring(t)
      }, {
        message: `Is an invalid Number string: ${t}`,
      })
    })
  })
})

describe('Not a string', () => {
  [
    1,
    true,
    null,
    undefined,
    () => {},
    new Date(),
  ].forEach((t) => {
    it(yaml.dump(t), () => {
      assert.throws(() => {
        maybeDatestring(t as any)
      }, {
        message: `Not a string: ${t} -- ${typeof t}`,
      })
    })
  })
})
