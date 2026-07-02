import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { view as Toggle } from './index'
import type { TogglePressedChange, ToggleSize, ToggleVariant } from './index'

type IconName = 'bookmark' | 'bold' | 'italic'

export type ToggleExampleController<Message> = Readonly<{
  isPressedFor: (controlId: string, defaultIsPressed: boolean) => boolean
  onPressedChange: (controlId: string, change: TogglePressedChange) => Message
}>

const iconPaths: Readonly<Record<IconName, string>> = {
  bookmark: 'M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16',
  bold: 'M6 12h9a4 4 0 0 0 0-8H7a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h9a4 4 0 0 0 0-8',
  italic: 'M19 4h-9m4 16H5m10-16-4 16',
}

const iconClassNames: Readonly<Record<IconName, string>> = {
  bookmark: 'lucide lucide-bookmark group-aria-pressed/toggle:fill-foreground',
  bold: 'lucide lucide-bold-icon',
  italic: 'lucide lucide-italic-icon',
}

const icon = (name: IconName): Html => {
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
      h.Class(iconClassNames[name]),
      h.AriaHidden(true),
    ],
    [h.path([h.D(iconPaths[name])], [])],
  )
}

const toggleButton = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: Readonly<{
    ariaLabel: string
    children: ReadonlyArray<Html | string>
    className?: string
    dir?: string
    isDisabled?: boolean
    isPressed?: boolean
    size?: ToggleSize
    variant?: ToggleVariant
  }>,
  controller: ToggleExampleController<Message> | undefined,
): Html =>
  Toggle<Message>({
    isPressed:
      controller?.isPressedFor(config.ariaLabel, config.isPressed ?? false) ??
      config.isPressed ??
      false,
    ...(config.isDisabled === undefined
      ? {}
      : { isDisabled: config.isDisabled }),
    ...(config.size === undefined ? {} : { size: config.size }),
    ...(config.variant === undefined ? {} : { variant: config.variant }),
    ...(config.className === undefined ? {} : { className: config.className }),
    ...(config.dir === undefined ? {} : { dir: config.dir }),
    ...(controller === undefined
      ? {}
      : {
          onPressedChange: change =>
            controller.onPressedChange(config.ariaLabel, change),
        }),
    toView: attributes =>
      h.button(
        [...attributes.button, h.AriaLabel(config.ariaLabel)],
        [...config.children],
      ),
  })

export const ToggleDemo = <Message = never>(
  controller?: ToggleExampleController<Message>,
): Html => {
  const h = html<Message>()

  return toggleButton(
    h,
    {
      ariaLabel: 'Toggle bookmark',
      size: 'sm',
      variant: 'outline',
      children: [icon('bookmark'), 'Bookmark'],
    },
    controller,
  )
}

export const ToggleDisabled = <Message = never>(
  controller?: ToggleExampleController<Message>,
): Html => {
  const h = html<Message>()

  return h.div(
    [h.Class('flex flex-wrap items-center gap-2')],
    [
      toggleButton(
        h,
        {
          ariaLabel: 'Toggle disabled',
          isDisabled: true,
          children: ['Disabled'],
        },
        controller,
      ),
      toggleButton(
        h,
        {
          ariaLabel: 'Toggle disabled outline',
          isDisabled: true,
          variant: 'outline',
          children: ['Disabled'],
        },
        controller,
      ),
    ],
  )
}

export const ToggleOutline = <Message = never>(
  controller?: ToggleExampleController<Message>,
): Html => {
  const h = html<Message>()

  return h.div(
    [h.Class('flex flex-wrap items-center gap-2')],
    [
      toggleButton(
        h,
        {
          ariaLabel: 'Toggle italic',
          variant: 'outline',
          children: [icon('italic'), 'Italic'],
        },
        controller,
      ),
      toggleButton(
        h,
        {
          ariaLabel: 'Toggle bold',
          variant: 'outline',
          children: [icon('bold'), 'Bold'],
        },
        controller,
      ),
    ],
  )
}

export const ToggleRtl = <Message = never>(
  controller?: ToggleExampleController<Message>,
): Html => {
  const h = html<Message>()

  return toggleButton(
    h,
    {
      ariaLabel: 'Toggle bookmark',
      dir: 'rtl',
      size: 'sm',
      variant: 'outline',
      children: [icon('bookmark'), 'إشارة مرجعية'],
    },
    controller,
  )
}

export const ToggleSizes = <Message = never>(
  controller?: ToggleExampleController<Message>,
): Html => {
  const h = html<Message>()

  return h.div(
    [h.Class('flex flex-wrap items-center gap-2')],
    [
      toggleButton(
        h,
        {
          ariaLabel: 'Toggle small',
          size: 'sm',
          variant: 'outline',
          children: ['Small'],
        },
        controller,
      ),
      toggleButton(
        h,
        {
          ariaLabel: 'Toggle default',
          size: 'default',
          variant: 'outline',
          children: ['Default'],
        },
        controller,
      ),
      toggleButton(
        h,
        {
          ariaLabel: 'Toggle large',
          size: 'lg',
          variant: 'outline',
          children: ['Large'],
        },
        controller,
      ),
    ],
  )
}

export const ToggleText = <Message = never>(
  controller?: ToggleExampleController<Message>,
): Html => {
  const h = html<Message>()

  return toggleButton(
    h,
    {
      ariaLabel: 'Toggle italic',
      children: [icon('italic'), 'Italic'],
    },
    controller,
  )
}
