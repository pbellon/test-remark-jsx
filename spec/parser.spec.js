const unified = require('unified')
const parse = require('remark-parse')
const customElementCompiler = require('@dumpster/remark-custom-element-to-hast')
const md = `This is a test <MyComponent>of how components' **children**</MyComponent> are handled`

const parser = unified()
  .use(parse)
  .use(customElementCompiler, { componentWhitelist: ['MyComponent'] })

const hast = parser.processSync(md).contents
console.log('hast', JSON.stringify(hast, null, 2))

const hastCustom = hast.children.find(({ tagName }) => tagName == 'MyComponent')

describe('Test nested children for components', () => {
  it('should have children', () => {
    expect(hastCustom.children.length).toBeGreaterThan(0)
  })
})
