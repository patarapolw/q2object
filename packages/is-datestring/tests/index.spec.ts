import assert from 'assert'

import yaml from 'js-yaml'

import { maybeDatestring } from '@/.'

describe('Is a valid Number string', () => {
  [
    ['20190101', new Date(2019, 1, 1)],
    ['201902', new Date(2019, 2)],
  ].forEach(([t, expected]) => {
    it(yaml.dump(t), () => {
      const d = maybeDatestring(t as any) as Date
      assert(d instanceof Date)
      assert.strictEqual(d.toISOString(), (expected as Date).toISOString())
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
