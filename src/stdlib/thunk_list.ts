import { stringify } from '../utils/stringify'
import  Thunk  from '../interpreter/thunk'
import { isFunction } from 'util'

// list.ts: Supporting lists in the Scheme style, using pairs made
//          up of two-element JavaScript array (vector)
// Author: Martin Henz
// Translated to TypeScript by Evan Sebastian
export type Pair<H, T> = ()=>[H, T]

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
export function* pair(x: any, xs: any) {
  // return new Thunk([x,xs], context, forceEvaluate)
  const a = () => [x, xs]
  return a
}

// is_pair returns true iff arg is a two-element array
// LOW-LEVEL FUNCTION, NOT SOURCE
export function* is_pair(x: any) {
  return isFunction(x) && array_test(x()) && x().length === 2
}

// head returns the first component of the given pair,
// throws an exception if the argument is not a pair
// LOW-LEVEL FUNCTION, NOT SOURCE
export function* head(xs: any) {
  if (xs instanceof Thunk) {
    while (xs instanceof Thunk) {
      xs = yield* xs.forceEval()
    }
  }

  if (is_pair(xs)) {
    let p = xs()[0]
    while (p instanceof Thunk) {
      p = yield* p.forceEval()
    }
    // let result = yield* forceEvaluate(p[0], p[2])
    return p
  } else {
    throw new Error('head(xs) expects a pair as argument xs, but encountered ' + stringify(xs))
  }
}

// tail returns the second component of the given pair
// throws an exception if the argument is not a pair
// LOW-LEVEL FUNCTION, NOT SOURCE
export function* tail(xs: any) {
  if (xs instanceof Thunk) {
    while (xs instanceof Thunk) {
      xs = yield* xs.forceEval()
    }
  }

  if (is_pair(xs)) {
    let p = xs()[1]
    while (p instanceof Thunk) {
      p = yield* p.forceEval()
    }
    return p
  } else {
    throw new Error('tail(xs) expects a pair as argument xs, but encountered ' + stringify(xs))
  }
}

// is_null returns true if arg is exactly null
// LOW-LEVEL FUNCTION, NOT SOURCE
export function* is_null(xs: any) {
  return xs === null
}

// list makes a list out of its arguments
// LOW-LEVEL FUNCTION, NOT SOURCE
export function* list(...elements: any[]) {
  let theList = null
  for (let i = elements.length - 1; i >= 0; i -= 1) {
    theList = yield* pair(elements[i], theList)
  }
  return theList
}

/*
Should be useless for lazy mode, since it's not built-in function for any chapter
// list_to_vector returns vector that contains the elements of the argument list
// in the given order.
// list_to_vector throws an exception if the argument is not a list
// LOW-LEVEL FUNCTION, NOT SOURCE
export function list_to_vector(lst: any) {
  if (!is_pair(lst)){
    throw new Error('list_to_vector(lst) expects a pair as argument lst, but encountered ' + stringify(lst))
  }
  const vector = []
  while (!is_null(lst)) {
    vector.push(head(lst))
  }
  return vector
}

// vector_to_list returns a list that contains the elements of the argument vector
// in the given order.
// vector_to_list throws an exception if the argument is not a vector
// LOW-LEVEL FUNCTION, NOT SOURCE
export function vector_to_list(context: Context, vector: any[]): List {
  return list(context, ...vector)
}
*/

// set_head(xs,x) changes the head of given pair xs to be x,
// throws an exception if the argument is not a pair
// LOW-LEVEL FUNCTION, NOT SOURCE

export function* set_head(xs: any, x: any) {
  if (is_pair(xs)) {
    xs = pair(x, xs()[1])
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

export function* set_tail(xs: any, x: any) {
  if (is_pair(xs)) {
    xs = pair(xs()[0], x)
    return undefined
  } else {
    throw new Error(
      'set_tail(xs,x) expects a pair as argument xs, but encountered ' + stringify(xs)
    )
  }
}
