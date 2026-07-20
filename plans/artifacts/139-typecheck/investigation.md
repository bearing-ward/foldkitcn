# Plan 139 boundary investigation

## Conclusion

The Foldkit Story API is not the source of the compiler collapse. Importing the
docs application's `Model` is sufficient to reproduce the failure because
`src/main.ts` imports `src/live-examples.ts`, a 4,035-line module that imports
nearly every registry example.

A declaration boundary around live examples and registry modules makes the app
shell and root Story test stable below 1 GB. Per-test registry projects are also
viable: a simple component is green, while a menu-heavy project reports three
ordinary contract errors without `TS2859` or an out-of-memory failure.

## Tight reproduction

All commands use the repository's strict compiler options.

| Probe                                                                       |   Heap | Result                                    |
| --------------------------------------------------------------------------- | -----: | ----------------------------------------- |
| Minimal Foldkit Story in `repro/minimal-story.ts`                           | 512 MB | exit 0 in 0.40 s; 341 MB maximum RSS      |
| Type-only `Model` import from `src/main.ts` in `repro/import-main-model.ts` | 512 MB | exit 134 in about 8 s; heap out of memory |
| `src/main.ts` alone                                                         | 512 MB | exit 134 in about 8 s; heap out of memory |
| `src/live-examples.ts` alone                                                | 512 MB | exit 134; heap out of memory              |
| `src/data.ts` alone                                                         | 512 MB | exit 0                                    |
| shadcn Button test                                                          | 512 MB | exit 0                                    |
| base-ui Menu Scene test                                                     | 512 MB | exits with one real `TS2379`, not OOM     |

The fast red command is:

```sh
NODE_OPTIONS=--max-old-space-size=512 bun x tsc --ignoreConfig --noEmit \
  --target ES2022 --module ESNext --lib ES2022,DOM \
  --moduleResolution bundler --strict --noUncheckedIndexedAccess \
  --skipLibCheck --esModuleInterop --exactOptionalPropertyTypes \
  --isolatedModules plans/artifacts/139-typecheck/repro/import-main-model.ts
```

The paired green control uses the same flags with
`repro/minimal-story.ts`.

## Boundary prototype

The prototype gives runtime imports stable `#live-examples` and `#registry/*`
names through `package.json#imports`. Runtime targets remain the existing source
files. Typecheck-only configs map those names to declarations under
`.typecheck/live-examples/`.

| Project                         | Heap | Result before contract repair                                                                                     |
| ------------------------------- | ---: | ----------------------------------------------------------------------------------------------------------------- |
| Live examples declaration stage | 4 GB | completes in 120.02 s; 4,048,516 K compiler memory; 19,346,011 instantiations; 13 real diagnostics; zero `TS2859` |
| App shell                       | 1 GB | 1.27 s; 373,163 K compiler memory; one `TS7006`                                                                   |
| Root Story test                 | 1 GB | 14.43 s; 892,755 K compiler memory; one `TS7006`                                                                  |
| Simple registry test            | 1 GB | exit 0 in 1.81 s; 316,997 K compiler memory                                                                       |
| Menu registry tests             | 1 GB | 6.91 s; 634,586 K compiler memory; three real `TS2379` diagnostics                                                |

After explicitly typing `onPositionedSurface`, both the app-shell and root Story
projects exit 0 under a 1 GB heap. `bun run build` and
`bun run test -- src/story.test.ts` also pass, proving the import aliases do not
change runtime resolution.

## Final bounded workflow

All 13 live-example diagnostics and the ordinary diagnostics exposed by the
expanded shards were repaired without casts, ignores, relaxed compiler options,
or public component contract changes. The fail-closed live-example declaration
stage retains `noEmitOnError: true` and runs before every downstream lane.

`bun run typecheck` now runs named source projects with a 4 GB maximum heap,
then 14 static test projects with a 2 GB maximum heap per process. The largest
measured test shard was the root Scene project at 1,855,324,160 bytes maximum
RSS. Other representative maximum RSS measurements were:

| Project          |     Maximum RSS | Result |
| ---------------- | --------------: | ------ |
| Source support   | 2,159,902,720 B | exit 0 |
| shadcn s-z tests |     1,958,654 K | exit 0 |
| shadcn j-r tests |     1,945,721 K | exit 0 |
| Root Scene test  | 1,855,324,160 B | exit 0 |
| Parity tests     |   718,045,184 B | exit 0 |
| Data test        |   526,598,144 B | exit 0 |

The exact-once coverage test parses the 14 test configs and verifies every
`*.test.ts` or `*.test.tsx` under `src/`, `scripts/`, and `tests/` appears in
exactly one shard. A compiler-file audit also found no uncovered non-test
TypeScript files under `src/` or `scripts/`.

Final local gates:

- `bun run typecheck`: exit 0.
- `bun run test`: 122 files and 1,033 tests passed.
- `bun run test:e2e`: 344 tests passed.
- `bun run check`: exit 0.
