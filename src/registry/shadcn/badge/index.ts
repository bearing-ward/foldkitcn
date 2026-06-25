import { Schema as S } from 'effect'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { cn } from '../../../utils/cn'

// MODEL

export const BadgeVariant = S.Union([
  S.Literal('default'),
  S.Literal('secondary'),
  S.Literal('destructive'),
  S.Literal('outline'),
  S.Literal('ghost'),
  S.Literal('link'),
])
export type BadgeVariant = typeof BadgeVariant.Type

export const badgeVariantValues: ReadonlyArray<BadgeVariant> = [
  'default',
  'secondary',
  'destructive',
  'outline',
  'ghost',
  'link',
]

export const BadgeStyleOptions = S.Struct({
  variant: S.optional(BadgeVariant),
  className: S.optional(S.String),
})
export type BadgeStyleOptions = typeof BadgeStyleOptions.Type

// VIEW

export type BadgeAttributes<Message> = Readonly<{
  badge: ReadonlyArray<Attribute<Message>>
}>

export type ViewConfig<Message> = BadgeStyleOptions &
  Readonly<{
    toView: (attributes: BadgeAttributes<Message>) => Html
  }>

export const baseClassName =
  'group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!'

export const rtlBaseClassName =
  'group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pe-1.5 has-data-[icon=inline-start]:ps-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!'

export const variantClassNames: Readonly<Record<BadgeVariant, string>> = {
  default: 'bg-primary text-primary-foreground [a]:hover:bg-primary/80',
  secondary: 'bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80',
  destructive:
    'bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20',
  outline:
    'border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground',
  ghost: 'hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50',
  link: 'text-primary underline-offset-4 hover:underline',
}

export const badgeVariants = ({
  variant = 'default',
  className,
}: BadgeStyleOptions = {}): string =>
  cn(baseClassName, variantClassNames[variant], className)

export const rtlBadgeVariants = ({
  variant = 'default',
  className,
}: BadgeStyleOptions = {}): string =>
  cn(rtlBaseClassName, variantClassNames[variant], className)

const shadcnAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  variant: BadgeVariant,
  className: string | undefined,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('slot', 'badge'),
  h.DataAttribute('variant', variant),
  h.Class(cn(badgeVariants({ variant, className }))),
]

export const view = <Message>(config: ViewConfig<Message>): Html => {
  const h = html<Message>()
  const { toView, variant = 'default', className } = config

  return toView({
    badge: shadcnAttributes(h, variant, className),
  })
}
