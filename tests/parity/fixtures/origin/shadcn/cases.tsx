import type * as React from 'react'

import AlertActionExample from '../../../../../repos/ui/apps/v4/examples/base/alert-action'
import AlertBasic from '../../../../../repos/ui/apps/v4/examples/base/alert-basic'
import AlertColors from '../../../../../repos/ui/apps/v4/examples/base/alert-colors'
import AlertDemo from '../../../../../repos/ui/apps/v4/examples/base/alert-demo'
import AlertDestructive from '../../../../../repos/ui/apps/v4/examples/base/alert-destructive'
import { AlertRtl } from '../../../../../repos/ui/apps/v4/examples/base/alert-rtl'
import { BadgeCustomColors } from '../../../../../repos/ui/apps/v4/examples/base/badge-colors'
import BadgeDemo from '../../../../../repos/ui/apps/v4/examples/base/badge-demo'
import { BadgeWithIconLeft } from '../../../../../repos/ui/apps/v4/examples/base/badge-icon'
import { BadgeAsLink } from '../../../../../repos/ui/apps/v4/examples/base/badge-link'
import { BadgeRtl } from '../../../../../repos/ui/apps/v4/examples/base/badge-rtl'
import { BadgeWithSpinner } from '../../../../../repos/ui/apps/v4/examples/base/badge-spinner'
import { BadgeVariants } from '../../../../../repos/ui/apps/v4/examples/base/badge-variants'
import ButtonDefault from '../../../../../repos/ui/apps/v4/examples/base/button-default'
import ButtonDemo from '../../../../../repos/ui/apps/v4/examples/base/button-demo'
import ButtonDestructive from '../../../../../repos/ui/apps/v4/examples/base/button-destructive'
import ButtonGhost from '../../../../../repos/ui/apps/v4/examples/base/button-ghost'
import ButtonIcon from '../../../../../repos/ui/apps/v4/examples/base/button-icon'
import ButtonLink from '../../../../../repos/ui/apps/v4/examples/base/button-link'
import ButtonOutline from '../../../../../repos/ui/apps/v4/examples/base/button-outline'
import ButtonRender from '../../../../../repos/ui/apps/v4/examples/base/button-render'
import ButtonRounded from '../../../../../repos/ui/apps/v4/examples/base/button-rounded'
import { ButtonRtl } from '../../../../../repos/ui/apps/v4/examples/base/button-rtl'
import ButtonSecondary from '../../../../../repos/ui/apps/v4/examples/base/button-secondary'
import ButtonSize from '../../../../../repos/ui/apps/v4/examples/base/button-size'
import ButtonSpinner from '../../../../../repos/ui/apps/v4/examples/base/button-spinner'
import ButtonWithIcon from '../../../../../repos/ui/apps/v4/examples/base/button-with-icon'
import KbdButton from '../../../../../repos/ui/apps/v4/examples/base/kbd-button'
import KbdDemo from '../../../../../repos/ui/apps/v4/examples/base/kbd-demo'
import KbdGroupExample from '../../../../../repos/ui/apps/v4/examples/base/kbd-group'
import KbdInputGroup from '../../../../../repos/ui/apps/v4/examples/base/kbd-input-group'
import { KbdRtl } from '../../../../../repos/ui/apps/v4/examples/base/kbd-rtl'
import KbdTooltip from '../../../../../repos/ui/apps/v4/examples/base/kbd-tooltip'
import NativeSelectDemo from '../../../../../repos/ui/apps/v4/examples/base/native-select-demo'
import { NativeSelectDisabled } from '../../../../../repos/ui/apps/v4/examples/base/native-select-disabled'
import NativeSelectGroups from '../../../../../repos/ui/apps/v4/examples/base/native-select-groups'
import { NativeSelectInvalid } from '../../../../../repos/ui/apps/v4/examples/base/native-select-invalid'
import { NativeSelectRtl } from '../../../../../repos/ui/apps/v4/examples/base/native-select-rtl'
import { ProgressControlled } from '../../../../../repos/ui/apps/v4/examples/base/progress-controlled'
import ProgressDemo from '../../../../../repos/ui/apps/v4/examples/base/progress-demo'
import { ProgressWithLabel } from '../../../../../repos/ui/apps/v4/examples/base/progress-label'
import { ProgressRtl } from '../../../../../repos/ui/apps/v4/examples/base/progress-rtl'
import SeparatorDemo from '../../../../../repos/ui/apps/v4/examples/base/separator-demo'
import { SeparatorList } from '../../../../../repos/ui/apps/v4/examples/base/separator-list'
import { SeparatorMenu } from '../../../../../repos/ui/apps/v4/examples/base/separator-menu'
import { SeparatorRtl } from '../../../../../repos/ui/apps/v4/examples/base/separator-rtl'
import { SeparatorVertical } from '../../../../../repos/ui/apps/v4/examples/base/separator-vertical'
import { SkeletonAvatar } from '../../../../../repos/ui/apps/v4/examples/base/skeleton-avatar'
import { SkeletonCard } from '../../../../../repos/ui/apps/v4/examples/base/skeleton-card'
import { SkeletonDemo } from '../../../../../repos/ui/apps/v4/examples/base/skeleton-demo'
import { SkeletonForm } from '../../../../../repos/ui/apps/v4/examples/base/skeleton-form'
import { SkeletonRtl } from '../../../../../repos/ui/apps/v4/examples/base/skeleton-rtl'
import { SkeletonTable } from '../../../../../repos/ui/apps/v4/examples/base/skeleton-table'
import { SkeletonText } from '../../../../../repos/ui/apps/v4/examples/base/skeleton-text'
import type { ShadcnOriginCaseMetadata } from './case-metadata'
import { shadcnOriginCaseMetadata } from './case-metadata'

export interface ShadcnOriginCase extends ShadcnOriginCaseMetadata {
  readonly Component: () => React.ReactElement
}

const components: Readonly<Record<string, () => React.ReactElement>> = {
  'alert-action': AlertActionExample,
  'alert-basic': AlertBasic,
  'alert-colors': AlertColors,
  'alert-demo': AlertDemo,
  'alert-destructive': AlertDestructive,
  'alert-rtl': AlertRtl,
  'badge-colors': BadgeCustomColors,
  'badge-demo': BadgeDemo,
  'badge-icon': BadgeWithIconLeft,
  'badge-link': BadgeAsLink,
  'badge-rtl': BadgeRtl,
  'badge-spinner': BadgeWithSpinner,
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

export const shadcnOriginCases: ReadonlyArray<ShadcnOriginCase> =
  shadcnOriginCaseMetadata.map(metadata => {
    const Component = components[metadata.id]

    if (Component === undefined) {
      throw new Error(`Missing shadcn origin component for ${metadata.id}`)
    }

    return {
      ...metadata,
      Component,
    }
  })

export const findShadcnOriginCase = (id: string): ShadcnOriginCase => {
  const originCase = shadcnOriginCases.find(candidate => candidate.id === id)

  if (originCase === undefined) {
    throw new Error(`Unknown shadcn origin fixture case: ${id}`)
  }

  return originCase
}
