import { stringify } from '../utils/stringify'
import { dethunk } from '../interpreter/thunk'

// list.ts: Supporting lists in the Scheme style, using pairs made
//          up of two-element JavaScript array (vector)
// Author: Martin Henz
// Translated to TypeScript by Evan Sebastian
export type Pair<H, T> = [H, T]
export type List = null | NonEmptyList
interface NonEmptyList extends Pair<any, any> {}

// array test works differently for Rhino and
// the Firefox environment (especially Web Console)
function array_test(x: any) {
  if (Array.isArray === undefined) {
    return x instanceof Array
  } else {
    return Array.isArray(x)
  }
}

const descriptor = Object.create(null); // no inherited properties
descriptor.value = true;

// pair constructs a pair using a two-element array
// LOW-LEVEL FUNCTION, NOT SOURCE
/*
export const pair = Object.assign(
  (x: any, xs: any) => {return [x, xs]},
  {isThunkAware : true}
)
*/

export function* pair(x: any, xs: any){
  return [x, xs]
}
Object.defineProperty(pair, 'isThunkAware', descriptor);


// is_pair returns true iff arg is a two-element array
// LOW-LEVEL FUNCTION, NOT SOURCE
export function is_pair(x: any) {
  return array_test(x) && x.length === 2
}

// head returns the first component of the given pair,
// throws an exception if the argument is not a pair
// LOW-LEVEL FUNCTION, NOT SOURCE


export function* head(xs: any) {
  xs = yield* dethunk(xs)
  if (is_pair(xs)) {
    return yield* dethunk(xs[0])
  } else {
    throw new Error('head(xs) expects a pair as argument xs, but encountered ' + stringify(xs))
  }
}
Object.defineProperty(head, 'isThunkAware', descriptor);


// tail returns the second component of the given pair
// throws an exception if the argument is not a pair
// LOW-LEVEL FUNCTION, NOT SOURCE
export function* tail(xs: any) {
  xs = yield* dethunk(xs)
  if (is_pair(xs)) {
    return yield* dethunk(xs[1])
  } else {
    throw new Error('tail(xs) expects a pair as argument xs, but encountered ' + stringify(xs))
  }
}
Object.defineProperty(tail, 'isThunkAware', descriptor);

// is_null returns true if arg is exactly null
// LOW-LEVEL FUNCTION, NOT SOURCE
export function is_null(xs: List) {
  return xs === null
}

// list makes a list out of its arguments
// LOW-LEVEL FUNCTION, NOT SOURCE
export function* list(...elements: any[]){
  let theList = null
  for (let i = elements.length - 1; i >= 0; i -= 1) {
    theList = yield* pair(elements[i], theList)
  }
  return theList
}
Object.defineProperty(list, 'isThunkAware', descriptor);


// set_head(xs,x) changes the head of given pair xs to be x,
// throws an exception if the argument is not a pair
// LOW-LEVEL FUNCTION, NOT SOURCE

export function* set_head(xs: any, x: any) {
  if (is_pair(xs)) {
    xs = yield* pair(x, yield* tail(xs))
    return undefined
  } else {
    throw new Error(
      'set_head(xs,x) expects a pair as argument xs, but encountered ' + stringify(xs)
    )
  }
}
Object.defineProperty(set_head, 'isThunkAware', descriptor);

// set_tail(xs,x) changes the tail of given pair xs to be x,
// throws an exception if the argument is not a pair
// LOW-LEVEL FUNCTION, NOT SOURCE

export function* set_tail(xs: any, x: any) {
  if (is_pair(xs)) {
    xs = yield* pair(yield* head(xs),x)
    return undefined
  } else {
    throw new Error(
      'set_tail(xs,x) expects a pair as argument xs, but encountered ' + stringify(xs)
    )
  }
}
Object.defineProperty(set_tail, 'isThunkAware', descriptor);