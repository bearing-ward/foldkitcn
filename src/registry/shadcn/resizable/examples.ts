import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import type {
  ResizableMessage,
  ResizablePanelConfig,
  ResizableState,
} from './index'
import { resizableState, view as Resizable } from './index'

export type ResizableExampleMessageChange = Readonly<{
  defaultState: ResizableState
  message: ResizableMessage
}>

export type ResizableExampleController<Message> = Readonly<{
  state?: ResizableState
  onResizableMessage?: (change: ResizableExampleMessageChange) => Message
}>

const label = (text: string, className = 'h-full'): Html => {
  const h = html<never>()

  return h.div(
    [h.Class(`flex ${className} items-center justify-center p-6`)],
    [h.span([h.Class('font-semibold')], [text])],
  )
}

const panel = <Message = never>(
  id: string,
  defaultSize: number,
  text: string,
  contentClassName?: string,
): ResizablePanelConfig<Message> => ({
  id,
  defaultSize,
  children: [label(text, contentClassName)],
})

const group = <Message = never>(config: {
  readonly orientation?: 'horizontal' | 'vertical'
  readonly dir?: 'ltr' | 'rtl'
  readonly className: string
  readonly panels: ReadonlyArray<ResizablePanelConfig<Message>>
  readonly controller?: ResizableExampleController<Message>
  readonly withHandle?: boolean
}): Html => {
  const defaultState = resizableState({
    orientation: config.orientation,
    dir: config.dir,
    panels: config.panels,
  })
  const onResizableMessage = config.controller?.onResizableMessage

  return Resizable<Message>({
    state: config.controller?.state ?? defaultState,
    panels: config.panels,
    className: config.className,
    ...(onResizableMessage === undefined
      ? {}
      : {
          toMessage: message =>
            onResizableMessage({
              defaultState,
              message,
            }),
        }),
    ...(config.withHandle === undefined
      ? {}
      : { withHandle: config.withHandle }),
  })
}

export const ResizableDemo = <Message = never>(
  controller?: ResizableExampleController<Message>,
): Html => {
  const nestedPanels: ReadonlyArray<ResizablePanelConfig<Message>> = [
    panel<Message>('two', 25, 'Two'),
    panel<Message>('three', 75, 'Three'),
  ]

  return group<Message>({
    className: 'max-w-sm rounded-lg border',
    ...(controller === undefined ? {} : { controller }),
    withHandle: true,
    panels: [
      panel<Message>('one', 50, 'One', 'h-[200px]'),
      {
        id: 'nested',
        defaultSize: 50,
        children: [
          Resizable<Message>({
            state: resizableState({
              orientation: 'vertical',
              panels: nestedPanels,
            }),
            panels: nestedPanels,
            withHandle: true,
          }),
        ],
      },
    ],
  })
}

export const ResizableHandleDemo = <Message = never>(
  controller?: ResizableExampleController<Message>,
): Html =>
  group<Message>({
    className: 'min-h-[200px] max-w-sm rounded-lg border',
    ...(controller === undefined ? {} : { controller }),
    withHandle: true,
    panels: [
      panel<Message>('sidebar', 25, 'Sidebar'),
      panel<Message>('content', 75, 'Content'),
    ],
  })

export const ResizableVertical = <Message = never>(
  controller?: ResizableExampleController<Message>,
): Html =>
  group<Message>({
    orientation: 'vertical',
    className: 'min-h-[200px] max-w-sm rounded-lg border',
    ...(controller === undefined ? {} : { controller }),
    panels: [
      panel<Message>('header', 25, 'Header'),
      panel<Message>('content', 75, 'Content'),
    ],
  })

export const ResizableRtl = <Message = never>(
  controller?: ResizableExampleController<Message>,
): Html => {
  const nestedPanels: ReadonlyArray<ResizablePanelConfig<Message>> = [
    panel<Message>('two', 25, 'اثنان'),
    panel<Message>('three', 75, 'ثلاثة'),
  ]

  return group<Message>({
    dir: 'rtl',
    className: 'max-w-sm rounded-lg border',
    ...(controller === undefined ? {} : { controller }),
    withHandle: true,
    panels: [
      panel<Message>('one', 50, 'واحد', 'h-[200px]'),
      {
        id: 'nested',
        defaultSize: 50,
        children: [
          Resizable<Message>({
            state: resizableState({
              orientation: 'vertical',
              dir: 'rtl',
              panels: nestedPanels,
            }),
            panels: nestedPanels,
            withHandle: true,
          }),
        ],
      },
    ],
  })
}
