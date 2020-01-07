import fs from 'fs'

import yaml from 'js-yaml'

export const DATA = [
  ...yaml.load(fs.readFileSync('../../tests/data.yaml', 'utf8')),
  ...yaml.load(fs.readFileSync('../../tests/extra.yaml', 'utf8')),
]
