import { stripIndent } from '../../utils/formatters'
import { expectResult } from '../../utils/testing'

test('infinite functions with pair', () => {
  return expectResult(
    stripIndent`
      function f(x) { return pair(x,f(x+1)); }
      head(f(0))+head(tail(tail(f(0))));
    `,
    { chapter: 2, native: false, lazyEvaluation: true }
  ).toMatchInlineSnapshot(`2`)
})

test('infinite functions with list', () => {
  return expectResult(
    stripIndent`
        function f(x) { return list(x,f(x+1)); }
        head(f(0))+head(tail(tail(f(0))));
        `,
    { chapter: 2, native: false, lazyEvaluation: true }
  ).toMatchInlineSnapshot(`
    2
    `)
})
