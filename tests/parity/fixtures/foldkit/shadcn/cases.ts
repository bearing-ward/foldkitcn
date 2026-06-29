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
  BreadcrumbBasic,
  BreadcrumbDemo,
  BreadcrumbDropdown,
  BreadcrumbEllipsisDemo,
  BreadcrumbLinkDemo,
  BreadcrumbRtl,
  BreadcrumbSeparatorDemo,
} from '../../../../../src/registry/shadcn/breadcrumb/examples'
import {
  ButtonGroupDemo,
  ButtonGroupDropdown,
  ButtonGroupInput,
  ButtonGroupOrientation,
  ButtonGroupPopover,
  ButtonGroupRtl,
  ButtonGroupSelect,
  ButtonGroupSeparatorDemo,
  ButtonGroupSize,
  ButtonGroupSplit,
} from '../../../../../src/registry/shadcn/button-group/examples'
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
  InputGroupBasic,
  InputGroupBlockEnd,
  InputGroupBlockStart,
  InputGroupButtonGroup,
  InputGroupDemo,
  InputGroupDropdown,
  InputGroupIcon,
  InputGroupInCard,
  InputGroupInlineEnd,
  InputGroupInlineStart,
  InputGroupKbd,
  InputGroupLabel,
  InputGroupRtl,
  InputGroupSpinner,
  InputGroupTextExample,
  InputGroupTextareaExample,
  InputGroupWithButtons,
  InputGroupWithKbd,
} from '../../../../../src/registry/shadcn/input-group/examples'
import {
  InputBasic,
  InputDemo,
  InputDisabled,
  InputFile,
  InputInvalid,
  InputRequired,
} from '../../../../../src/registry/shadcn/input/examples'
import {
  ItemAvatar,
  ItemDemo,
  ItemDropdown,
  ItemGroupExample,
  ItemHeaderDemo,
  ItemIcon,
  ItemImage,
  ItemLink,
  ItemRtl,
  ItemSizeDemo,
  ItemVariant,
} from '../../../../../src/registry/shadcn/item/examples'
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
  PaginationDemo,
  PaginationIconsOnly,
  PaginationRtl,
  PaginationSimple,
} from '../../../../../src/registry/shadcn/pagination/examples'
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
  SpinnerBadge,
  SpinnerButton,
  SpinnerCustom,
  SpinnerDemo,
  SpinnerInputGroup,
  SpinnerRtl,
  SpinnerSize,
} from '../../../../../src/registry/shadcn/spinner/examples'
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
  TableActions,
  TableDemo,
  TableFooterExample,
  TableRtl,
} from '../../../../../src/registry/shadcn/table/examples'
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
  'button-group-demo': ButtonGroupDemo,
  'button-group-dropdown': ButtonGroupDropdown,
  'button-group-input': ButtonGroupInput,
  'button-group-orientation': ButtonGroupOrientation,
  'button-group-popover': ButtonGroupPopover,
  'button-group-rtl': ButtonGroupRtl,
  'button-group-select': ButtonGroupSelect,
  'button-group-separator': ButtonGroupSeparatorDemo,
  'button-group-size': ButtonGroupSize,
  'button-group-split': ButtonGroupSplit,
  'card-demo': CardDemo,
  'card-edge-to-edge': CardEdgeToEdge,
  'card-image': CardImage,
  'card-rtl': CardRtl,
  'card-small': CardSmall,
  'card-spacing': CardSpacing,
  'item-avatar': ItemAvatar,
  'item-demo': ItemDemo,
  'item-dropdown': ItemDropdown,
  'item-group': ItemGroupExample,
  'item-header': ItemHeaderDemo,
  'item-icon': ItemIcon,
  'item-image': ItemImage,
  'item-link': ItemLink,
  'item-rtl': ItemRtl,
  'item-size': ItemSizeDemo,
  'item-variant': ItemVariant,
  'breadcrumb-basic': BreadcrumbBasic,
  'breadcrumb-demo': BreadcrumbDemo,
  'breadcrumb-dropdown': BreadcrumbDropdown,
  'breadcrumb-ellipsis': BreadcrumbEllipsisDemo,
  'breadcrumb-link': BreadcrumbLinkDemo,
  'breadcrumb-rtl': BreadcrumbRtl,
  'breadcrumb-separator': BreadcrumbSeparatorDemo,
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
  'input-group-demo': InputGroupDemo,
  'input-group-basic': InputGroupBasic,
  'input-group-inline-start': InputGroupInlineStart,
  'input-group-inline-end': InputGroupInlineEnd,
  'input-group-block-start': InputGroupBlockStart,
  'input-group-block-end': InputGroupBlockEnd,
  'input-group-with-buttons': InputGroupWithButtons,
  'input-group-button-group': InputGroupButtonGroup,
  'input-group-dropdown': InputGroupDropdown,
  'input-group-icon': InputGroupIcon,
  'input-group-kbd': InputGroupKbd,
  'input-group-label': InputGroupLabel,
  'input-group-text': InputGroupTextExample,
  'input-group-textarea': InputGroupTextareaExample,
  'input-group-in-card': InputGroupInCard,
  'input-group-with-kbd': InputGroupWithKbd,
  'input-group-spinner': InputGroupSpinner,
  'input-group-rtl': InputGroupRtl,
  'spinner-demo': SpinnerDemo,
  'spinner-badge': SpinnerBadge,
  'spinner-button': SpinnerButton,
  'spinner-custom': SpinnerCustom,
  'spinner-input-group': SpinnerInputGroup,
  'spinner-rtl': SpinnerRtl,
  'spinner-size': SpinnerSize,
  'native-select-demo': NativeSelectDemo,
  'native-select-disabled': NativeSelectDisabled,
  'native-select-groups': NativeSelectGroups,
  'native-select-invalid': NativeSelectInvalid,
  'native-select-rtl': NativeSelectRtl,
  'pagination-demo': PaginationDemo,
  'pagination-icons-only': PaginationIconsOnly,
  'pagination-rtl': PaginationRtl,
  'pagination-simple': PaginationSimple,
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
  'table-actions': TableActions,
  'table-demo': TableDemo,
  'table-footer': TableFooterExample,
  'table-rtl': TableRtl,
  'textarea-button': TextareaButton,
  'textarea-demo': TextareaDemo,
}

const foldkitSourcePrefixes: ReadonlyArray<readonly [string, string]> = [
  ['aspect-ratio-', 'src/registry/shadcn/aspect-ratio/examples.ts'],
  ['alert-', 'src/registry/shadcn/alert/examples.ts'],
  ['avatar-', 'src/registry/shadcn/avatar/examples.ts'],
  ['badge-', 'src/registry/shadcn/badge/examples.ts'],
  ['button-group-', 'src/registry/shadcn/button-group/examples.ts'],
  ['dropdown-menu-', 'src/registry/shadcn/dropdown-menu/examples.ts'],
  ['menubar-', 'src/registry/shadcn/menubar/examples.ts'],
  ['navigation-menu-', 'src/registry/shadcn/navigation-menu/examples.ts'],
  ['context-menu-', 'src/registry/shadcn/context-menu/examples.ts'],
  ['separator-', 'src/registry/shadcn/separator/examples.ts'],
  ['scroll-area-', 'src/registry/shadcn/scroll-area/examples.ts'],
  ['progress-', 'src/registry/shadcn/progress/examples.ts'],
  ['switch-', 'src/registry/shadcn/switch/examples.ts'],
  ['kbd-', 'src/registry/shadcn/kbd/examples.ts'],
  ['input-group-', 'src/registry/shadcn/input-group/examples.ts'],
  ['input-', 'src/registry/shadcn/input/examples.ts'],
  ['spinner-', 'src/registry/shadcn/spinner/examples.ts'],
  ['skeleton-', 'src/registry/shadcn/skeleton/examples.ts'],
  ['table-', 'src/registry/shadcn/table/examples.ts'],
  ['native-select-', 'src/registry/shadcn/native-select/examples.ts'],
  ['pagination-', 'src/registry/shadcn/pagination/examples.ts'],
  ['textarea-', 'src/registry/shadcn/textarea/examples.ts'],
  ['card-', 'src/registry/shadcn/card/examples.ts'],
  ['item-', 'src/registry/shadcn/item/examples.ts'],
  ['breadcrumb-', 'src/registry/shadcn/breadcrumb/examples.ts'],
]

const foldkitSourcePath = (id: string): string =>
  foldkitSourcePrefixes.find(([prefix]) => id.startsWith(prefix))?.[1] ??
  'src/registry/shadcn/button/examples.ts'

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
