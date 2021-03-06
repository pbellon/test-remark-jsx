const unified = require('unified')
const parse = require('remark-parse')
const customElementCompiler = require('@dumpster/remark-custom-element-to-hast')

const parser = unified()
  .use(parse)
  .use(customElementCompiler, { componentWhitelist: ['MyComponent', 'Autoclose'] })

describe('Components with nested markdown', () => {
  const md = `This is a test <MyComponent>of how components' **children**</MyComponent> are handled`
  const hast = parser.processSync(md).contents
  const hastCustom = hast.children[0].children.find(({ tagName }) => tagName == 'MyComponent')
  
  it('should have children', () => {
    expect(hastCustom.children.length).toBeGreaterThan(0)
  })

  it('should have a strong children', () => {
    const strong = hastCustom.children.find(({ tagName }) => tagName && tagName == 'strong')
    expect(strong).toBeDefined()
  })
})


describe('Autoclosing components', () => {
  const md = `This is a test of <Autoclose value='test'/> components.
  <MyComponent>Let's try to nest <Autoclose value='ok'/> with **mixed content**</MyComponent> 
  `
  const root = parser.processSync(md).contents
  const p = root.children[0]
  const comp = p.children.find(({ tagName }) => tagName == 'MyComponent')
  const autoclose = comp.children.find(({ tagName }) => tagName == 'Autoclose')

  it('should have an Autoclose element', () => {
    expect(p.children.find(({ tagName }) => tagName == 'Autoclose')).toBeDefined()
  })

  it('should work when nested in another component', () => {
    expect(autoclose).toBeDefined()
  })

  it('should work when mixed with markdown when nested', () => {
    expect(autoclose.children.length).toBe(0)
    expect(comp.children.find(({ tagName }) => tagName == 'strong')).toBeDefined()
  })
})
