import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { view as Button } from '../button'
import { groupView as KbdGroup, view as Kbd } from './index'

const arabicKbdRtl = {
  dir: 'rtl',
}

const kbd = (
  children: ReadonlyArray<Html | string>,
  className?: string,
): Html => {
  const h = html<never>()

  return Kbd<never>({
    className,
    toView: attributes => h.kbd([...attributes.kbd], children),
  })
}

const kbdWithIcon = (
  children: ReadonlyArray<Html | string>,
  className?: string,
): Html => {
  const h = html<never>()

  return Kbd<never>({
    className,
    toView: attributes =>
      h.kbd(
        [...attributes.kbd, h.DataAttribute('icon', 'inline-end')],
        children,
      ),
  })
}

const kbdGroup = (children: ReadonlyArray<Html | string>): Html => {
  const h = html<never>()

  return KbdGroup<never>({
    toView: attributes => h.kbd([...attributes.kbdGroup], children),
  })
}

const searchIcon = (): Html => {
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
      h.Class('lucide lucide-search'),
      h.AriaHidden(true),
    ],
    [
      h.path([h.D('m21 21-4.34-4.34')], []),
      h.circle([h.Cx('11'), h.Cy('11'), h.R('8')], []),
    ],
  )
}

const inputGroup = (children: ReadonlyArray<Html>): Html => {
  const h = html<never>()

  return h.div(
    [
      h.DataAttribute('slot', 'input-group'),
      h.Role('group'),
      h.Class(
        'group/input-group relative flex h-8 w-full min-w-0 items-center rounded-lg border border-input transition-colors outline-none in-data-[slot=combobox-content]:focus-within:border-inherit in-data-[slot=combobox-content]:focus-within:ring-0 has-disabled:bg-input/50 has-disabled:opacity-50 has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-3 has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50 has-[[data-slot][aria-invalid=true]]:border-destructive has-[[data-slot][aria-invalid=true]]:ring-3 has-[[data-slot][aria-invalid=true]]:ring-destructive/20 has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>textarea]:h-auto dark:bg-input/30 dark:has-disabled:bg-input/80 dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40 has-[>[data-align=block-end]]:[&>input]:pt-3 has-[>[data-align=block-start]]:[&>input]:pb-3 has-[>[data-align=inline-end]]:[&>input]:pr-1.5 has-[>[data-align=inline-start]]:[&>input]:pl-1.5',
      ),
    ],
    children,
  )
}

const inputGroupAddon = (
  children: ReadonlyArray<Html>,
  align: 'inline-start' | 'inline-end' = 'inline-start',
): Html => {
  const h = html<never>()
  const alignClassName =
    align === 'inline-end'
      ? 'order-last pr-2 has-[>button]:mr-[-0.3rem] has-[>kbd]:mr-[-0.15rem]'
      : 'order-first pl-2 has-[>button]:ml-[-0.3rem] has-[>kbd]:ml-[-0.15rem]'

  return h.div(
    [
      h.Role('group'),
      h.DataAttribute('slot', 'input-group-addon'),
      h.DataAttribute('align', align),
      h.Class(
        `flex h-auto cursor-text items-center justify-center gap-2 py-1.5 text-sm font-medium text-muted-foreground select-none group-data-[disabled=true]/input-group:opacity-50 [&>kbd]:rounded-[calc(var(--radius)-5px)] [&>svg:not([class*='size-'])]:size-4 ${alignClassName}`,
      ),
    ],
    children,
  )
}

const inputGroupInput = (): Html => {
  const h = html<never>()

  return h.input([
    h.Attribute(
      'class',
      'h-8 w-full min-w-0 border-input px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 md:text-sm dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 flex-1 rounded-none border-0 bg-transparent shadow-none ring-0 focus-visible:ring-0 disabled:bg-transparent aria-invalid:ring-0 dark:bg-transparent dark:disabled:bg-transparent',
    ),
    h.DataAttribute('slot', 'input-group-control'),
    h.Placeholder('Search...'),
  ])
}

const buttonGroup = (children: ReadonlyArray<Html>): Html => {
  const h = html<never>()

  return h.div(
    [
      h.Role('group'),
      h.DataAttribute('slot', 'button-group'),
      h.Class(
        "flex w-fit items-stretch *:focus-visible:relative *:focus-visible:z-10 has-[>[data-slot=button-group]]:gap-2 has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-lg [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1 *:data-slot:rounded-r-none [&>[data-slot]:not(:has(~[data-slot]))]:rounded-r-lg! [&>[data-slot]~[data-slot]]:rounded-l-none [&>[data-slot]~[data-slot]]:border-l-0",
      ),
    ],
    children,
  )
}

const tooltipContent = (children: ReadonlyArray<Html | string>): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('isolate z-50')],
    [
      h.div(
        [
          h.DataAttribute('slot', 'tooltip-content'),
          h.DataAttribute('side', 'top'),
          h.Class(
            'z-50 inline-flex w-fit max-w-xs origin-(--transform-origin) items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-xs text-background has-data-[slot=kbd]:pr-1.5 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 **:data-[slot=kbd]:relative **:data-[slot=kbd]:isolate **:data-[slot=kbd]:z-50 **:data-[slot=kbd]:rounded-sm data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
          ),
        ],
        [
          ...children,
          h.div(
            [
              h.Class(
                'z-50 size-2.5 translate-y-[calc(-50%-2px)] rotate-45 rounded-[2px] bg-foreground fill-foreground data-[side=bottom]:top-1 data-[side=inline-end]:top-1/2! data-[side=inline-end]:-left-1 data-[side=inline-end]:-translate-y-1/2 data-[side=inline-start]:top-1/2! data-[side=inline-start]:-right-1 data-[side=inline-start]:-translate-y-1/2 data-[side=left]:top-1/2! data-[side=left]:-right-1 data-[side=left]:-translate-y-1/2 data-[side=right]:top-1/2! data-[side=right]:-left-1 data-[side=right]:-translate-y-1/2 data-[side=top]:-bottom-2.5',
              ),
            ],
            [],
          ),
        ],
      ),
    ],
  )
}

const tooltipButton = (label: string): Html => {
  const h = html<never>()

  return Button<never>({
    variant: 'outline',
    toView: attributes => h.button([...attributes.button], [label]),
  })
}

export const KbdButton = (): Html =>
  Button<never>({
    variant: 'outline',
    toView: attributes =>
      html<never>().button(
        [...attributes.button],
        ['Accept ', kbdWithIcon(['⏎'], 'translate-x-0.5')],
      ),
  })

export const KbdDemo = (): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('flex flex-col items-center gap-4')],
    [
      kbdGroup([kbd(['⌘']), kbd(['⇧']), kbd(['⌥']), kbd(['⌃'])]),
      kbdGroup([kbd(['Ctrl']), h.span([], ['+']), kbd(['B'])]),
    ],
  )
}

export const KbdGroupExample = (): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('flex flex-col items-center gap-4')],
    [
      h.p(
        [h.Class('text-sm text-muted-foreground')],
        [
          'Use ',
          kbdGroup([kbd(['Ctrl + B']), kbd(['Ctrl + K'])]),
          ' to open the command palette',
        ],
      ),
    ],
  )
}

export const KbdInputGroup = (): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('flex w-full max-w-xs flex-col gap-6')],
    [
      inputGroup([
        inputGroupInput(),
        inputGroupAddon([searchIcon()]),
        inputGroupAddon([kbd(['⌘']), kbd(['K'])], 'inline-end'),
      ]),
    ],
  )
}

export const KbdRtl = (): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('flex flex-col items-center gap-4'), h.Dir(arabicKbdRtl.dir)],
    [
      kbdGroup([kbd(['⌘']), kbd(['⇧']), kbd(['⌥']), kbd(['⌃'])]),
      kbdGroup([kbd(['Ctrl']), h.span([], ['+']), kbd(['B'])]),
    ],
  )
}

export const KbdTooltip = (): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('flex flex-wrap gap-4')],
    [
      buttonGroup([
        tooltipButton('Save'),
        tooltipContent(['Save Changes ', kbd(['S'])]),
        tooltipButton('Print'),
        tooltipContent([
          'Print Document ',
          kbdGroup([kbd(['Ctrl']), kbd(['P'])]),
        ]),
      ]),
    ],
  )
}
