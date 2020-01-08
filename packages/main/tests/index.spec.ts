import fs from 'fs'

import yaml from 'js-yaml'

import QParser from '@/.'

const qp = new QParser('date<-1d', {
  isDate: ['date'],
  isString: ['title', 'tag'],
})

console.log(qp.result.cond)
