import * as es from 'estree'

export default class Thunk {
  public isEvaluated: boolean
  public originalNode: es.Node
  public result: any
  public evaluate: Function

  constructor(public node: es.Node, evaluate: Function) {
    this.originalNode = node
    this.isEvaluated = false
    this.result = null
    this.evaluate = evaluate
  }

  public forceEval() {
    if (!this.isEvaluated) {
      this.result = this.evaluate()
      this.isEvaluated = true
    }
    return this.result
  }
}

export function isThunk(value: any): boolean {
  return value instanceof Thunk
}
