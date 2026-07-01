import { describe, expect, test } from 'vitest'

import * as MessageScroller from './index'

describe('shadcn/message-scroller story', () => {
  test('tracks pinned state and emits scroll commands for appended items', () => {
    const initial = MessageScroller.init('story-scroller', 2)
    const [afterPinnedAppend, pinnedCommands] = MessageScroller.update(
      initial,
      MessageScroller.AppendedMessageScrollerItems({ count: 1 }),
    )

    expect(afterPinnedAppend).toMatchObject({
      hasUnreadMessages: false,
      messageCount: 3,
    })
    expect(pinnedCommands).toHaveLength(1)
    expect(pinnedCommands[0]?.name).toBe(
      MessageScroller.ScrollMessagesToEnd.name,
    )

    const [afterUnpin] = MessageScroller.update(
      afterPinnedAppend,
      MessageScroller.UpdatedMessageScrollerPinned({
        isPinnedToEnd: false,
      }),
    )
    const [afterUnpinnedAppend, unpinnedCommands] = MessageScroller.update(
      afterUnpin,
      MessageScroller.AppendedMessageScrollerItems({ count: 2 }),
    )

    expect(afterUnpinnedAppend).toMatchObject({
      hasUnreadMessages: true,
      isPinnedToEnd: false,
      messageCount: 5,
    })
    expect(unpinnedCommands).toHaveLength(0)
  })

  test('scroll button clears unread state and records direction', () => {
    const initial = {
      ...MessageScroller.init('story-scroller', 4),
      isPinnedToEnd: false,
      hasUnreadMessages: true,
    }
    const [afterClick, commands] = MessageScroller.update(
      initial,
      MessageScroller.ClickedMessageScrollerButton({ direction: 'end' }),
    )
    const [afterStartComplete] = MessageScroller.update(
      afterClick,
      MessageScroller.CompletedScrollMessagesToStart(),
    )

    expect(afterClick).toMatchObject({
      hasUnreadMessages: false,
      isPinnedToEnd: true,
      lastScrollDirection: 'end',
    })
    expect(commands).toHaveLength(1)
    expect(commands[0]?.name).toBe(MessageScroller.ScrollMessagesToEnd.name)
    expect(afterStartComplete).toMatchObject({
      isPinnedToEnd: false,
      lastScrollDirection: 'start',
    })
  })
})
