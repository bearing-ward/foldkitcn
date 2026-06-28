import { Option, pipe } from 'effect'
import type { Html } from 'foldkit/html'

import type { ExampleDocsArtifact } from './registry/schema'
import {
  ButtonDefault,
  ButtonDemo,
  ButtonDestructive,
  ButtonGhost,
  ButtonIcon,
  ButtonLink,
  ButtonOutline,
  ButtonRender,
  ButtonRounded,
  ButtonRtl,
  ButtonSecondary,
  ButtonSize,
  ButtonSpinner,
  ButtonWithIcon,
} from './registry/shadcn/button/examples'

export type StaticExampleView = () => Html

const liveExampleKey = (
  componentItemId: string,
  previewExportName: string,
): string => `${componentItemId}#${previewExportName}`

const liveExampleViews: Readonly<Record<string, StaticExampleView>> = {
  [liveExampleKey('shadcn/button', 'ButtonDefault')]: ButtonDefault,
  [liveExampleKey('shadcn/button', 'ButtonDemo')]: ButtonDemo,
  [liveExampleKey('shadcn/button', 'ButtonOutline')]: ButtonOutline,
  [liveExampleKey('shadcn/button', 'ButtonSecondary')]: ButtonSecondary,
  [liveExampleKey('shadcn/button', 'ButtonGhost')]: ButtonGhost,
  [liveExampleKey('shadcn/button', 'ButtonDestructive')]: ButtonDestructive,
  [liveExampleKey('shadcn/button', 'ButtonLink')]: ButtonLink,
  [liveExampleKey('shadcn/button', 'ButtonIcon')]: ButtonIcon,
  [liveExampleKey('shadcn/button', 'ButtonWithIcon')]: ButtonWithIcon,
  [liveExampleKey('shadcn/button', 'ButtonSize')]: ButtonSize,
  [liveExampleKey('shadcn/button', 'ButtonRounded')]: ButtonRounded,
  [liveExampleKey('shadcn/button', 'ButtonSpinner')]: ButtonSpinner,
  [liveExampleKey('shadcn/button', 'ButtonRender')]: ButtonRender,
  [liveExampleKey('shadcn/button', 'ButtonRtl')]: ButtonRtl,
}

export const liveExampleViewFor = (
  example: ExampleDocsArtifact,
): Option.Option<StaticExampleView> => {
  if (example.previewStatus !== 'live-ready') {
    return Option.none()
  }

  return pipe(
    example.previewExportName,
    Option.flatMap(previewExportName =>
      Option.fromNullishOr(
        liveExampleViews[
          liveExampleKey(example.componentItemId, previewExportName)
        ],
      ),
    ),
  )
}
