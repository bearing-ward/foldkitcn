# shadcn UI/UX Parity Punch List

Generated: 2026-07-08T16:39:55.513Z
Origin: https://ui.shadcn.com/docs/components
Local: http://localhost:5173/components/shadcn

## Executive Summary

- Live inventory extraction found 64 origin components and 62 local shadcn index entries.
- Origin-only surface gaps: `chart` and `toast`.
- Matrix QA statuses: matches=61, minor-disparities=1, blocked=1, major-disparities=1.
- Screenshot evidence exists for all 64 origin components: desktop and mobile captures for origin and local routes.
- Behavior coverage sampled Keyboard Tab focus, Escape, pointer click dispatch, and mobile viewport loading for the required behavior-heavy list. The interaction smoke is broad coverage evidence, not a replacement for focused component tests.
- ADR 0002 remains in force: docs shell identity is not compared as a defect unless it interferes with component inspection.

## P0 Missing Surface

### P0: Chart - origin component has no local shadcn surface

- **Component**: `shadcn/chart`
- **Origin URL**: https://ui.shadcn.com/docs/components/base/chart
- **Local URL**: missing from http://localhost:5173/components/shadcn rendered inventory; fallback route captured at http://localhost:5173/components/shadcn/chart
- **Origin evidence**: plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/chart/origin-desktop.png; page summary reports `h1 Chart`, status 200, and install command `pnpm dlx shadcn@latest add chart`.
- **Local evidence**: plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/chart/local-desktop.png; rendered inventory excludes `chart`; page summary reports `h1 Page Not Found` on the local route.
- **Expected**: Origin exposes chart documentation, examples, install flow, chart config guidance, tooltip, legend, and theming content.
- **Actual**: Local public shadcn component index has no chart row, and the direct local route renders a not-found page.
- **Impact**: Complete origin parity is blocked because a public origin component has no local install/docs surface.
- **Suggested owner files**: needs architecture follow-up; likely future files include `src/registry/shadcn/chart/**`, `registry-src/shadcn/chart/docs.md`, `src/live-examples.ts`, and focused e2e coverage.
- **Recommended follow-up**: blocked by native chart foundation per ADR 0001; open a direction/architecture plan before implementation.

### P0: Toast - origin component has no local shadcn surface

- **Component**: `shadcn/toast`
- **Origin URL**: https://ui.shadcn.com/docs/components/base/toast
- **Local URL**: missing from http://localhost:5173/components/shadcn rendered inventory; fallback route captured at http://localhost:5173/components/shadcn/toast
- **Origin evidence**: plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/toast/origin-desktop.png; page summary reports `h1 Toast`, status 200.
- **Local evidence**: plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/toast/local-desktop.png; rendered inventory excludes `toast`; page summary reports `h1 Page Not Found` on the local route.
- **Expected**: Origin exposes a Toast component page as part of the complete shadcn public component surface.
- **Actual**: Local public shadcn component index has no toast row, and the direct local route renders a not-found page.
- **Impact**: Complete origin parity is blocked for users looking for the origin Toast API; local Sonner does not satisfy a request for complete origin surface coverage.
- **Suggested owner files**: needs product-direction follow-up; likely future files include `src/registry/shadcn/toast/**`, `registry-src/shadcn/toast/docs.md`, `src/live-examples.ts`, and a docs e2e route/index assertion.
- **Recommended follow-up**: reconcile Plan 112's removal decision with the new complete-parity goal, then either implement a native Toast surface or record an explicit product exception.

## P1 Major UI/UX Disparities

No P1 behavior or visual defect was promoted from this QA pass. The broad interaction artifact covered Keyboard Tab, Escape, focus traces, pointer smoke, and mobile viewport loading for the required behavior-heavy components; follow-up plans should still add focused tests when they change any affected primitive.

## P2 Minor UI/UX Disparities

### P2: Attachment - one docs example is static instead of live preview

- **Component**: `shadcn/attachment`
- **Origin URL**: https://ui.shadcn.com/docs/components/base/attachment
- **Local URL**: http://localhost:5173/components/shadcn/attachment
- **Origin evidence**: plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/attachment/origin-desktop.png; origin page loaded with `h1 Attachment`, status 200.
- **Local evidence**: plans/artifacts/120-shadcn-ui-ux-parity-audit/tooling/docs-live-preview-gaps.txt reports `Cards missing .live-example-preview: 1` and `shadcn/attachment: 1`; screenshots are under plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/attachment/.
- **Expected**: Component examples that can render live should provide a live preview frame rather than a static-status card.
- **Actual**: One Attachment example card is reported as missing `.live-example-preview` with reason `static-status`.
- **Impact**: The component page is usable, but the example inventory is not fully interactive, which weakens UX parity and follow-up QA confidence.
- **Suggested owner files**: `src/registry/shadcn/attachment/examples.ts`, `registry-src/shadcn/attachment/docs.md`, `src/live-examples.ts`, and `tests/e2e/docs.test.ts`.
- **Recommended follow-up**: add or wire the missing live example preview, then guard it with a docs live-preview assertion or component-specific docs e2e check.

## P3 Polish / Origin Drift Notes

### P3: QA harness gap - missing surfaces and most workbench cases lack focused workbench coverage

- **Component**: `shadcn/chart`, `shadcn/toast`, and workbench coverage beyond `shadcn/tabs`
- **Origin URL**: https://ui.shadcn.com/docs/components
- **Local URL**: http://localhost:5173/components/shadcn
- **Origin evidence**: plans/artifacts/120-shadcn-ui-ux-parity-audit/tooling/parity-check-shadcn-chart-dry-run.txt and plans/artifacts/120-shadcn-ui-ux-parity-audit/tooling/parity-check-shadcn-toast-dry-run.txt report no parity slots for the two missing surfaces.
- **Local evidence**: plans/artifacts/120-shadcn-ui-ux-parity-audit/tooling/parity-workbench-empty-demo-dry-run.txt reports `Unknown workbench case: shadcn/empty/empty-demo`; plans/artifacts/120-shadcn-ui-ux-parity-audit/tooling/parity-workbench-tabs-demo-dry-run.txt shows `shadcn/tabs` is the available dry-run workbench case.
- **Expected**: High-risk parity findings should have focused harness cases for DOM, computed style, dimensions, focus, and repeatable interaction recipes.
- **Actual**: Broad parity slots cover 59 shadcn items, but missing surfaces have no slots and the current workbench resolver only accepts `shadcn/tabs/tabs-demo`.
- **Impact**: Follow-up implementers have screenshot and page-summary evidence, but some fixes will need new harness coverage before they can be verified precisely.
- **Suggested owner files**: `tests/parity/slots.ts`, `tests/parity/workbench-cases.ts`, and component-specific fixture files under `tests/parity/fixtures/**`.
- **Recommended follow-up**: add focused parity/workbench cases alongside implementation slices, starting with missing surface smoke and the next high-risk overlay/form primitive touched by a fix.

### P3: Docs shell visual differences are out of component parity scope

- **Component**: `shadcn/*`
- **Origin URL**: https://ui.shadcn.com/docs/components
- **Local URL**: http://localhost:5173/components/shadcn
- **Origin evidence**: Origin screenshots include shadcn.com navigation, ads, copy-page controls, and origin section chrome.
- **Local evidence**: Local screenshots include Foldkit CN navigation, registry/sidebar composition, and Foldkit docs identity.
- **Expected**: Per ADR 0002, component previews and examples should track origin/base-nova behavior, while the docs shell remains Foldkit-branded.
- **Actual**: Screenshots show intentional shell differences around otherwise inspectable component content.
- **Impact**: Reviewers should not split shell styling into implementation defects unless it hides or breaks component inspection.
- **Suggested owner files**: `docs/decisions/0002-foldkit-cn-documentation-site.md`; component owner files only when a preview/example itself differs.
- **Recommended follow-up**: keep future fixes scoped to component preview frames, examples, source/install affordances, and behavior rather than global docs chrome.

## Component Matrix

| Component               | Surface         | QA status         | Origin desktop evidence                                                                       | Local desktop evidence                                                                       |
| ----------------------- | --------------- | ----------------- | --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| shadcn/accordion        | present-in-both | matches           | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/accordion/origin-desktop.png        | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/accordion/local-desktop.png        |
| shadcn/alert            | present-in-both | matches           | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/alert/origin-desktop.png            | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/alert/local-desktop.png            |
| shadcn/alert-dialog     | present-in-both | matches           | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/alert-dialog/origin-desktop.png     | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/alert-dialog/local-desktop.png     |
| shadcn/aspect-ratio     | present-in-both | matches           | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/aspect-ratio/origin-desktop.png     | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/aspect-ratio/local-desktop.png     |
| shadcn/attachment       | present-in-both | minor-disparities | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/attachment/origin-desktop.png       | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/attachment/local-desktop.png       |
| shadcn/avatar           | present-in-both | matches           | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/avatar/origin-desktop.png           | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/avatar/local-desktop.png           |
| shadcn/badge            | present-in-both | matches           | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/badge/origin-desktop.png            | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/badge/local-desktop.png            |
| shadcn/breadcrumb       | present-in-both | matches           | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/breadcrumb/origin-desktop.png       | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/breadcrumb/local-desktop.png       |
| shadcn/bubble           | present-in-both | matches           | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/bubble/origin-desktop.png           | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/bubble/local-desktop.png           |
| shadcn/button           | present-in-both | matches           | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/button/origin-desktop.png           | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/button/local-desktop.png           |
| shadcn/button-group     | present-in-both | matches           | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/button-group/origin-desktop.png     | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/button-group/local-desktop.png     |
| shadcn/calendar         | present-in-both | matches           | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/calendar/origin-desktop.png         | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/calendar/local-desktop.png         |
| shadcn/card             | present-in-both | matches           | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/card/origin-desktop.png             | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/card/local-desktop.png             |
| shadcn/carousel         | present-in-both | matches           | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/carousel/origin-desktop.png         | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/carousel/local-desktop.png         |
| shadcn/chart            | origin-only     | blocked           | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/chart/origin-desktop.png            | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/chart/local-desktop.png            |
| shadcn/checkbox         | present-in-both | matches           | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/checkbox/origin-desktop.png         | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/checkbox/local-desktop.png         |
| shadcn/collapsible      | present-in-both | matches           | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/collapsible/origin-desktop.png      | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/collapsible/local-desktop.png      |
| shadcn/combobox         | present-in-both | matches           | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/combobox/origin-desktop.png         | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/combobox/local-desktop.png         |
| shadcn/command          | present-in-both | matches           | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/command/origin-desktop.png          | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/command/local-desktop.png          |
| shadcn/context-menu     | present-in-both | matches           | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/context-menu/origin-desktop.png     | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/context-menu/local-desktop.png     |
| shadcn/data-table       | present-in-both | matches           | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/data-table/origin-desktop.png       | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/data-table/local-desktop.png       |
| shadcn/date-picker      | present-in-both | matches           | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/date-picker/origin-desktop.png      | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/date-picker/local-desktop.png      |
| shadcn/dialog           | present-in-both | matches           | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/dialog/origin-desktop.png           | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/dialog/local-desktop.png           |
| shadcn/direction        | present-in-both | matches           | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/direction/origin-desktop.png        | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/direction/local-desktop.png        |
| shadcn/drawer           | present-in-both | matches           | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/drawer/origin-desktop.png           | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/drawer/local-desktop.png           |
| shadcn/dropdown-menu    | present-in-both | matches           | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/dropdown-menu/origin-desktop.png    | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/dropdown-menu/local-desktop.png    |
| shadcn/empty            | present-in-both | matches           | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/empty/origin-desktop.png            | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/empty/local-desktop.png            |
| shadcn/field            | present-in-both | matches           | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/field/origin-desktop.png            | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/field/local-desktop.png            |
| shadcn/hover-card       | present-in-both | matches           | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/hover-card/origin-desktop.png       | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/hover-card/local-desktop.png       |
| shadcn/input            | present-in-both | matches           | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/input/origin-desktop.png            | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/input/local-desktop.png            |
| shadcn/input-group      | present-in-both | matches           | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/input-group/origin-desktop.png      | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/input-group/local-desktop.png      |
| shadcn/input-otp        | present-in-both | matches           | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/input-otp/origin-desktop.png        | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/input-otp/local-desktop.png        |
| shadcn/item             | present-in-both | matches           | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/item/origin-desktop.png             | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/item/local-desktop.png             |
| shadcn/kbd              | present-in-both | matches           | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/kbd/origin-desktop.png              | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/kbd/local-desktop.png              |
| shadcn/label            | present-in-both | matches           | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/label/origin-desktop.png            | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/label/local-desktop.png            |
| shadcn/marker           | present-in-both | matches           | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/marker/origin-desktop.png           | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/marker/local-desktop.png           |
| shadcn/menubar          | present-in-both | matches           | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/menubar/origin-desktop.png          | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/menubar/local-desktop.png          |
| shadcn/message          | present-in-both | matches           | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/message/origin-desktop.png          | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/message/local-desktop.png          |
| shadcn/message-scroller | present-in-both | matches           | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/message-scroller/origin-desktop.png | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/message-scroller/local-desktop.png |
| shadcn/native-select    | present-in-both | matches           | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/native-select/origin-desktop.png    | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/native-select/local-desktop.png    |
| shadcn/navigation-menu  | present-in-both | matches           | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/navigation-menu/origin-desktop.png  | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/navigation-menu/local-desktop.png  |
| shadcn/pagination       | present-in-both | matches           | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/pagination/origin-desktop.png       | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/pagination/local-desktop.png       |
| shadcn/popover          | present-in-both | matches           | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/popover/origin-desktop.png          | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/popover/local-desktop.png          |
| shadcn/progress         | present-in-both | matches           | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/progress/origin-desktop.png         | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/progress/local-desktop.png         |
| shadcn/radio-group      | present-in-both | matches           | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/radio-group/origin-desktop.png      | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/radio-group/local-desktop.png      |
| shadcn/resizable        | present-in-both | matches           | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/resizable/origin-desktop.png        | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/resizable/local-desktop.png        |
| shadcn/scroll-area      | present-in-both | matches           | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/scroll-area/origin-desktop.png      | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/scroll-area/local-desktop.png      |
| shadcn/select           | present-in-both | matches           | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/select/origin-desktop.png           | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/select/local-desktop.png           |
| shadcn/separator        | present-in-both | matches           | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/separator/origin-desktop.png        | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/separator/local-desktop.png        |
| shadcn/sheet            | present-in-both | matches           | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/sheet/origin-desktop.png            | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/sheet/local-desktop.png            |
| shadcn/sidebar          | present-in-both | matches           | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/sidebar/origin-desktop.png          | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/sidebar/local-desktop.png          |
| shadcn/skeleton         | present-in-both | matches           | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/skeleton/origin-desktop.png         | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/skeleton/local-desktop.png         |
| shadcn/slider           | present-in-both | matches           | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/slider/origin-desktop.png           | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/slider/local-desktop.png           |
| shadcn/sonner           | present-in-both | matches           | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/sonner/origin-desktop.png           | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/sonner/local-desktop.png           |
| shadcn/spinner          | present-in-both | matches           | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/spinner/origin-desktop.png          | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/spinner/local-desktop.png          |
| shadcn/switch           | present-in-both | matches           | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/switch/origin-desktop.png           | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/switch/local-desktop.png           |
| shadcn/table            | present-in-both | matches           | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/table/origin-desktop.png            | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/table/local-desktop.png            |
| shadcn/tabs             | present-in-both | matches           | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/tabs/origin-desktop.png             | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/tabs/local-desktop.png             |
| shadcn/textarea         | present-in-both | matches           | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/textarea/origin-desktop.png         | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/textarea/local-desktop.png         |
| shadcn/toast            | origin-only     | major-disparities | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/toast/origin-desktop.png            | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/toast/local-desktop.png            |
| shadcn/toggle           | present-in-both | matches           | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/toggle/origin-desktop.png           | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/toggle/local-desktop.png           |
| shadcn/toggle-group     | present-in-both | matches           | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/toggle-group/origin-desktop.png     | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/toggle-group/local-desktop.png     |
| shadcn/tooltip          | present-in-both | matches           | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/tooltip/origin-desktop.png          | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/tooltip/local-desktop.png          |
| shadcn/typography       | present-in-both | matches           | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/typography/origin-desktop.png       | plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/typography/local-desktop.png       |

## Evidence Index

- Component matrix: plans/artifacts/120-shadcn-ui-ux-parity-audit/component-matrix.json
- Page summaries: plans/artifacts/120-shadcn-ui-ux-parity-audit/page-summaries.json
- Interaction pass: plans/artifacts/120-shadcn-ui-ux-parity-audit/interaction-pass.json
- Screenshots: plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/<slug>/{origin-desktop,local-desktop,origin-mobile,local-mobile}.png
- `docs:live-preview-gaps`: plans/artifacts/120-shadcn-ui-ux-parity-audit/tooling/docs-live-preview-gaps.txt
- `origin:components:status`: plans/artifacts/120-shadcn-ui-ux-parity-audit/tooling/origin-components-status.txt
- `parity:check -- --grep shadcn --dry-run`: plans/artifacts/120-shadcn-ui-ux-parity-audit/tooling/parity-check-shadcn-dry-run.txt
- `parity:check -- --grep shadcn/chart --dry-run`: plans/artifacts/120-shadcn-ui-ux-parity-audit/tooling/parity-check-shadcn-chart-dry-run.txt
- `parity:check -- --grep shadcn/toast --dry-run`: plans/artifacts/120-shadcn-ui-ux-parity-audit/tooling/parity-check-shadcn-toast-dry-run.txt
- `parity:check -- --grep shadcn/empty --dry-run`: plans/artifacts/120-shadcn-ui-ux-parity-audit/tooling/parity-check-shadcn-empty-dry-run.txt
- `parity:workbench -- --item shadcn/tabs --case tabs-demo --dry-run`: plans/artifacts/120-shadcn-ui-ux-parity-audit/tooling/parity-workbench-tabs-demo-dry-run.txt
- `parity:workbench -- --item shadcn/empty --case empty-demo --dry-run`: plans/artifacts/120-shadcn-ui-ux-parity-audit/tooling/parity-workbench-empty-demo-dry-run.txt

## Coverage Checklist

- Inventory extraction: origin index 64 components; local shadcn index 62 components; origin-only `chart`, `toast`.
- Visual screenshots: 64 component folders and 256 PNGs created under plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots.
- Structural summaries: origin/local h1, headings, badges, code/install signals, status, and text samples captured in plans/artifacts/120-shadcn-ui-ux-parity-audit/page-summaries.json.
- Behavior-heavy pass: Keyboard Tab focus traces, Escape, focus sampling, pointer smoke, and mobile viewport loading recorded for `shadcn/accordion`, `shadcn/alert-dialog`, `shadcn/calendar`, `shadcn/carousel`, `shadcn/checkbox`, `shadcn/collapsible`, `shadcn/combobox`, `shadcn/command`, `shadcn/context-menu`, `shadcn/data-table`, `shadcn/date-picker`, `shadcn/dialog`, `shadcn/direction`, `shadcn/drawer`, `shadcn/dropdown-menu`, `shadcn/hover-card`, `shadcn/input`, `shadcn/input-group`, `shadcn/input-otp`, `shadcn/menubar`, `shadcn/navigation-menu`, `shadcn/pagination`, `shadcn/popover`, `shadcn/radio-group`, `shadcn/resizable`, `shadcn/scroll-area`, `shadcn/select`, `shadcn/sheet`, `shadcn/sidebar`, `shadcn/slider`, `shadcn/sonner`, `shadcn/switch`, `shadcn/tabs`, `shadcn/textarea`, `shadcn/toggle`, `shadcn/toggle-group`, `shadcn/tooltip`.
- Existing e2e reference files for follow-up tests: `tests/e2e/shadcn-overlay-menu-regressions.test.ts`, `tests/e2e/shadcn-form-collection-regressions.test.ts`, `tests/e2e/shadcn-surface-layout-regressions.test.ts`, and `tests/e2e/docs.test.ts`.
- Focused parity tooling: broad shadcn dry run found 59 parity slots; chart/toast focused dry runs found no slots; tabs workbench dry run resolved; empty workbench dry run reported an unknown case and is recorded as a harness gap.
- QA note: `empty` was visually inspected after a hidden-text detector saw `Page Not Found`; local screenshot evidence shows a normal Empty page, so it is not listed as a defect.
