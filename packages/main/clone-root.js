const fs = require('fs')

const sortPkgJson = require('sort-package-json')

const { private, workspaces, devDependencies: _1, ...basePkg } = require('../../package.json')
const { main, typings, version, dependencies, devDependencies, scripts } = require('./package.json')

fs.writeFileSync(
  './package.json',
  sortPkgJson(JSON.stringify({
    ...basePkg,
    ...{ main, typings, version, dependencies, devDependencies, scripts },
  }, null, 2)),
);

[
  'README.md',
  'LICENSE',
].forEach((f) => {
  if (fs.existsSync(`../../${f}`)) {
    fs.copyFileSync(
      `../../${f}`,
      f,
    )
  }
})
