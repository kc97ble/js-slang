import { stringify } from '../utils/stringify'
import { head, is_null, is_pair, list, List, pair, Pair, tail } from './thunk-list'
// try to combine thunk with stream, though may not be
// very meaningful since in the situation, lazy-list is
// lazier than lazy-stream.

// Define value of property 'isThunkAware' of each built-in function
// to be true, to make the args of functions not deepthunked.

type Stream = Pair<any, () => any> | null

// stream_tail returns the second component of the given pair
// throws an exception if the argument is not a pair
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
Object.defineProperty(stream_tail, 'isThunkAware', { value: true })

// stream makes a stream out of its arguments
// LOW-LEVEL FUNCTION, NOT SOURCE
// Lazy? No: In this implementation, we generate the tail
//           of a stream recursively using list_to_stream
export function* stream(...elements: any[]): Generator<Stream> {
  return yield* list_to_stream(yield* list(...elements))
}
Object.defineProperty(stream, 'isThunkAware', { value: true })

export function* list_to_stream(xs: List): Generator<Stream> {
  if (yield* is_null(xs)) {
    return null
  } else if (yield* is_pair(xs)) {
    const theTail = yield* list_to_stream(yield* tail(xs))
    return yield* pair(yield* head(xs), () => theTail)
  } else {
    throw new Error(
      'list_to_stream(xs) expects a list as argument xs, but encountered ' + stringify(xs)
    )
  }
}
Object.defineProperty(list_to_stream, 'isThunkAware', { value: true })
