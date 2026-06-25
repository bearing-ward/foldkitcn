import type { Html } from 'foldkit/html'

import {
  AlertActionExample,
  AlertBasic,
  AlertColors,
  AlertDemo,
  AlertDestructive,
  AlertRtl,
} from '../../../../../src/registry/shadcn/alert/examples'
import {
  AspectRatioDemo,
  AspectRatioPortrait,
  AspectRatioRtl,
  AspectRatioSquare,
} from '../../../../../src/registry/shadcn/aspect-ratio/examples'
import {
  BadgeColors,
  BadgeDemo,
  BadgeIcon,
  BadgeLink,
  BadgeRtl,
  BadgeSpinner,
  BadgeVariants,
} from '../../../../../src/registry/shadcn/badge/examples'
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
} from '../../../../../src/registry/shadcn/button/examples'
import {
  KbdButton,
  KbdDemo,
  KbdGroupExample,
  KbdInputGroup,
  KbdRtl,
  KbdTooltip,
} from '../../../../../src/registry/shadcn/kbd/examples'
import {
  NativeSelectDemo,
  NativeSelectDisabled,
  NativeSelectGroups,
  NativeSelectInvalid,
  NativeSelectRtl,
} from '../../../../../src/registry/shadcn/native-select/examples'
import {
  ProgressControlled,
  ProgressDemo,
  ProgressRtl,
  ProgressWithLabel,
} from '../../../../../src/registry/shadcn/progress/examples'
import {
  SeparatorDemo,
  SeparatorList,
  SeparatorMenu,
  SeparatorRtl,
  SeparatorVertical,
} from '../../../../../src/registry/shadcn/separator/examples'
import {
  SkeletonAvatar,
  SkeletonCard,
  SkeletonDemo,
  SkeletonForm,
  SkeletonRtl,
  SkeletonTable,
  SkeletonText,
} from '../../../../../src/registry/shadcn/skeleton/examples'
import type { ShadcnOriginCaseMetadata } from '../../origin/shadcn/case-metadata'
import { shadcnOriginCaseMetadata } from '../../origin/shadcn/case-metadata'

export interface ShadcnFoldkitCase extends ShadcnOriginCaseMetadata {
  readonly view: () => Html
}

const components: Readonly<Record<string, () => Html>> = {
  'aspect-ratio-demo': AspectRatioDemo,
  'aspect-ratio-portrait': AspectRatioPortrait,
  'aspect-ratio-rtl': AspectRatioRtl,
  'aspect-ratio-square': AspectRatioSquare,
  'alert-action': AlertActionExample,
  'alert-basic': AlertBasic,
  'alert-colors': AlertColors,
  'alert-demo': AlertDemo,
  'alert-destructive': AlertDestructive,
  'alert-rtl': AlertRtl,
  'badge-colors': BadgeColors,
  'badge-demo': BadgeDemo,
  'badge-icon': BadgeIcon,
  'badge-link': BadgeLink,
  'badge-rtl': BadgeRtl,
  'badge-spinner': BadgeSpinner,
  'badge-variants': BadgeVariants,
  'button-default': ButtonDefault,
  'button-demo': ButtonDemo,
  'button-outline': ButtonOutline,
  'button-secondary': ButtonSecondary,
  'button-ghost': ButtonGhost,
  'button-destructive': ButtonDestructive,
  'button-link': ButtonLink,
  'button-icon': ButtonIcon,
  'button-with-icon': ButtonWithIcon,
  'button-size': ButtonSize,
  'button-rounded': ButtonRounded,
  'button-spinner': ButtonSpinner,
  'button-render': ButtonRender,
  'button-rtl': ButtonRtl,
  'kbd-button': KbdButton,
  'kbd-demo': KbdDemo,
  'kbd-group': KbdGroupExample,
  'kbd-input-group': KbdInputGroup,
  'kbd-rtl': KbdRtl,
  'kbd-tooltip': KbdTooltip,
  'native-select-demo': NativeSelectDemo,
  'native-select-disabled': NativeSelectDisabled,
  'native-select-groups': NativeSelectGroups,
  'native-select-invalid': NativeSelectInvalid,
  'native-select-rtl': NativeSelectRtl,
  'separator-demo': SeparatorDemo,
  'separator-list': SeparatorList,
  'separator-menu': SeparatorMenu,
  'separator-vertical': SeparatorVertical,
  'separator-rtl': SeparatorRtl,
  'progress-controlled': ProgressControlled,
  'progress-demo': ProgressDemo,
  'progress-label': ProgressWithLabel,
  'progress-rtl': ProgressRtl,
  'skeleton-avatar': SkeletonAvatar,
  'skeleton-card': SkeletonCard,
  'skeleton-demo': SkeletonDemo,
  'skeleton-form': SkeletonForm,
  'skeleton-rtl': SkeletonRtl,
  'skeleton-table': SkeletonTable,
  'skeleton-text': SkeletonText,
}

const foldkitSourcePath = (id: string): string => {
  if (id.startsWith('aspect-ratio-')) {
    return 'src/registry/shadcn/aspect-ratio/examples.ts'
  }

  if (id.startsWith('alert-')) {
    return 'src/registry/shadcn/alert/examples.ts'
  }

  if (id.startsWith('badge-')) {
    return 'src/registry/shadcn/badge/examples.ts'
  }

  if (id.startsWith('separator-')) {
    return 'src/registry/shadcn/separator/examples.ts'
  }

  if (id.startsWith('progress-')) {
    return 'src/registry/shadcn/progress/examples.ts'
  }

  if (id.startsWith('kbd-')) {
    return 'src/registry/shadcn/kbd/examples.ts'
  }

  if (id.startsWith('skeleton-')) {
    return 'src/registry/shadcn/skeleton/examples.ts'
  }

  if (id.startsWith('native-select-')) {
    return 'src/registry/shadcn/native-select/examples.ts'
  }

  return 'src/registry/shadcn/button/examples.ts'
}

export const shadcnFoldkitCases: ReadonlyArray<ShadcnFoldkitCase> =
  shadcnOriginCaseMetadata.map(metadata => {
    const view = components[metadata.id]

    if (view === undefined) {
      throw new Error(`Missing shadcn Foldkit component for ${metadata.id}`)
    }

    return {
      ...metadata,
      originFilePath: foldkitSourcePath(metadata.id),
      view,
    }
  })

export const findShadcnFoldkitCase = (id: string): ShadcnFoldkitCase => {
  const foldkitCase = shadcnFoldkitCases.find(candidate => candidate.id === id)

  if (foldkitCase === undefined) {
    throw new Error(`Unknown shadcn Foldkit fixture case: ${id}`)
  }

  return foldkitCase
}
