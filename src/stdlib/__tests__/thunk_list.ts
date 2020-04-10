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

test('is_null with infinite function', () => {
  return expectResult(
    stripIndent`
        function f(x) { return list(x,f(x+1)); }
        is_null(f(0));
        `,
    { chapter: 2, native: false, lazyEvaluation: true }
  ).toMatchInlineSnapshot(`
    false
    `)
})

test('is_pair && is_list with infinite function', () => {
  return expectResult(
    stripIndent`
        function f(x) { return list(x,f(x+1)); }
        is_pair(f(0)) && is_list(f(0));
        `,
    { chapter: 2, native: false, lazyEvaluation: true }
  ).toMatchInlineSnapshot(`
    true
    `)
})

test('list_ref with infinite function', () => {
  return expectResult(
    stripIndent`
        function f(x) { return list(x,f(x+1)); }
        list_ref(f(0),3);
        `,
    { chapter: 2, native: false, lazyEvaluation: true }
  ).toMatchInlineSnapshot(`
    3
    `)
})
