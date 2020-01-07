const fs = require('fs')

const matter = require('gray-matter')
const glob = require('fast-glob')
const yaml = require('js-yaml')

const data = []

glob.sync('**/*.md', {
  cwd: '../../..',
  absolute: true,
  ignore: [
    '**/node_modules',
  ],
}).forEach((f) => {
  const { data: d } = matter(fs.readFileSync(f, 'utf8'))
  if (Object.keys(d).length > 0) {
    data.push(d)
  }
})

fs.writeFileSync(
  '../../tests/data.yaml',
  yaml.dump([
    ...data,
    ...JSON.parse(JSON.stringify(data)),
  ],
  {
    noRefs: true,
  }), // Not safeDump, but true dump, so that datetime can be preserved
)
