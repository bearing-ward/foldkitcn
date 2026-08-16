import { Schema } from 'effect'
import type { Effect } from 'effect'
import * as FoldkitCommand from 'foldkit/command'

export type Command<T> = Readonly<{
  name: string
  args?: Record<string, unknown>
  effect: Effect.Effect<T, never, never>
}>

export const { mapMessages } = FoldkitCommand

export function define<
  Name extends string,
  Fields extends Schema.Struct.Fields,
  Results extends ReadonlyArray<Schema.Top>,
>(
  name: Name,
  args: Fields,
  ...messages: Results
): (
  execute: (
    args: Schema.Schema.Type<Schema.Struct<Fields>>,
  ) => Effect.Effect<Schema.Schema.Type<Results[number]>, any, any>,
) => any
export function define<Name extends string, Result extends Schema.Top>(
  name: Name,
  result: Result,
): (execute: Effect.Effect<Schema.Schema.Type<Result>, any, any>) => any
export function define(
  name: string,
  argsOrResult: unknown,
  ...messages: ReadonlyArray<Schema.Top>
) {
  const hasArgs = !Schema.isSchema(argsOrResult)
  const args = hasArgs ? argsOrResult : undefined
  const results = hasArgs ? messages : [argsOrResult as Schema.Top]
  return (execute: unknown) =>
    FoldkitCommand.define(name, {
      ...(args === undefined ? {} : { args }),
      messages: results,
      execute,
    } as never)
}
