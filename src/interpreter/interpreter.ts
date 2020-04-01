/* tslint:disable:max-classes-per-file */
import * as es from 'estree'
import { checkEditorBreakpoints } from '../stdlib/inspector'
import { Context, Value } from '../types'

import { Evaluator } from './evaluatorUtils'
import { getEvaluators } from './evaluators'
import Thunk, { EvaluateFunction, dethunk } from './thunk'

export interface Interpreter {
  boundedForceEvaluate: EvaluateFunction
}

export class ApplicativeOrderEvaluationInterpreter implements Interpreter {
  evaluators: { [nodeType: string]: Evaluator<es.Node> }
  boundedForceEvaluate: EvaluateFunction
  boundedEvaluate: EvaluateFunction;

  *visit(context: Context, node: es.Node) {
    checkEditorBreakpoints(context, node)
    context.runtime.nodes.unshift(node)
    yield context
  }

  *leave(context: Context) {
    context.runtime.break = false
    context.runtime.nodes.shift()
    yield context
  }

  *evaluate(node: es.Node, context: Context): IterableIterator<Value> {
    yield* this.visit(context, node)
    const result = yield* this.evaluators[node.type](node, context)
    yield* this.leave(context)
    return result
  }

  constructor() {
    this.boundedForceEvaluate = this.boundedEvaluate = this.evaluate.bind(this)
    this.evaluators = getEvaluators(this.boundedEvaluate, this.boundedEvaluate)
  }
}

export class LazyEvaluationInterpreter implements Interpreter {
  evaluators: { [nodeType: string]: Evaluator<es.Node> }
  boundedForceEvaluate: EvaluateFunction
  boundedEvaluate: EvaluateFunction;

  *visit(context: Context, node: es.Node) {
    checkEditorBreakpoints(context, node)
    context.runtime.nodes.unshift(node)
    yield context
  }

  *leave(context: Context) {
    context.runtime.break = false
    context.runtime.nodes.shift()
    yield context
  }

  *forceEvaluate(node: es.Node, context: Context): IterableIterator<Value> {
    yield* this.visit(context, node)
    const result = yield* this.evaluators[node.type](node, context)
    yield* this.leave(context)
    return yield* dethunk(result)
  }

  *evaluate(node: es.Node, context: Context): IterableIterator<Value> {
    return new Thunk(node, context, this.boundedForceEvaluate)
  }

  constructor() {
    this.boundedEvaluate = this.evaluate.bind(this)
    this.boundedForceEvaluate = this.forceEvaluate.bind(this)
    this.evaluators = getEvaluators(this.boundedEvaluate, this.boundedForceEvaluate)
  }
}
