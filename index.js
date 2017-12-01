const unified = require('unified')
const parse = require('remark-parse')
const customElementCompiler = require('@dumpster/remark-custom-element-to-hast')
const md = `This is a test <MyComponent>of how components' **children**</MyComponent> are handled`

const parser = unified()
  .use(parse)
  .use(customElementCompiler, { whitelist: ['MyComponent'] })

const hast = parser.processSync(md).contents

console.log(JSON.stringify(hast, null, 2))
