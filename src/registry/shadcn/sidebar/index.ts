import { Schema as S } from 'effect'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { cn } from '../../../utils/cn'
import * as Button from '../button'
import * as Input from '../input'
import * as Separator from '../separator'
import * as Sheet from '../sheet'
import * as Skeleton from '../skeleton'

// MODEL

type Child = Html | string

export const SidebarSide = S.Union([S.Literal('left'), S.Literal('right')])
export type SidebarSide = typeof SidebarSide.Type

export const sidebarSideValues: ReadonlyArray<SidebarSide> = ['left', 'right']

export const SidebarVariant = S.Union([
  S.Literal('sidebar'),
  S.Literal('floating'),
  S.Literal('inset'),
])
export type SidebarVariant = typeof SidebarVariant.Type

export const sidebarVariantValues: ReadonlyArray<SidebarVariant> = [
  'sidebar',
  'floating',
  'inset',
]

export const SidebarCollapsible = S.Union([
  S.Literal('offcanvas'),
  S.Literal('icon'),
  S.Literal('none'),
])
export type SidebarCollapsible = typeof SidebarCollapsible.Type

export const sidebarCollapsibleValues: ReadonlyArray<SidebarCollapsible> = [
  'offcanvas',
  'icon',
  'none',
]

export const SidebarStyleOptions = S.Struct({
  className: S.optional(S.String),
  dir: S.optional(S.String),
  style: S.optional(S.Record(S.String, S.String)),
})
export type SidebarStyleOptions = typeof SidebarStyleOptions.Type

export const SidebarPanelStyleOptions = S.Struct({
  className: S.optional(S.String),
})
export type SidebarPanelStyleOptions = typeof SidebarPanelStyleOptions.Type

export const SidebarTriggerStyleOptions = S.Struct({
  className: S.optional(S.String),
})
export type SidebarTriggerStyleOptions = typeof SidebarTriggerStyleOptions.Type

export const SidebarRailStyleOptions = S.Struct({
  className: S.optional(S.String),
  dir: S.optional(S.String),
})
export type SidebarRailStyleOptions = typeof SidebarRailStyleOptions.Type

export const SidebarInsetStyleOptions = S.Struct({
  className: S.optional(S.String),
  dir: S.optional(S.String),
})
export type SidebarInsetStyleOptions = typeof SidebarInsetStyleOptions.Type

export const SidebarHeaderStyleOptions = S.Struct({
  className: S.optional(S.String),
})
export type SidebarHeaderStyleOptions = typeof SidebarHeaderStyleOptions.Type

export const SidebarFooterStyleOptions = S.Struct({
  className: S.optional(S.String),
})
export type SidebarFooterStyleOptions = typeof SidebarFooterStyleOptions.Type

export const SidebarSeparatorStyleOptions = S.Struct({
  className: S.optional(S.String),
  dir: S.optional(S.String),
})
export type SidebarSeparatorStyleOptions =
  typeof SidebarSeparatorStyleOptions.Type

export const SidebarContentStyleOptions = S.Struct({
  className: S.optional(S.String),
  dir: S.optional(S.String),
})
export type SidebarContentStyleOptions = typeof SidebarContentStyleOptions.Type

export const SidebarGroupStyleOptions = S.Struct({
  className: S.optional(S.String),
})
export type SidebarGroupStyleOptions = typeof SidebarGroupStyleOptions.Type

export const SidebarGroupLabelStyleOptions = S.Struct({
  className: S.optional(S.String),
})
export type SidebarGroupLabelStyleOptions =
  typeof SidebarGroupLabelStyleOptions.Type

export const SidebarGroupActionStyleOptions = S.Struct({
  className: S.optional(S.String),
  dir: S.optional(S.String),
})
export type SidebarGroupActionStyleOptions =
  typeof SidebarGroupActionStyleOptions.Type

export const SidebarGroupContentStyleOptions = S.Struct({
  className: S.optional(S.String),
})
export type SidebarGroupContentStyleOptions =
  typeof SidebarGroupContentStyleOptions.Type

export const SidebarMenuStyleOptions = S.Struct({
  className: S.optional(S.String),
})
export type SidebarMenuStyleOptions = typeof SidebarMenuStyleOptions.Type

export const SidebarMenuItemStyleOptions = S.Struct({
  className: S.optional(S.String),
})
export type SidebarMenuItemStyleOptions =
  typeof SidebarMenuItemStyleOptions.Type

export const SidebarMenuButtonVariant = S.Union([
  S.Literal('default'),
  S.Literal('outline'),
])
export type SidebarMenuButtonVariant = typeof SidebarMenuButtonVariant.Type

export const sidebarMenuButtonVariantValues: ReadonlyArray<SidebarMenuButtonVariant> =
  ['default', 'outline']

export const SidebarMenuButtonSize = S.Union([
  S.Literal('default'),
  S.Literal('sm'),
  S.Literal('lg'),
])
export type SidebarMenuButtonSize = typeof SidebarMenuButtonSize.Type

export const sidebarMenuButtonSizeValues: ReadonlyArray<SidebarMenuButtonSize> =
  ['default', 'sm', 'lg']

export const SidebarMenuButtonStyleOptions = S.Struct({
  className: S.optional(S.String),
  dir: S.optional(S.String),
  variant: S.optional(SidebarMenuButtonVariant),
  size: S.optional(SidebarMenuButtonSize),
  isActive: S.optional(S.Boolean),
})
export type SidebarMenuButtonStyleOptions =
  typeof SidebarMenuButtonStyleOptions.Type

export const SidebarMenuActionStyleOptions = S.Struct({
  className: S.optional(S.String),
  dir: S.optional(S.String),
  showOnHover: S.optional(S.Boolean),
})
export type SidebarMenuActionStyleOptions =
  typeof SidebarMenuActionStyleOptions.Type

export const SidebarMenuBadgeStyleOptions = S.Struct({
  className: S.optional(S.String),
  dir: S.optional(S.String),
})
export type SidebarMenuBadgeStyleOptions =
  typeof SidebarMenuBadgeStyleOptions.Type

export const SidebarMenuSkeletonStyleOptions = S.Struct({
  className: S.optional(S.String),
  showIcon: S.optional(S.Boolean),
  width: S.optional(S.String),
})
export type SidebarMenuSkeletonStyleOptions =
  typeof SidebarMenuSkeletonStyleOptions.Type

export const SidebarMenuSubStyleOptions = S.Struct({
  className: S.optional(S.String),
  dir: S.optional(S.String),
})
export type SidebarMenuSubStyleOptions = typeof SidebarMenuSubStyleOptions.Type

export const SidebarMenuSubItemStyleOptions = S.Struct({
  className: S.optional(S.String),
})
export type SidebarMenuSubItemStyleOptions =
  typeof SidebarMenuSubItemStyleOptions.Type

export const SidebarMenuSubButtonStyleOptions = S.Struct({
  className: S.optional(S.String),
  dir: S.optional(S.String),
  size: S.optional(S.Union([S.Literal('sm'), S.Literal('md')])),
  isActive: S.optional(S.Boolean),
})
export type SidebarMenuSubButtonStyleOptions =
  typeof SidebarMenuSubButtonStyleOptions.Type

export const SIDEBAR_WIDTH = '16rem'
export const SIDEBAR_WIDTH_MOBILE = '18rem'
export const SIDEBAR_WIDTH_ICON = '3rem'

// VIEW

const sidebarProviderBaseClassName =
  'group/sidebar-wrapper flex min-h-svh w-full has-data-[variant=inset]:bg-sidebar'

const sidebarDesktopBaseClassName =
  'group peer hidden text-sidebar-foreground md:block'

const sidebarGapBaseClassName =
  'relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear group-data-[collapsible=offcanvas]:w-0 group-data-[side=right]:rotate-180 group-data-[collapsible=icon]:w-(--sidebar-width-icon)'

const sidebarGapFloatingBaseClassName =
  'relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear group-data-[collapsible=offcanvas]:w-0 group-data-[side=right]:rotate-180 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]'

const sidebarContainerBaseClassName =
  'fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear data-[side=left]:left-0 data-[side=left]:group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)] data-[side=right]:right-0 data-[side=right]:group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)] md:flex group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l'

const sidebarContainerFloatingBaseClassName =
  'fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear data-[side=left]:left-0 data-[side=left]:group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)] data-[side=right]:right-0 data-[side=right]:group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)] md:flex p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]'

const sidebarContainerInsetBaseClassName =
  'fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear data-[side=left]:left-0 data-[side=left]:group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)] data-[side=right]:right-0 data-[side=right]:group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)] md:flex p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]'

const sidebarInnerBaseClassName =
  'flex size-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:shadow-sm group-data-[variant=floating]:ring-1 group-data-[variant=floating]:ring-sidebar-border'

const sidebarMobileBaseClassName =
  'w-(--sidebar-width) bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden'

const sidebarMobileContentBaseClassName =
  'flex h-full w-full flex-col bg-sidebar text-sidebar-foreground'

const sidebarInsetBaseClassName =
  'relative flex w-full flex-1 flex-col bg-background md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2'
const sidebarInsetRtlBaseClassName =
  'relative flex w-full flex-1 flex-col bg-background md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ms-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ms-2'

const sidebarRailBaseClassName =
  'absolute inset-y-0 z-20 hidden w-4 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:start-1/2 after:w-[2px] hover:after:bg-sidebar-border sm:flex ltr:-translate-x-1/2 rtl:-translate-x-1/2 in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize [[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full hover:group-data-[collapsible=offcanvas]:bg-sidebar [[data-side=left][data-collapsible=offcanvas]_&]:-right-2 [[data-side=right][data-collapsible=offcanvas]_&]:-left-2'
const sidebarRailRtlBaseClassName =
  'absolute inset-y-0 z-20 hidden w-4 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:start-1/2 after:w-[2px] hover:after:bg-sidebar-border sm:flex ltr:-translate-x-1/2 rtl:-translate-x-1/2 in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize rtl:in-data-[side=left]:cursor-e-resize rtl:in-data-[side=right]:cursor-w-resize [[data-side=left][data-state=collapsed]_&]:cursor-e-resize rtl:[[data-side=left][data-state=collapsed]_&]:cursor-w-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize rtl:[[data-side=right][data-state=collapsed]_&]:cursor-e-resize group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:start-full hover:group-data-[collapsible=offcanvas]:bg-sidebar rtl:group-data-[collapsible=offcanvas]:-translate-x-0 [[data-side=left][data-collapsible=offcanvas]_&]:-end-2 [[data-side=right][data-collapsible=offcanvas]_&]:-start-2'

const sidebarHeaderBaseClassName = 'flex flex-col gap-2 p-2'
const sidebarFooterBaseClassName = 'flex flex-col gap-2 p-2'
const sidebarSeparatorBaseClassName = 'mx-2 w-auto bg-sidebar-border'
const sidebarContentBaseClassName =
  'no-scrollbar flex min-h-0 flex-1 flex-col gap-0 overflow-auto group-data-[collapsible=icon]:overflow-hidden'
const sidebarGroupBaseClassName = 'relative flex w-full min-w-0 flex-col p-2'
const sidebarGroupLabelBaseClassName =
  'flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 ring-sidebar-ring outline-hidden transition-[margin,opacity] duration-200 ease-linear group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0 focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0'
const sidebarGroupActionBaseClassName =
  'absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground ring-sidebar-ring outline-hidden transition-transform group-data-[collapsible=icon]:hidden after:absolute after:-inset-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 md:after:hidden [&>svg]:size-4 [&>svg]:shrink-0'
const sidebarGroupActionRtlBaseClassName =
  'absolute end-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground ring-sidebar-ring outline-hidden transition-transform group-data-[collapsible=icon]:hidden after:absolute after:-inset-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 md:after:hidden [&>svg]:size-4 [&>svg]:shrink-0'
const sidebarGroupContentBaseClassName = 'w-full text-sm'
const sidebarMenuBaseClassName = 'flex w-full min-w-0 flex-col gap-0'
const sidebarMenuItemBaseClassName = 'group/menu-item relative'
const sidebarMenuButtonBaseClassName =
  'peer/menu-button group/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left ring-sidebar-ring outline-hidden transition-[width,height,padding] group-has-data-[sidebar=menu-action]/menu-item:pr-8 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-open:hover:bg-sidebar-accent data-open:hover:text-sidebar-accent-foreground data-active:bg-sidebar-accent data-active:font-medium data-active:text-sidebar-accent-foreground [&_svg]:size-4 [&_svg]:shrink-0 [&>span:last-child]:truncate hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-8 text-sm'
const sidebarMenuButtonOutlineBaseClassName =
  'peer/menu-button group/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm ring-sidebar-ring outline-hidden transition-[width,height,padding] group-has-data-[sidebar=menu-action]/menu-item:pr-8 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! bg-background shadow-[0_0_0_1px_var(--sidebar-border)] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_var(--sidebar-accent)] focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-open:hover:bg-sidebar-accent data-open:hover:text-sidebar-accent-foreground data-active:bg-sidebar-accent data-active:font-medium data-active:text-sidebar-accent-foreground [&_svg]:size-4 [&_svg]:shrink-0 [&>span:last-child]:truncate'
const sidebarMenuButtonRtlBaseClassName =
  'peer/menu-button group/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-start text-sm ring-sidebar-ring outline-hidden transition-[width,height,padding] group-has-data-[sidebar=menu-action]/menu-item:pe-8 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-open:hover:bg-sidebar-accent data-open:hover:text-sidebar-accent-foreground data-active:bg-sidebar-accent data-active:font-medium data-active:text-sidebar-accent-foreground [&_svg]:size-4 [&_svg]:shrink-0 [&>span:last-child]:truncate hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
const sidebarMenuButtonRtlOutlineBaseClassName =
  'peer/menu-button group/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-start text-sm ring-sidebar-ring outline-hidden transition-[width,height,padding] group-has-data-[sidebar=menu-action]/menu-item:pe-8 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! bg-background shadow-[0_0_0_1px_var(--sidebar-border)] focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-open:hover:bg-sidebar-accent data-open:hover:text-sidebar-accent-foreground data-active:bg-sidebar-accent data-active:font-medium data-active:text-sidebar-accent-foreground [&_svg]:size-4 [&_svg]:shrink-0 [&>span:last-child]:truncate hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_var(--sidebar-accent)]'
const sidebarMenuButtonDefaultSizeClassName = 'h-8 text-sm'
const sidebarMenuButtonSmallSizeClassName = 'h-7 text-xs'
const sidebarMenuButtonLargeSizeClassName =
  'h-12 text-sm group-data-[collapsible=icon]:p-0!'
const sidebarMenuActionBaseClassName =
  'absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground ring-sidebar-ring outline-hidden transition-transform group-data-[collapsible=icon]:hidden peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[size=default]/menu-button:top-1.5 peer-data-[size=lg]/menu-button:top-2.5 peer-data-[size=sm]/menu-button:top-1 after:absolute after:-inset-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 md:after:hidden [&>svg]:size-4 [&>svg]:shrink-0'
const sidebarMenuActionRtlBaseClassName =
  'absolute end-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground ring-sidebar-ring outline-hidden transition-transform group-data-[collapsible=icon]:hidden peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[size=default]/menu-button:top-1.5 peer-data-[size=lg]/menu-button:top-2.5 peer-data-[size=sm]/menu-button:top-1 after:absolute after:-inset-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 md:after:hidden [&>svg]:size-4 [&>svg]:shrink-0'
const sidebarMenuActionShowOnHoverClassName =
  'group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 peer-data-active/menu-button:text-sidebar-accent-foreground aria-expanded:opacity-100 md:opacity-0'
const sidebarMenuBadgeBaseClassName =
  'pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium text-sidebar-foreground tabular-nums select-none group-data-[collapsible=icon]:hidden peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[size=default]/menu-button:top-1.5 peer-data-[size=lg]/menu-button:top-2.5 peer-data-[size=sm]/menu-button:top-1 peer-data-active/menu-button:text-sidebar-accent-foreground'
const sidebarMenuBadgeRtlBaseClassName =
  'pointer-events-none absolute end-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium text-sidebar-foreground tabular-nums select-none group-data-[collapsible=icon]:hidden peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[size=default]/menu-button:top-1.5 peer-data-[size=lg]/menu-button:top-2.5 peer-data-[size=sm]/menu-button:top-1 peer-data-active/menu-button:text-sidebar-accent-foreground'
const sidebarMenuSkeletonBaseClassName =
  'flex h-8 items-center gap-2 rounded-md px-2'
const sidebarMenuSubBaseClassName =
  'mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5 group-data-[collapsible=icon]:hidden'
const sidebarMenuSubRtlBaseClassName =
  'mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-s border-sidebar-border px-2.5 py-0.5 group-data-[collapsible=icon]:hidden rtl:-translate-x-px'
const sidebarMenuSubItemBaseClassName = 'group/menu-sub-item relative'
const sidebarMenuSubButtonBaseClassName =
  'flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground ring-sidebar-ring outline-hidden group-data-[collapsible=icon]:hidden hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[size=md]:text-sm data-[size=sm]:text-xs data-active:bg-sidebar-accent data-active:text-sidebar-accent-foreground [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground'
const sidebarMenuSubButtonRtlBaseClassName =
  'flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground ring-sidebar-ring outline-hidden group-data-[collapsible=icon]:hidden hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[size=md]:text-sm data-[size=sm]:text-xs rtl:translate-x-px data-active:bg-sidebar-accent data-active:text-sidebar-accent-foreground [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground'
const sidebarInputBaseClassName = 'h-8 w-full bg-background shadow-none'

export const sidebarProviderClassName = ({
  className,
}: Pick<SidebarStyleOptions, 'className'> = {}): string =>
  cn(sidebarProviderBaseClassName, className)

export const sidebarClassName = ({
  className,
}: Pick<SidebarStyleOptions, 'className'> = {}): string => cn(className)

export const sidebarDesktopClassName = (): string => sidebarDesktopBaseClassName
export const sidebarGapClassName = ({
  variant = 'sidebar',
}: Readonly<{ variant?: SidebarVariant }> = {}): string =>
  cn(
    variant === 'floating' || variant === 'inset'
      ? sidebarGapFloatingBaseClassName
      : sidebarGapBaseClassName,
  )

export const sidebarContainerClassName = ({
  variant = 'sidebar',
}: Readonly<{ variant?: SidebarVariant }> = {}): string => {
  if (variant === 'floating') {
    return cn(sidebarContainerFloatingBaseClassName)
  }

  if (variant === 'inset') {
    return cn(sidebarContainerInsetBaseClassName)
  }

  return cn(sidebarContainerBaseClassName)
}

export const sidebarInnerClassName = (): string => sidebarInnerBaseClassName
export const sidebarMobileClassName = (): string => sidebarMobileBaseClassName
export const sidebarMobileContentClassName = (): string =>
  sidebarMobileContentBaseClassName
export const sidebarInsetClassName = ({
  dir,
  className,
}: SidebarInsetStyleOptions = {}): string =>
  cn(
    dir === 'rtl' ? sidebarInsetRtlBaseClassName : sidebarInsetBaseClassName,
    className,
  )

export const sidebarTriggerClassName = ({
  className,
}: SidebarTriggerStyleOptions = {}): string =>
  Button.buttonVariants({
    variant: 'ghost',
    size: 'icon-sm',
    className,
  })

export const sidebarRailClassName = ({
  dir,
  className,
}: SidebarRailStyleOptions = {}): string =>
  cn(
    dir === 'rtl' ? sidebarRailRtlBaseClassName : sidebarRailBaseClassName,
    className,
  )

export const sidebarHeaderClassName = ({
  className,
}: SidebarHeaderStyleOptions = {}): string =>
  cn(sidebarHeaderBaseClassName, className)

export const sidebarFooterClassName = ({
  className,
}: SidebarFooterStyleOptions = {}): string =>
  cn(sidebarFooterBaseClassName, className)

export const sidebarSeparatorClassName = ({
  className,
}: SidebarSeparatorStyleOptions = {}): string =>
  cn(sidebarSeparatorBaseClassName, className)

export const sidebarContentClassName = ({
  className,
}: SidebarContentStyleOptions = {}): string =>
  cn(sidebarContentBaseClassName, className)

export const sidebarGroupClassName = ({
  className,
}: SidebarGroupStyleOptions = {}): string =>
  cn(sidebarGroupBaseClassName, className)

export const sidebarGroupLabelClassName = ({
  className,
}: SidebarGroupLabelStyleOptions = {}): string =>
  cn(sidebarGroupLabelBaseClassName, className)

export const sidebarGroupActionClassName = ({
  className,
  dir,
}: SidebarGroupActionStyleOptions = {}): string =>
  cn(
    dir === 'rtl'
      ? sidebarGroupActionRtlBaseClassName
      : sidebarGroupActionBaseClassName,
    className,
  )

export const sidebarGroupContentClassName = ({
  className,
}: SidebarGroupContentStyleOptions = {}): string =>
  cn(sidebarGroupContentBaseClassName, className)

export const sidebarMenuClassName = ({
  className,
}: SidebarMenuStyleOptions = {}): string =>
  cn(sidebarMenuBaseClassName, className)

export const sidebarMenuItemClassName = ({
  className,
}: SidebarMenuItemStyleOptions = {}): string =>
  cn(sidebarMenuItemBaseClassName, className)

export const sidebarMenuButtonClassName = ({
  className,
  dir,
  variant = 'default',
  size = 'default',
}: SidebarMenuButtonStyleOptions = {}): string => {
  let sizeClassName = sidebarMenuButtonDefaultSizeClassName

  if (size === 'sm') {
    sizeClassName = sidebarMenuButtonSmallSizeClassName
  }

  if (size === 'lg') {
    sizeClassName = sidebarMenuButtonLargeSizeClassName
  }

  if (dir === 'rtl') {
    if (variant === 'outline') {
      return cn(
        sidebarMenuButtonRtlOutlineBaseClassName,
        sizeClassName,
        className,
      )
    }

    return cn(sidebarMenuButtonRtlBaseClassName, sizeClassName, className)
  }

  if (variant === 'outline') {
    return cn(sidebarMenuButtonOutlineBaseClassName, sizeClassName, className)
  }

  return cn(sidebarMenuButtonBaseClassName, sizeClassName, className)
}

export const sidebarMenuActionClassName = ({
  className,
  dir,
  showOnHover,
}: SidebarMenuActionStyleOptions = {}): string =>
  cn(
    dir === 'rtl'
      ? sidebarMenuActionRtlBaseClassName
      : sidebarMenuActionBaseClassName,
    showOnHover === true ? sidebarMenuActionShowOnHoverClassName : undefined,
    className,
  )

export const sidebarMenuBadgeClassName = ({
  className,
  dir,
}: SidebarMenuBadgeStyleOptions = {}): string =>
  cn(
    dir === 'rtl'
      ? sidebarMenuBadgeRtlBaseClassName
      : sidebarMenuBadgeBaseClassName,
    className,
  )

export const sidebarMenuSkeletonClassName = ({
  className,
}: SidebarMenuSkeletonStyleOptions = {}): string =>
  cn(sidebarMenuSkeletonBaseClassName, className)

export const sidebarMenuSubClassName = ({
  className,
  dir,
}: SidebarMenuSubStyleOptions = {}): string =>
  cn(
    dir === 'rtl'
      ? sidebarMenuSubRtlBaseClassName
      : sidebarMenuSubBaseClassName,
    className,
  )

export const sidebarMenuSubItemClassName = ({
  className,
}: SidebarMenuSubItemStyleOptions = {}): string =>
  cn(sidebarMenuSubItemBaseClassName, className)

export const sidebarMenuSubButtonClassName = ({
  className,
  dir,
}: SidebarMenuSubButtonStyleOptions = {}): string =>
  cn(
    dir === 'rtl'
      ? sidebarMenuSubButtonRtlBaseClassName
      : sidebarMenuSubButtonBaseClassName,
    className,
  )

export const sidebarInputClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(sidebarInputBaseClassName, className)

const panelLeftIcon = (): Html => {
  const h = html<never>()

  return h.svg(
    [
      h.Xmlns('http://www.w3.org/2000/svg'),
      h.Width('24'),
      h.Height('24'),
      h.ViewBox('0 0 24 24'),
      h.Fill('none'),
      h.Stroke('currentColor'),
      h.StrokeWidth('2'),
      h.StrokeLinecap('round'),
      h.StrokeLinejoin('round'),
      h.Class('lucide lucide-panel-left rtl:rotate-180'),
    ],
    [
      h.rect(
        [
          h.X('3'),
          h.Y('3'),
          h.Width('18'),
          h.Height('18'),
          h.Attribute('rx', '2'),
        ],
        [],
      ),
      h.path([h.D('M9 3v18')], []),
    ],
  )
}

export const SidebarProvider = <Message>(
  config: SidebarStyleOptions &
    Readonly<{
      children?: ReadonlyArray<Child>
    }> = {},
): Html => {
  const h = html<Message>()
  const style = '--sidebar-width: 16rem; --sidebar-width-icon: 3rem;'

  return h.div(
    [
      h.DataAttribute('slot', 'sidebar-wrapper'),
      h.Class(sidebarProviderClassName(config)),
      ...(config.dir === undefined ? [] : [h.Dir(config.dir)]),
      h.Attribute('style', style),
    ],
    config.children ?? [],
  )
}

export const Sidebar = <Message>(
  config: SidebarStyleOptions &
    Readonly<{
      id?: string
      open?: boolean
      mobileOpen?: boolean
      isMobile?: boolean
      side?: SidebarSide
      variant?: SidebarVariant
      collapsible?: SidebarCollapsible
      children?: ReadonlyArray<Child>
    }> = {},
): Html => {
  const h = html<Message>()
  const {
    id = 'sidebar',
    open = true,
    mobileOpen = false,
    isMobile = false,
    side = 'left',
    variant = 'sidebar',
    collapsible = 'offcanvas',
  } = config

  const rootAttributes: ReadonlyArray<Attribute<Message>> = [
    h.DataAttribute('slot', 'sidebar'),
    h.DataAttribute('state', open ? 'expanded' : 'collapsed'),
    h.DataAttribute('variant', variant),
    h.DataAttribute('side', side),
    h.DataAttribute('collapsible', open ? '' : collapsible),
    h.Class(cn(sidebarDesktopClassName(), config.className)),
  ]

  if (collapsible === 'none') {
    return h.div(
      [
        h.DataAttribute('slot', 'sidebar'),
        h.Class(
          'flex h-full w-(--sidebar-width) flex-col bg-sidebar text-sidebar-foreground',
        ),
        ...(config.dir === undefined ? [] : [h.Dir(config.dir)]),
      ],
      config.children ?? [],
    )
  }

  if (isMobile) {
    return Sheet.view<Message>({
      id: `${id}-mobile`,
      open: mobileOpen,
      side,
      showCloseButton: false,
      className: sidebarMobileClassName(),
      contentClassName: sidebarMobileContentClassName(),
      dir: config.dir,
      toView: attributes =>
        h.div(
          [...attributes.root],
          [
            h.dialog(
              [...attributes.dialog],
              [
                h.div([...attributes.backdrop.root], []),
                h.div(
                  [
                    ...attributes.popup.root,
                    h.DataAttribute('slot', 'sidebar-mobile'),
                    h.Class(cn(sidebarMobileClassName(), config.className)),
                    h.Attribute('style', '--sidebar-width: 18rem;'),
                  ],
                  [
                    h.div(
                      [h.Class('flex h-full w-full flex-col')],
                      config.children ?? [],
                    ),
                  ],
                ),
              ],
            ),
          ],
        ),
    })
  }

  return h.div(rootAttributes, [
    h.div(
      [
        h.DataAttribute('slot', 'sidebar-gap'),
        h.Class(sidebarGapClassName({ variant })),
      ],
      [],
    ),
    h.div(
      [
        h.DataAttribute('slot', 'sidebar-container'),
        h.DataAttribute('side', side),
        h.Class(sidebarContainerClassName({ variant })),
        ...(config.dir === undefined ? [] : [h.Dir(config.dir)]),
      ],
      [
        h.div(
          [
            h.DataAttribute('slot', 'sidebar-inner'),
            h.DataAttribute('sidebar', 'sidebar'),
            h.Class(sidebarInnerClassName()),
          ],
          config.children ?? [],
        ),
      ],
    ),
  ])
}

export const SidebarTrigger = <Message>(
  config: SidebarTriggerStyleOptions &
    Readonly<{
      attributes?: ReadonlyArray<Attribute<Message>>
    }> = {},
): Html => {
  const h = html<Message>()

  return Button.view<Message>({
    variant: 'ghost',
    size: 'icon-sm',
    className: config.className,
    toView: attributes =>
      h.button(
        [
          ...attributes.button,
          h.DataAttribute('slot', 'sidebar-trigger'),
          h.DataAttribute('sidebar', 'trigger'),
          ...(config.attributes ?? []),
        ],
        [panelLeftIcon(), h.span([h.Class('sr-only')], ['Toggle Sidebar'])],
      ),
  })
}

export const SidebarRail = <Message>(
  config: SidebarRailStyleOptions &
    Readonly<{
      attributes?: ReadonlyArray<Attribute<Message>>
    }> = {},
): Html => {
  const h = html<Message>()

  return h.button(
    [
      h.DataAttribute('slot', 'sidebar-rail'),
      h.DataAttribute('sidebar', 'rail'),
      h.AriaLabel('Toggle Sidebar'),
      h.Tabindex(-1),
      h.Title('Toggle Sidebar'),
      h.Class(sidebarRailClassName(config)),
      ...(config.attributes ?? []),
    ],
    [],
  )
}

export const SidebarInset = <Message>(
  config: SidebarInsetStyleOptions &
    Readonly<{
      children?: ReadonlyArray<Child>
    }> = {},
): Html => {
  const h = html<Message>()

  return h.main(
    [
      h.DataAttribute('slot', 'sidebar-inset'),
      h.Class(sidebarInsetClassName(config)),
    ],
    config.children ?? [],
  )
}

export const SidebarHeader = <Message>(
  config: SidebarHeaderStyleOptions &
    Readonly<{
      children?: ReadonlyArray<Child>
    }> = {},
): Html => {
  const h = html<Message>()

  return h.div(
    [
      h.DataAttribute('slot', 'sidebar-header'),
      h.DataAttribute('sidebar', 'header'),
      h.Class(sidebarHeaderClassName(config)),
    ],
    config.children ?? [],
  )
}

export const SidebarFooter = <Message>(
  config: SidebarFooterStyleOptions &
    Readonly<{
      children?: ReadonlyArray<Child>
    }> = {},
): Html => {
  const h = html<Message>()

  return h.div(
    [
      h.DataAttribute('slot', 'sidebar-footer'),
      h.DataAttribute('sidebar', 'footer'),
      h.Class(sidebarFooterClassName(config)),
    ],
    config.children ?? [],
  )
}

export const SidebarSeparator = <Message>(
  config: SidebarSeparatorStyleOptions = {},
): Html => {
  const h = html<Message>()

  return Separator.view<Message>({
    className: sidebarSeparatorClassName(config),
    toView: attributes =>
      h.hr([
        ...attributes.separator,
        h.DataAttribute('slot', 'sidebar-separator'),
      ]),
  })
}

export const SidebarContent = <Message>(
  config: SidebarContentStyleOptions &
    Readonly<{
      children?: ReadonlyArray<Child>
    }> = {},
): Html => {
  const h = html<Message>()

  return h.div(
    [
      h.DataAttribute('slot', 'sidebar-content'),
      h.DataAttribute('sidebar', 'content'),
      ...(config.dir === undefined ? [] : [h.Dir(config.dir)]),
      h.Class(sidebarContentClassName(config)),
    ],
    config.children ?? [],
  )
}

export const SidebarGroup = <Message>(
  config: SidebarGroupStyleOptions &
    Readonly<{
      children?: ReadonlyArray<Child>
    }> = {},
): Html => {
  const h = html<Message>()

  return h.div(
    [
      h.DataAttribute('slot', 'sidebar-group'),
      h.DataAttribute('sidebar', 'group'),
      h.Class(sidebarGroupClassName(config)),
    ],
    config.children ?? [],
  )
}

export const SidebarGroupLabel = <Message>(
  config: SidebarGroupLabelStyleOptions &
    Readonly<{
      children?: ReadonlyArray<Child>
    }> = {},
): Html => {
  const h = html<Message>()

  return h.div(
    [
      h.DataAttribute('slot', 'sidebar-group-label'),
      h.DataAttribute('sidebar', 'group-label'),
      h.Class(sidebarGroupLabelClassName(config)),
    ],
    config.children ?? [],
  )
}

export const SidebarGroupAction = <Message>(
  config: SidebarGroupActionStyleOptions &
    Readonly<{
      attributes?: ReadonlyArray<Attribute<Message>>
      children?: ReadonlyArray<Child>
    }> = {},
): Html => {
  const h = html<Message>()

  return h.button(
    [
      h.Type('button'),
      h.DataAttribute('slot', 'sidebar-group-action'),
      h.DataAttribute('sidebar', 'group-action'),
      h.Class(sidebarGroupActionClassName(config)),
      ...(config.attributes ?? []),
    ],
    config.children ?? [],
  )
}

export const SidebarGroupContent = <Message>(
  config: SidebarGroupContentStyleOptions &
    Readonly<{
      children?: ReadonlyArray<Child>
    }> = {},
): Html => {
  const h = html<Message>()

  return h.div(
    [
      h.DataAttribute('slot', 'sidebar-group-content'),
      h.DataAttribute('sidebar', 'group-content'),
      h.Class(sidebarGroupContentClassName(config)),
    ],
    config.children ?? [],
  )
}

export const SidebarMenu = <Message>(
  config: SidebarMenuStyleOptions &
    Readonly<{
      children?: ReadonlyArray<Child>
    }> = {},
): Html => {
  const h = html<Message>()

  return h.ul(
    [
      h.DataAttribute('slot', 'sidebar-menu'),
      h.DataAttribute('sidebar', 'menu'),
      h.Class(sidebarMenuClassName(config)),
    ],
    config.children ?? [],
  )
}

export const SidebarMenuItem = <Message>(
  config: SidebarMenuItemStyleOptions &
    Readonly<{
      children?: ReadonlyArray<Child>
    }> = {},
): Html => {
  const h = html<Message>()

  return h.li(
    [
      h.DataAttribute('slot', 'sidebar-menu-item'),
      h.DataAttribute('sidebar', 'menu-item'),
      h.Class(sidebarMenuItemClassName(config)),
    ],
    config.children ?? [],
  )
}

export const SidebarMenuButton = <Message>(
  config: SidebarMenuButtonStyleOptions &
    Readonly<{
      href?: string
      target?: string
      rel?: string
      attributes?: ReadonlyArray<Attribute<Message>>
      children?: ReadonlyArray<Child>
    }> = {},
): Html => {
  const h = html<Message>()
  const classes = sidebarMenuButtonClassName(config)
  const attrs = [
    h.DataAttribute('slot', 'sidebar-menu-button'),
    h.DataAttribute('sidebar', 'menu-button'),
    h.DataAttribute('size', config.size ?? 'default'),
    ...(config.isActive === true ? [h.DataAttribute('active', 'true')] : []),
    h.Class(classes),
    ...(config.href === undefined ? [h.Type('button')] : [h.Href(config.href)]),
    ...(config.target === undefined ? [] : [h.Target(config.target)]),
    ...(config.rel === undefined ? [] : [h.Rel(config.rel)]),
    ...(config.isActive === true && config.href !== undefined
      ? [h.AriaCurrent('page')]
      : []),
    ...(config.attributes ?? []),
  ]

  return config.href === undefined
    ? h.button(attrs, config.children ?? [])
    : h.a(attrs, config.children ?? [])
}

export const SidebarMenuAction = <Message>(
  config: SidebarMenuActionStyleOptions &
    Readonly<{
      attributes?: ReadonlyArray<Attribute<Message>>
      children?: ReadonlyArray<Child>
    }> = {},
): Html => {
  const h = html<Message>()

  return h.button(
    [
      h.Type('button'),
      h.DataAttribute('slot', 'sidebar-menu-action'),
      h.DataAttribute('sidebar', 'menu-action'),
      h.Class(sidebarMenuActionClassName(config)),
      ...(config.attributes ?? []),
    ],
    config.children ?? [],
  )
}

export const SidebarMenuBadge = <Message>(
  config: SidebarMenuBadgeStyleOptions &
    Readonly<{
      children?: ReadonlyArray<Child>
    }> = {},
): Html => {
  const h = html<Message>()

  return h.div(
    [
      h.DataAttribute('slot', 'sidebar-menu-badge'),
      h.DataAttribute('sidebar', 'menu-badge'),
      h.Class(sidebarMenuBadgeClassName(config)),
    ],
    config.children ?? [],
  )
}

export const SidebarMenuSkeleton = <Message>(
  config: SidebarMenuSkeletonStyleOptions = {},
): Html => {
  const h = html<Message>()
  const width = config.width ?? '72%'

  return h.div(
    [
      h.DataAttribute('slot', 'sidebar-menu-skeleton'),
      h.DataAttribute('sidebar', 'menu-skeleton'),
      h.Class(sidebarMenuSkeletonClassName(config)),
    ],
    [
      ...(config.showIcon === true
        ? [
            Skeleton.view<Message>({
              className: 'size-4 rounded-md',
              toView: attributes =>
                h.div(
                  [
                    ...attributes.skeleton,
                    h.DataAttribute('sidebar', 'menu-skeleton-icon'),
                  ],
                  [],
                ),
            }),
          ]
        : []),
      Skeleton.view<Message>({
        className: 'h-4 max-w-(--skeleton-width) flex-1',
        toView: attributes =>
          h.div(
            [
              ...attributes.skeleton,
              h.DataAttribute('sidebar', 'menu-skeleton-text'),
              h.Attribute('style', `--skeleton-width: ${width};`),
            ],
            [],
          ),
      }),
    ],
  )
}

export const SidebarMenuSub = <Message>(
  config: SidebarMenuSubStyleOptions &
    Readonly<{
      children?: ReadonlyArray<Child>
    }> = {},
): Html => {
  const h = html<Message>()

  return h.ul(
    [
      h.DataAttribute('slot', 'sidebar-menu-sub'),
      h.DataAttribute('sidebar', 'menu-sub'),
      h.Class(sidebarMenuSubClassName(config)),
    ],
    config.children ?? [],
  )
}

export const SidebarMenuSubItem = <Message>(
  config: SidebarMenuSubItemStyleOptions &
    Readonly<{
      children?: ReadonlyArray<Child>
    }> = {},
): Html => {
  const h = html<Message>()

  return h.li(
    [
      h.DataAttribute('slot', 'sidebar-menu-sub-item'),
      h.DataAttribute('sidebar', 'menu-sub-item'),
      h.Class(sidebarMenuSubItemClassName(config)),
    ],
    config.children ?? [],
  )
}

export const SidebarMenuSubButton = <Message>(
  config: SidebarMenuSubButtonStyleOptions &
    Readonly<{
      href?: string
      target?: string
      rel?: string
      attributes?: ReadonlyArray<Attribute<Message>>
      children?: ReadonlyArray<Child>
    }> = {},
): Html => {
  const h = html<Message>()
  const classes = sidebarMenuSubButtonClassName(config)
  const attrs = [
    h.DataAttribute('slot', 'sidebar-menu-sub-button'),
    h.DataAttribute('sidebar', 'menu-sub-button'),
    h.DataAttribute('size', config.size ?? 'md'),
    ...(config.isActive === true ? [h.DataAttribute('active', 'true')] : []),
    h.Class(classes),
    ...(config.href === undefined ? [h.Type('button')] : [h.Href(config.href)]),
    ...(config.target === undefined ? [] : [h.Target(config.target)]),
    ...(config.rel === undefined ? [] : [h.Rel(config.rel)]),
    ...(config.isActive === true && config.href !== undefined
      ? [h.AriaCurrent('page')]
      : []),
    ...(config.attributes ?? []),
  ]

  return config.href === undefined
    ? h.button(attrs, config.children ?? [])
    : h.a(attrs, config.children ?? [])
}

export const SidebarInput = <Message>(
  config: Readonly<{
    className?: string
    attributes?: ReadonlyArray<Attribute<Message>>
    placeholder?: string
  }> = {},
): Html => {
  const h = html<Message>()

  return Input.view<Message>({
    className: sidebarInputClassName(config),
    placeholder: config.placeholder,
    toView: attributes =>
      h.input([
        ...attributes.input,
        h.DataAttribute('slot', 'sidebar-input'),
        h.DataAttribute('sidebar', 'input'),
        ...(config.attributes ?? []),
      ]),
  })
}
