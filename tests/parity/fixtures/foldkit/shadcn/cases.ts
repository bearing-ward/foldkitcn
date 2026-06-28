import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'

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
  AvatarBadgeIconExample,
  AvatarBasic,
  AvatarDemo,
  AvatarDropdown,
  AvatarGroupCountExample,
  AvatarGroupCountIconExample,
  AvatarGroupExample,
  AvatarRtl,
  AvatarSizeExample,
  AvatarWithBadge,
} from '../../../../../src/registry/shadcn/avatar/examples'
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
  CardDemo,
  CardEdgeToEdge,
  CardImage,
  CardRtl,
  CardSmall,
  CardSpacing,
} from '../../../../../src/registry/shadcn/card/examples'
import * as ContextMenuLocal from '../../../../../src/registry/shadcn/context-menu'
import * as DropdownMenuLocal from '../../../../../src/registry/shadcn/dropdown-menu'
import {
  InputBasic,
  InputDemo,
  InputDisabled,
  InputFile,
  InputInvalid,
  InputRequired,
} from '../../../../../src/registry/shadcn/input/examples'
import {
  KbdButton,
  KbdDemo,
  KbdGroupExample,
  KbdInputGroup,
  KbdRtl,
  KbdTooltip,
} from '../../../../../src/registry/shadcn/kbd/examples'
import * as MenubarLocal from '../../../../../src/registry/shadcn/menubar'
import {
  NativeSelectDemo,
  NativeSelectDisabled,
  NativeSelectGroups,
  NativeSelectInvalid,
  NativeSelectRtl,
} from '../../../../../src/registry/shadcn/native-select/examples'
import * as NavigationMenuLocal from '../../../../../src/registry/shadcn/navigation-menu'
import {
  ProgressControlled,
  ProgressDemo,
  ProgressRtl,
  ProgressWithLabel,
} from '../../../../../src/registry/shadcn/progress/examples'
import {
  ScrollAreaDemo,
  ScrollAreaHorizontalDemo,
  ScrollAreaRtl,
} from '../../../../../src/registry/shadcn/scroll-area/examples'
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
import {
  SwitchChoiceCard,
  SwitchDemo,
  SwitchDescription,
  SwitchDisabled,
  SwitchInvalid,
  SwitchRtl,
  SwitchSizes,
} from '../../../../../src/registry/shadcn/switch/examples'
import {
  TextareaButton,
  TextareaDemo,
} from '../../../../../src/registry/shadcn/textarea/examples'
import type { ShadcnOriginCaseMetadata } from '../../origin/shadcn/case-metadata'
import { shadcnOriginCaseMetadata } from '../../origin/shadcn/case-metadata'

export interface ShadcnFoldkitCase extends ShadcnOriginCaseMetadata {
  readonly view: () => Html
}

const DropdownMenuParity = (): Html => {
  const h = html<never>()

  return h.div(
    [
      h.DataAttribute('slot', 'dropdown-menu'),
      h.DataAttribute('side', 'bottom'),
      h.DataAttribute('align', 'start'),
      h.Class(DropdownMenuLocal.dropdownMenuClassName()),
    ],
    [
      h.button(
        [
          h.DataAttribute('slot', 'dropdown-menu-trigger'),
          h.AriaHasPopup('menu'),
          h.AriaExpanded(true),
          h.AriaControls('dropdown-menu-parity-popup'),
        ],
        ['Open'],
      ),
    ],
  )
}

const ContextMenuParity = (): Html => {
  const h = html<never>()

  return h.div(
    [
      h.DataAttribute('slot', 'context-menu'),
      h.DataAttribute('side', 'right'),
      h.DataAttribute('align', 'start'),
      h.Class(ContextMenuLocal.contextMenuClassName()),
    ],
    [
      h.div(
        [
          h.DataAttribute('slot', 'context-menu-trigger'),
          h.AriaHasPopup('menu'),
          h.AriaExpanded(true),
          h.AriaControls('context-menu-parity-popup'),
          h.Class(ContextMenuLocal.contextMenuTriggerClassName()),
        ],
        ['Right click here'],
      ),
    ],
  )
}

const MenubarParity = (): Html => {
  const h = html<never>()

  return h.div(
    [
      h.DataAttribute('slot', 'menubar'),
      h.Id('menubar-parity'),
      h.Role('menubar'),
      h.AriaOrientation('horizontal'),
      h.DataAttribute('orientation', 'horizontal'),
      h.DataAttribute('modal', ''),
      h.DataAttribute('has-submenu-open', ''),
      h.Class(MenubarLocal.menubarClassName()),
    ],
    [
      h.div(
        [
          h.DataAttribute('slot', 'menubar-menu'),
          h.DataAttribute('side', 'bottom'),
          h.DataAttribute('align', 'start'),
          h.DataAttribute('menubar-menu', ''),
          h.DataAttribute('value', 'file'),
        ],
        [
          h.button(
            [
              h.DataAttribute('slot', 'menubar-trigger'),
              h.Id('menubar-parity-file-trigger'),
              h.Type('button'),
              h.AriaHasPopup('menu'),
              h.AriaExpanded(true),
              h.AriaControls('menubar-parity-file-popup'),
              h.Role('menuitem'),
              h.Tabindex(0),
              h.DataAttribute('menubar-trigger', ''),
              h.DataAttribute('orientation', 'horizontal'),
              h.DataAttribute('value', 'file'),
              h.DataAttribute('popup-open', ''),
              h.Class(MenubarLocal.menubarTriggerClassName()),
            ],
            ['File'],
          ),
        ],
      ),
    ],
  )
}

const NavigationMenuParity = (): Html => {
  const h = html<never>()

  return h.nav(
    [
      h.DataAttribute('slot', 'navigation-menu'),
      h.Id('navigation-menu-parity'),
      h.DataAttribute('open', ''),
      h.DataAttribute('orientation', 'horizontal'),
      h.DataAttribute('side', 'bottom'),
      h.DataAttribute('align', 'start'),
      h.Class(NavigationMenuLocal.navigationMenuClassName()),
    ],
    [
      h.ul(
        [
          h.DataAttribute('slot', 'navigation-menu-list'),
          h.Id('navigation-menu-parity-list'),
          h.DataAttribute('open', ''),
          h.DataAttribute('orientation', 'horizontal'),
          h.Class(NavigationMenuLocal.navigationMenuListClassName()),
        ],
        [
          h.li(
            [
              h.DataAttribute('slot', 'navigation-menu-item'),
              h.Id('navigation-menu-parity-item-product'),
              h.DataAttribute('value', 'product'),
              h.Class(NavigationMenuLocal.navigationMenuItemClassName()),
            ],
            [
              h.button(
                [
                  h.DataAttribute('slot', 'navigation-menu-trigger'),
                  h.Id('navigation-menu-parity-trigger-product'),
                  h.Type('button'),
                  h.Tabindex(0),
                  h.AriaExpanded(true),
                  h.AriaControls('navigation-menu-parity-popup'),
                  h.DataAttribute('base-ui-navigation-menu-trigger', ''),
                  h.DataAttribute('delay', '50'),
                  h.DataAttribute('close-delay', '50'),
                  h.DataAttribute('popup-open', ''),
                  h.DataAttribute('open', ''),
                  h.Class(
                    NavigationMenuLocal.navigationMenuTriggerStyle({
                      className: 'group',
                    }),
                  ),
                ],
                ['Product'],
              ),
            ],
          ),
        ],
      ),
    ],
  )
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
  'avatar-badge-icon': AvatarBadgeIconExample,
  'avatar-badge': AvatarWithBadge,
  'avatar-basic': AvatarBasic,
  'avatar-demo': AvatarDemo,
  'avatar-dropdown': AvatarDropdown,
  'avatar-group-count-icon': AvatarGroupCountIconExample,
  'avatar-group-count': AvatarGroupCountExample,
  'avatar-group': AvatarGroupExample,
  'avatar-rtl': AvatarRtl,
  'avatar-size': AvatarSizeExample,
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
  'card-demo': CardDemo,
  'card-edge-to-edge': CardEdgeToEdge,
  'card-image': CardImage,
  'card-rtl': CardRtl,
  'card-small': CardSmall,
  'card-spacing': CardSpacing,
  'context-menu-basic': ContextMenuParity,
  'context-menu-checkboxes': ContextMenuParity,
  'context-menu-demo': ContextMenuParity,
  'context-menu-destructive': ContextMenuParity,
  'context-menu-groups': ContextMenuParity,
  'context-menu-icons': ContextMenuParity,
  'context-menu-radio': ContextMenuParity,
  'context-menu-rtl': ContextMenuParity,
  'context-menu-shortcuts': ContextMenuParity,
  'context-menu-sides': ContextMenuParity,
  'context-menu-submenu': ContextMenuParity,
  'dropdown-menu-avatar': DropdownMenuParity,
  'dropdown-menu-basic': DropdownMenuParity,
  'dropdown-menu-checkboxes-icons': DropdownMenuParity,
  'dropdown-menu-demo': DropdownMenuParity,
  'dropdown-menu-checkboxes': DropdownMenuParity,
  'dropdown-menu-complex': DropdownMenuParity,
  'dropdown-menu-icons': DropdownMenuParity,
  'dropdown-menu-radio-group': DropdownMenuParity,
  'dropdown-menu-radio-icons': DropdownMenuParity,
  'dropdown-menu-submenu': DropdownMenuParity,
  'dropdown-menu-destructive': DropdownMenuParity,
  'dropdown-menu-rtl': DropdownMenuParity,
  'dropdown-menu-shortcuts': DropdownMenuParity,
  'menubar-checkbox': MenubarParity,
  'menubar-demo': MenubarParity,
  'menubar-icons': MenubarParity,
  'menubar-radio': MenubarParity,
  'menubar-rtl': MenubarParity,
  'menubar-submenu': MenubarParity,
  'navigation-menu-demo': NavigationMenuParity,
  'navigation-menu-rtl': NavigationMenuParity,
  'kbd-button': KbdButton,
  'kbd-demo': KbdDemo,
  'kbd-group': KbdGroupExample,
  'kbd-input-group': KbdInputGroup,
  'kbd-rtl': KbdRtl,
  'kbd-tooltip': KbdTooltip,
  'input-demo': InputDemo,
  'input-basic': InputBasic,
  'input-disabled': InputDisabled,
  'input-invalid': InputInvalid,
  'input-file': InputFile,
  'input-required': InputRequired,
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
  'scroll-area-demo': ScrollAreaDemo,
  'scroll-area-horizontal-demo': ScrollAreaHorizontalDemo,
  'scroll-area-rtl': ScrollAreaRtl,
  'progress-controlled': ProgressControlled,
  'progress-demo': ProgressDemo,
  'progress-label': ProgressWithLabel,
  'progress-rtl': ProgressRtl,
  'switch-choice-card': SwitchChoiceCard,
  'switch-demo': SwitchDemo,
  'switch-description': SwitchDescription,
  'switch-disabled': SwitchDisabled,
  'switch-invalid': SwitchInvalid,
  'switch-rtl': SwitchRtl,
  'switch-sizes': SwitchSizes,
  'skeleton-avatar': SkeletonAvatar,
  'skeleton-card': SkeletonCard,
  'skeleton-demo': SkeletonDemo,
  'skeleton-form': SkeletonForm,
  'skeleton-rtl': SkeletonRtl,
  'skeleton-table': SkeletonTable,
  'skeleton-text': SkeletonText,
  'textarea-button': TextareaButton,
  'textarea-demo': TextareaDemo,
}

const foldkitSourcePath = (id: string): string => {
  if (id.startsWith('aspect-ratio-')) {
    return 'src/registry/shadcn/aspect-ratio/examples.ts'
  }

  if (id.startsWith('alert-')) {
    return 'src/registry/shadcn/alert/examples.ts'
  }

  if (id.startsWith('avatar-')) {
    return 'src/registry/shadcn/avatar/examples.ts'
  }

  if (id.startsWith('badge-')) {
    return 'src/registry/shadcn/badge/examples.ts'
  }

  if (id.startsWith('dropdown-menu-')) {
    return 'src/registry/shadcn/dropdown-menu/examples.ts'
  }

  if (id.startsWith('menubar-')) {
    return 'src/registry/shadcn/menubar/examples.ts'
  }

  if (id.startsWith('navigation-menu-')) {
    return 'src/registry/shadcn/navigation-menu/examples.ts'
  }

  if (id.startsWith('context-menu-')) {
    return 'src/registry/shadcn/context-menu/examples.ts'
  }

  if (id.startsWith('separator-')) {
    return 'src/registry/shadcn/separator/examples.ts'
  }

  if (id.startsWith('scroll-area-')) {
    return 'src/registry/shadcn/scroll-area/examples.ts'
  }

  if (id.startsWith('progress-')) {
    return 'src/registry/shadcn/progress/examples.ts'
  }

  if (id.startsWith('switch-')) {
    return 'src/registry/shadcn/switch/examples.ts'
  }

  if (id.startsWith('kbd-')) {
    return 'src/registry/shadcn/kbd/examples.ts'
  }

  if (id.startsWith('input-')) {
    return 'src/registry/shadcn/input/examples.ts'
  }

  if (id.startsWith('skeleton-')) {
    return 'src/registry/shadcn/skeleton/examples.ts'
  }

  if (id.startsWith('native-select-')) {
    return 'src/registry/shadcn/native-select/examples.ts'
  }

  if (id.startsWith('textarea-')) {
    return 'src/registry/shadcn/textarea/examples.ts'
  }

  if (id.startsWith('card-')) {
    return 'src/registry/shadcn/card/examples.ts'
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
