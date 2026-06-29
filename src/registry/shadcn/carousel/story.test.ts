import { Story } from 'foldkit'
import { describe, expect, test } from 'vitest'

import {
  ClickedCarouselNext,
  ClickedCarouselPrevious,
  PressedCarouselKey,
  carouselState,
  update,
} from './index'
import type { CarouselState } from './index'

const initialState = (
  options: {
    readonly itemCount?: number
    readonly orientation?: 'horizontal' | 'vertical'
    readonly selectedIndex?: number
  } = {},
): CarouselState =>
  carouselState({
    itemCount: options.itemCount ?? 3,
    orientation: options.orientation,
    selectedIndex: options.selectedIndex,
  })

describe('shadcn/carousel update', () => {
  test('ClickedCarouselNext advances selected index and enabled states', () => {
    Story.story(
      update,
      Story.with(initialState()),
      Story.message(ClickedCarouselNext()),
      Story.Command.expectNone(),
      Story.model(model => {
        expect(model.selectedIndex).toBe(1)
        expect(model.canScrollPrevious).toBeTruthy()
        expect(model.canScrollNext).toBeTruthy()
      }),
    )
  })

  test('ClickedCarouselPrevious moves back one slide', () => {
    Story.story(
      update,
      Story.with(initialState({ selectedIndex: 2 })),
      Story.message(ClickedCarouselPrevious()),
      Story.Command.expectNone(),
      Story.model(model => {
        expect(model.selectedIndex).toBe(1)
        expect(model.canScrollPrevious).toBeTruthy()
        expect(model.canScrollNext).toBeTruthy()
      }),
    )
  })

  test('next and previous clamp at boundaries', () => {
    Story.story(
      update,
      Story.with(initialState({ selectedIndex: 2 })),
      Story.message(ClickedCarouselNext()),
      Story.model(model => {
        expect(model.selectedIndex).toBe(2)
        expect(model.canScrollNext).toBeFalsy()
      }),
    )

    Story.story(
      update,
      Story.with(initialState()),
      Story.message(ClickedCarouselPrevious()),
      Story.model(model => {
        expect(model.selectedIndex).toBe(0)
        expect(model.canScrollPrevious).toBeFalsy()
      }),
    )
  })

  test('horizontal keyboard input uses left and right arrows', () => {
    Story.story(
      update,
      Story.with(initialState()),
      Story.message(PressedCarouselKey({ key: 'ArrowRight' })),
      Story.model(model => {
        expect(model.selectedIndex).toBe(1)
      }),
      Story.message(PressedCarouselKey({ key: 'ArrowLeft' })),
      Story.model(model => {
        expect(model.selectedIndex).toBe(0)
      }),
    )
  })

  test('vertical keyboard input uses up and down arrows', () => {
    Story.story(
      update,
      Story.with(initialState({ orientation: 'vertical' })),
      Story.message(PressedCarouselKey({ key: 'ArrowDown' })),
      Story.model(model => {
        expect(model.selectedIndex).toBe(1)
        expect(model.orientation).toBe('vertical')
      }),
      Story.message(PressedCarouselKey({ key: 'ArrowUp' })),
      Story.model(model => {
        expect(model.selectedIndex).toBe(0)
      }),
    )
  })

  test('unhandled keyboard input preserves state', () => {
    Story.story(
      update,
      Story.with(initialState({ selectedIndex: 1 })),
      Story.message(PressedCarouselKey({ key: 'Home' })),
      Story.model(model => {
        expect(model.selectedIndex).toBe(1)
      }),
    )
  })
})
