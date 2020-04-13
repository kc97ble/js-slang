import { stringify } from '../utils/stringify'
// stream_tail returns the second component of the given pair
// throws an exception if the argument is not a pair

import { head, is_null, is_pair, list, pair, tail } from './thunk_list' // delete List & Pair

// type Stream = null | Pair<any, () => Stream>

let descriptor = Object.create(null)
descriptor.value = true

export function* stream_tail(xs: any) {
  let theTail
  if (is_pair(xs)) {
    theTail = yield* tail(xs)
  } else {
    throw new Error('stream_tail(xs) expects a pair as ' + 'argument xs, but encountered ' + xs)
  }

  if (typeof theTail === 'function') {
    return theTail()
  } else {
    throw new Error(
      'stream_tail(xs) expects a function as ' +
        'the tail of the argument pair xs, ' +
        'but encountered ' +
        theTail
    )
  }
}
Object.defineProperty(stream_tail, 'isThunkAware', descriptor);

// stream makes a stream out of its arguments
// LOW-LEVEL FUNCTION, NOT SOURCE
// Lazy? No: In this implementation, we generate first a
//           complete list, and then a stream using list_to_stream
export function* stream(...elements: any[]) {
  return yield* list_to_stream(yield* list(...elements))
}
Object.defineProperty(stream, 'isThunkAware', descriptor);

export function* list_to_stream(xs: any):any {
  if (yield* is_null(xs)) {
    return null
  } else if (yield* is_pair(xs)){
    let theTail =  yield* list_to_stream(yield* tail(xs))
    return yield* pair(yield* head(xs), () => theTail)
  }
  else{
    throw new Error('list_to_stream(xs) expects a list as argument xs, but encountered ' + stringify(xs))
  }
}
Object.defineProperty(list_to_stream, 'isThunkAware', descriptor);