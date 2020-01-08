import assert from 'assert'
import fs from 'fs'

import yaml from 'js-yaml'

import TreeParser from '@/tree'

const suite = yaml.load(fs.readFileSync(`${__dirname}/tree.spec.yaml`, 'utf8'))

const tp = new TreeParser()

describe('TreeParser.parse', () => {
  suite.parseTree.forEach((t: any) => {
    it(t.name, () => {
      if (t.error) {
        assert.throws(() => {
          tp.parse(t.input)
        }, {
          message: t.error,
        })
      } else {
        const actual = jsonClone(tp.parse(t.input))
        assert.deepStrictEqual(actual, jsonClone(t.expected || {}), yaml.dump(actual))
      }
    })
  })
})

function jsonClone (o: any) {
  return JSON.parse(JSON.stringify(o))
}
