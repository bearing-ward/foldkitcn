# Plan 139 baseline

Command:

```sh
NODE_OPTIONS=--max-old-space-size=8192 bun run typecheck -- --extendedDiagnostics
```

Result: exited nonzero. The raw compiler log is intentionally retained only in
the executor's temporary directory, not in the repository.

## Extended diagnostics

| Metric           |       Value |
| ---------------- | ----------: |
| Files            |       1,405 |
| TypeScript lines |     115,098 |
| Types            |   3,005,439 |
| Instantiations   |  22,656,442 |
| Memory used      | 4,628,195 K |
| Check time       |    141.27 s |
| Total time       |    142.08 s |

## Diagnostic categories

| Code   |  Count | Classification                                                                            |
| ------ | -----: | ----------------------------------------------------------------------------------------- |
| TS2859 | 27,579 | TypeScript complexity cascades, predominantly registry component test modules             |
| TS2345 |     15 | Real contract drift: live-example positioning messages and menu/select view configuration |
| TS2379 |      9 | Real exact-optional-property contract drift in menu/select/tooltip configurations         |
| TS2741 |      2 | Real missing `onPositionedSurface` test/report controller callback                        |
| TS7006 |      1 | Real implicit `any` in `src/main.ts`                                                      |
| TS2739 |      1 | Real date-picker attribute contract drift                                                 |
| TS2353 |      1 | Real menubar positioning configuration drift                                              |

The TS2859 reports occur almost entirely under `src/registry/**` tests, with a
small number in `src/utils/cn.test.ts`. The non-complexity diagnostics span
`scripts/report-docs-live-preview-gaps.ts`, root live-example application
files, and base-ui/shadcn registry menu, select, tooltip, and date-picker
files. They are contract errors to repair in bounded source or test lanes, not
evidence that strict compiler options should be relaxed.
