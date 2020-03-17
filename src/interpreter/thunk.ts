import * as es from 'estree'
import {Context} from '../types'

type EvaluateFunction = (node: es.Node, context: Context) => Generator<any>

export default class Thunk {
  public isEvaluated: boolean
  public result: any
  public originalNode: es.Node
  public context: Context
  public evaluate: EvaluateFunction

  constructor(public node: es.Node, context: Context, evaluate: EvaluateFunction) {
    this.originalNode = node
    this.isEvaluated = false
    this.result = null
    this.context = context
    this.evaluate = evaluate
  }

  public *forceEval() {
    if (!this.isEvaluated) {
      this.result = yield* this.evaluate(this.node, this.context)
      this.isEvaluated = true
    }
    return this.result
  }

  // public isEvaluated: boolean
  // public originalNode: es.Node
  // public result: any
  // public evaluate: Function

  // constructor(public node: es.Node, evaluate: Function) {
  //   this.originalNode = node
  //   this.isEvaluated = false
  //   this.result = null
  //   this.evaluate = evaluate
  // }

  // public forceEval() {
  //   if (!this.isEvaluated) {
  //     this.result = this.evaluate()
  //     this.isEvaluated = true
  //   }
  //   return this.result
  // }
}

export function isThunk(value: any): boolean {
  return value instanceof Thunk
}
