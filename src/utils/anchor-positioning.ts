import {
  autoUpdate,
  computePosition,
  flip,
  offset as floatingOffset,
  shift,
  size,
} from '@floating-ui/dom'
import type { Placement } from '@floating-ui/dom'
import { Effect, Function, Schema as S } from 'effect'
import { Mount } from 'foldkit'
import { m } from 'foldkit/message'

/** Floating UI placement values accepted by the shared anchor lifecycle. */
export const AnchorPlacement = S.Literals([
  'top',
  'right',
  'bottom',
  'left',
  'top-start',
  'top-end',
  'right-start',
  'right-end',
  'bottom-start',
  'bottom-end',
  'left-start',
  'left-end',
])
export type AnchorPlacement = typeof AnchorPlacement.Type

/** Acknowledges that an anchored surface acquired its positioning lifecycle. */
export const CompletedPositionAnchoredSurface = m(
  'CompletedPositionAnchoredSurface',
  { id: S.String },
)
export type AnchorPositioningMessage =
  typeof CompletedPositionAnchoredSurface.Type

/**
 * Makes interactive positioning explicit while allowing inert documentation
 * fixtures to opt into CSS-only static rendering.
 */
export type AnchorPositioningConfig<Message> =
  | Readonly<{
      onPositioned: (message: AnchorPositioningMessage) => Message
      positioning?: 'floating-ui'
    }>
  | Readonly<{
      onPositioned?: never
      positioning: 'static'
    }>

/** Converts Base UI side/alignment values into Floating UI placement syntax. */
export const anchorPlacement = (
  side: 'bottom' | 'inline-end' | 'inline-start' | 'left' | 'right' | 'top',
  align: 'center' | 'end' | 'start',
): AnchorPlacement => {
  if (side === 'inline-start') {
    return align === 'center' ? 'left' : `left-${align}`
  }

  if (side === 'inline-end') {
    return align === 'center' ? 'right' : `right-${align}`
  }

  return align === 'center' ? side : `${side}-${align}`
}

const resolvedSideAndAlign = (
  placement: Placement,
): Readonly<{ side: string; align: string }> => {
  const [side, align = 'center'] = placement.split('-')
  return { side: side ?? 'bottom', align }
}

const setupAnchorPositioning = (
  config: Readonly<{
    anchorId: string
    placement: AnchorPlacement
    gap: number
    offset: number
    padding: number
    collisionAvoidance: boolean
  }>,
  element: Element,
): (() => void) => {
  const root = element.getRootNode()
  const owner = root instanceof ShadowRoot ? root : document
  const anchor = owner.querySelector(`#${CSS.escape(config.anchorId)}`)

  if (!(anchor instanceof HTMLElement) || !(element instanceof HTMLElement)) {
    return Function.constVoid
  }

  element.style.position = 'absolute'
  element.style.inset = 'auto'
  element.style.margin = '0'
  element.style.visibility = 'hidden'

  let isActive = true
  let isFirstUpdate = true
  const cleanup = autoUpdate(anchor, element, () => {
    const updatePosition = async (): Promise<void> => {
      try {
        const { x, y, placement } = await computePosition(anchor, element, {
          placement: config.placement,
          strategy: 'absolute',
          middleware: [
            floatingOffset({ mainAxis: config.gap, crossAxis: config.offset }),
            ...(config.collisionAvoidance
              ? [
                  flip({ padding: config.padding }),
                  shift({ padding: config.padding }),
                  size({
                    padding: config.padding,
                    apply({ availableHeight, availableWidth }) {
                      if (isActive) {
                        element.style.maxHeight = `${availableHeight}px`
                        element.style.maxWidth = `${availableWidth}px`
                      }
                    },
                  }),
                ]
              : []),
          ],
        })

        if (isActive) {
          const { side, align } = resolvedSideAndAlign(placement)
          element.style.left = `${x}px`
          element.style.top = `${y}px`
          element.dataset.side = side
          element.dataset.align = align

          if (isFirstUpdate) {
            isFirstUpdate = false
            element.style.visibility = ''
          }
        }
      } catch {
        if (isActive) {
          element.style.visibility = ''
        }
      }
    }

    void updatePosition()
  })

  return () => {
    isActive = false
    cleanup()
  }
}

/** Lifecycle-scoped Floating UI positioning for one anchored surface. */
export const PositionAnchoredSurface = Mount.define(
  'PositionAnchoredSurface',
  {
    id: S.String,
    anchorId: S.String,
    placement: AnchorPlacement,
    gap: S.Number,
    offset: S.Number,
    padding: S.Number,
    collisionAvoidance: S.Boolean,
  },
  CompletedPositionAnchoredSurface,
)(
  config => element =>
    Effect.gen(function* positionAnchoredSurface() {
      yield* Effect.acquireRelease(
        Effect.sync(() => setupAnchorPositioning(config, element)),
        cleanup => Effect.sync(cleanup),
      )
      return CompletedPositionAnchoredSurface({ id: config.id })
    }),
)
