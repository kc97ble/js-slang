import { stringify } from '../utils/stringify'

// list.ts: Supporting lists in the Scheme style, using pairs made
//          up of two-element JavaScript array (vector)
// Author: Martin Henz
// Translated to TypeScript by Evan Sebastian


export type Pair<H, T> = () => [H, T]
// export type List = null | NonEmptyList
// interface NonEmptyList extends Pair<any, any> {}

// array test works differently for Rhino and
// the Firefox environment (especially Web Console)
function array_test(x: any) {
  if (Array.isArray === undefined) {
    return x instanceof Array
  } else {
    return Array.isArray(x)
  }
}

// pair constructs a pair using a two-element array
// LOW-LEVEL FUNCTION, NOT SOURCE


export const pair = Object.assign(
  (x: any, xs: any) => {return ()=> [x, xs]},
  {isThunkAware : true}
)


// is_pair returns true iff arg is a two-element array
// LOW-LEVEL FUNCTION, NOT SOURCE
export function is_pair(x: any) {
  return x instanceof Function && array_test(x()) && x().length === 2
}

// head returns the first component of the given pair,
// throws an exception if the argument is not a pair
// LOW-LEVEL FUNCTION, NOT SOURCE
export const head = Object.assign(
  (xs: any) => {
    if (is_pair(xs)) {
      return xs()[0]
    } else {
      throw new Error('head(xs) expects a pair as argument xs, but encountered ' + stringify(xs))
    }
  },
  {isThunkAware : false}
)


// tail returns the second component of the given pair
// throws an exception if the argument is not a pair
// LOW-LEVEL FUNCTION, NOT SOURCE
export const tail = Object.assign(
  (xs: any) => {
    if (is_pair(xs)) {
      return xs()[1]
    } else {
      throw new Error('tail(xs) expects a pair as argument xs, but encountered ' + stringify(xs))
    }
  },
  {isThunkAware : false}
)

// is_null returns true if arg is exactly null
// LOW-LEVEL FUNCTION, NOT SOURCE
export function is_null(xs: any) {
  return xs === null
}

// list makes a list out of its arguments
// LOW-LEVEL FUNCTION, NOT SOURCE
export function list(...elements: any[]){
  let theList = null
  for (let i = elements.length - 1; i >= 0; i -= 1) {
    theList = pair(elements[i], theList)
  }
  return theList
}


// set_head(xs,x) changes the head of given pair xs to be x,
// throws an exception if the argument is not a pair
// LOW-LEVEL FUNCTION, NOT SOURCE

export function set_head(xs: any, x: any) {
  if (is_pair(xs)) {
    xs[0] = x
    return undefined
  } else {
    throw new Error(
      'set_head(xs,x) expects a pair as argument xs, but encountered ' + stringify(xs)
    )
  }
}

// set_tail(xs,x) changes the tail of given pair xs to be x,
// throws an exception if the argument is not a pair
// LOW-LEVEL FUNCTION, NOT SOURCE

export function set_tail(xs: any, x: any) {
  if (is_pair(xs)) {
    xs[1] = x
    return undefined
  } else {
    throw new Error(
      'set_tail(xs,x) expects a pair as argument xs, but encountered ' + stringify(xs)
    )
  }
}
