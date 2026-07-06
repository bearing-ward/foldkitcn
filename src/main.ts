import {
  Array,
  Effect,
  HashSet,
  Match as M,
  Option,
  Queue,
  Record as EffectRecord,
  Schema as S,
  Stream,
  String as EffectString,
  pipe,
} from 'effect'
import type { Runtime } from 'foldkit'
import { Command, Dom, Render, Subscription } from 'foldkit'
import type { Document, Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { m } from 'foldkit/message'
import { UrlRequest, load, pushUrl } from 'foldkit/navigation'
import { ts } from 'foldkit/schema'
import { evo } from 'foldkit/struct'
import { Url, toString as urlToString } from 'foldkit/url'

import {
  DocsData,
  FailedDocsData,
  type NamespaceGroup,
  type PublicComponent,
  docsData,
  findRoutedComponent,
  generatedComponentCount,
  LoadedDocsData,
  namespaceGroups,
  publicComponents,
} from './data'
import { liveExampleViewFor } from './live-examples'
import { roadmapSnapshot } from './roadmap'
import type { RoadmapBlockedGroup } from './roadmap'
import type {
  ExampleDocsArtifact,
  OriginComponentProgressReport,
  OriginComponentProgressRow,
} from './registry/schema'
import {
  AppRoute,
  ComponentDetailRoute,
  ComponentsIndexRoute,
  ComponentsNamespaceRoute,
  DocsRoute,
  HomeRoute,
  NotFoundRoute,
  RegistryLifecycleRoute,
  RegistryRoute,
  RegistrySchemaRoute,
  RoadmapRoute,
  componentDetailRouter,
  componentsIndexRouter,
  componentsNamespaceRouter,
  docsRouter,
  homeRouter,
  registryLifecycleRouter,
  registryRouter,
  registrySchemaRouter,
  roadmapRouter,
  urlToAppRoute,
} from './route'
import {
  componentSearchBadges,
  searchPublicComponents,
} from './search/component-search'
import {
  CarouselMessage,
  CarouselOrientation,
  carouselState,
  update as updateCarouselState,
} from './registry/shadcn/carousel'
import {
  ClickedCalendarNextMonth,
  ClickedCalendarPreviousMonth,
  calendarState,
  updateCalendarState,
} from './registry/shadcn/calendar'
import type { ComboboxValueChange } from './registry/shadcn/combobox'
import { ContextMenuPoint } from './registry/base-ui/context-menu'
import type {
  MenuCheckedChange,
  MenuRadioValueChange,
} from './registry/base-ui/menu'
import * as ToastPrimitive from './registry/base-ui/toast'
import {
  ToastExampleMessage,
  type ToastExampleMessage as ToastExampleMessageType,
} from './registry/base-ui/toast/examples'
import {
  BubbleExampleMessage,
} from './registry/shadcn/bubble/examples'
import {
  DataTableExampleMessage,
  type DataTableExampleMessage as DataTableExampleMessageType,
} from './registry/shadcn/data-table/examples'
import {
  CompletedFocusOTPFieldInput,
  FocusOTPFieldInput,
  type OTPFieldValueChange,
} from './registry/base-ui/otp-field'
import * as ShadcnInputGroup from './registry/shadcn/input-group'
import {
  DataTableState as LiveExampleDataTableState,
  clearFilters as clearLiveExampleDataTableFilters,
  firstPage as firstLiveExampleDataTablePage,
  lastPage as lastLiveExampleDataTablePage,
  nextPage as nextLiveExampleDataTablePage,
  previousPage as previousLiveExampleDataTablePage,
  setFilter as setLiveExampleDataTableFilter,
  setPageSize as setLiveExampleDataTablePageSize,
  toggleAllPageRowsSelection as toggleAllLiveExampleDataTablePageRowsSelection,
  toggleColumnVisibility as toggleLiveExampleDataTableColumnVisibility,
  toggleRowSelection as toggleLiveExampleDataTableRowSelection,
  toggleSort as toggleLiveExampleDataTableSort,
} from './registry/shadcn/data-table'
import {
  type DatePickerMessage as DatePickerMessageType,
  DatePickerMessage,
  DatePickerModel,
  type DatePickerModel as DatePickerModelType,
  datePickerUpdate,
} from './registry/shadcn/date-picker'
import {
  ToastExampleMessage as SonnerExampleMessage,
  toastViewportPositionFromPosition,
  type ToastExampleMessage as SonnerExampleMessageType,
} from './registry/shadcn/sonner/examples'
import {
  EndedResizableDrag,
  MovedResizablePointer,
  ResizableMessage,
  ResizableState,
  update as updateResizableState,
} from './registry/shadcn/resizable'
import {
  fallbackRouteMetadata,
  routeMetadataForRoute,
} from './route-inventory'

export {
  ComponentDetailRoute,
  ComponentsIndexRoute,
  ComponentsNamespaceRoute,
  DocsRoute,
  HomeRoute,
  NotFoundRoute,
  RegistryLifecycleRoute,
  RegistryRoute,
  RegistrySchemaRoute,
  RoadmapRoute,
  componentDetailRouter,
  componentsIndexRouter,
  componentsNamespaceRouter,
  docsRouter,
  homeRouter,
  registryLifecycleRouter,
  registryRouter,
  registrySchemaRouter,
  roadmapRouter,
  urlToAppRoute,
}

// MODEL

export const MobileNavigation = ts('MobileNavigation', { isOpen: S.Boolean })
type MobileNavigation = typeof MobileNavigation.Type

export const PagefindSearchResult = S.Struct({
  url: S.String,
  title: S.String,
  excerpt: S.String,
  section: S.String,
})
export type PagefindSearchResult = typeof PagefindSearchResult.Type

export const IdlePagefindSearch = ts('IdlePagefindSearch')
export const LoadingPagefindSearch = ts('LoadingPagefindSearch', {
  results: S.Array(PagefindSearchResult),
})
export const LoadedPagefindSearch = ts('LoadedPagefindSearch', {
  results: S.Array(PagefindSearchResult),
})
export const PagefindSearch = S.Union([
  IdlePagefindSearch,
  LoadingPagefindSearch,
  LoadedPagefindSearch,
])
export type PagefindSearch = typeof PagefindSearch.Type

export const Model = S.Struct({
  route: AppRoute,
  data: DocsData,
  mobileNavigation: MobileNavigation,
  copiedSnippets: S.HashSet(S.String),
  liveExampleInputValues: S.Record(S.String, S.String),
  liveExampleOtpValues: S.Record(S.String, S.String),
  liveExampleSliderValues: S.Record(S.String, S.Array(S.Number)),
  liveExampleSelectOpenValues: S.Record(S.String, S.Boolean),
  liveExampleSelectValues: S.Record(S.String, S.String),
  liveExampleComboboxOpenValues: S.Record(S.String, S.Boolean),
  liveExampleComboboxInputValues: S.Record(S.String, S.String),
  liveExampleComboboxValues: S.Record(S.String, S.String),
  liveExampleComboboxMultipleValues: S.Record(S.String, S.Array(S.String)),
  liveExampleRadioGroupValues: S.Record(S.String, S.String),
  liveExampleCheckboxCheckedStates: S.Record(S.String, S.String),
  liveExampleSwitchCheckedValues: S.Record(S.String, S.Boolean),
  liveExampleAccordionValues: S.Record(S.String, S.Array(S.String)),
  liveExampleCollapsibleOpenValues: S.Record(S.String, S.Boolean),
  liveExampleTabsValues: S.Record(S.String, S.String),
  liveExampleTogglePressedValues: S.Record(S.String, S.Boolean),
  liveExampleToggleGroupValues: S.Record(S.String, S.Array(S.String)),
  liveExampleCalendarSelectedDates: S.Record(S.String, S.String),
  liveExampleCalendarVisibleMonths: S.Record(S.String, S.String),
  liveExampleCarouselSelectedIndexes: S.Record(S.String, S.Number),
  liveExampleResizableStates: S.Record(S.String, ResizableState),
  liveExampleCommandDialogOpenValues: S.Record(S.String, S.Boolean),
  liveExampleOverlayOpenValues: S.Record(S.String, S.Boolean),
  liveExampleMenuOpenValues: S.Record(S.String, S.Boolean),
  liveExampleMenuOpenSubmenuValues: S.Record(S.String, S.Array(S.String)),
  liveExampleMenuContextPoints: S.Record(S.String, ContextMenuPoint),
  liveExampleMenuValues: S.Record(S.String, S.String),
  liveExampleMenuCheckedValues: S.Record(S.String, S.Boolean),
  liveExampleMenuRadioValues: S.Record(S.String, S.String),
  liveExampleDataTableStates: S.optional(
    S.Record(S.String, LiveExampleDataTableState),
  ),
  liveExampleDatePickerStates: S.Record(S.String, DatePickerModel),
  liveExampleToastStates: S.Record(S.String, ToastPrimitive.ToastState),
  liveExampleSidebarOpenValues: S.Record(S.String, S.Boolean),
  liveExampleSidebarPanelOpenValues: S.Record(S.String, S.Boolean),
  liveExampleSidebarSelectedValues: S.Record(S.String, S.String),
  searchQuery: S.String,
  pagefindSearch: PagefindSearch,
})
export type Model = typeof Model.Type

const commandDialogDemoExampleId = 'shadcn/command-dialog'
const liveExampleResizableStateKey = (
  exampleId: string,
  groupId: string,
): string => `${exampleId}#${groupId}`

const liveExampleSidebarStateKey = (
  exampleId: string,
  panelId: string,
): string => `${exampleId}#${panelId}`

const initialLiveExampleDataTableState = (
  exampleId: string,
): typeof LiveExampleDataTableState.Type => ({
  sorting: [],
  filters: {},
  hiddenColumnIds: [],
  selectedRowIds: {},
  pageIndex: 0,
  pageSize: exampleId.endsWith('data-table-tasks') ? 3 : 2,
})

const liveExampleControlStateKey = (
  exampleId: string,
  controlId: string,
): string => `${exampleId}#${controlId}`

const checkboxTableRowControlIds = [
  'row-1-checkbox',
  'row-2-checkbox',
  'row-3-checkbox',
  'row-4-checkbox',
] as const

const checkboxTableSelectAllControlId = 'select-all-checkbox'

const updatedCheckboxTableCheckedStates = (
  states: Readonly<Record<string, string>>,
  exampleId: string,
  controlId: string,
  checkedState: string,
): Readonly<Record<string, string>> => {
  if (controlId === checkboxTableSelectAllControlId) {
    const nextRowState = checkedState === 'checked' ? 'checked' : 'unchecked'

    return checkboxTableRowControlIds.reduce(
      (nextStates, rowControlId) =>
        EffectRecord.set(
          nextStates,
          liveExampleControlStateKey(exampleId, rowControlId),
          nextRowState,
        ),
      EffectRecord.set(
        states,
        liveExampleControlStateKey(exampleId, checkboxTableSelectAllControlId),
        checkedState,
      ),
    )
  }

  if (checkboxTableRowControlIds.includes(controlId as never)) {
    return EffectRecord.set(
      states,
      liveExampleControlStateKey(exampleId, controlId),
      checkedState,
    )
  }

  return EffectRecord.set(
    states,
    liveExampleControlStateKey(exampleId, controlId),
    checkedState,
  )
}

const liveExampleMenuCheckedStateKey = (
  exampleId: string,
  menuId: string,
  itemValue: string,
): string =>
  liveExampleControlStateKey(exampleId, `${menuId}#checked#${itemValue}`)

const liveExampleMenuRadioStateKey = (
  exampleId: string,
  menuId: string,
  groupValue: string,
): string => liveExampleControlStateKey(exampleId, `${menuId}#radio#${groupValue}`)

const updateLiveExampleMenuSubmenuValues = (
  values: ReadonlyArray<string>,
  parentValue: string,
  open: boolean,
): ReadonlyArray<string> => {
  if (open) {
    return values.includes(parentValue) ? values : [...values, parentValue]
  }

  return values.filter(value => value !== parentValue)
}

const LiveExampleResizableActiveDrag = S.Struct({
  exampleId: S.String,
  groupId: S.String,
})
type LiveExampleResizableActiveDrag =
  typeof LiveExampleResizableActiveDrag.Type

const liveExampleResizableStateKeyParts = (
  key: string,
): Option.Option<LiveExampleResizableActiveDrag> => {
  const separatorIndex = key.lastIndexOf('#')

  if (separatorIndex < 0) {
    return Option.none()
  }

  return Option.some({
    exampleId: key.slice(0, separatorIndex),
    groupId: key.slice(separatorIndex + 1),
  })
}

const liveExampleResizableActiveDrags = (
  states: Readonly<Record<string, ResizableState>>,
): ReadonlyArray<LiveExampleResizableActiveDrag> =>
  pipe(
    Object.entries(states),
    Array.flatMap(([key, state]) =>
      Option.isNone(state.maybeActiveDrag)
        ? []
        : Option.match(liveExampleResizableStateKeyParts(key), {
            onNone: () => [],
            onSome: activeDrag => [activeDrag],
          }),
    ),
  )

const initialLiveExampleToastState = (
  _exampleId: string,
): ToastPrimitive.ToastState =>
  ToastPrimitive.createToastState({ limit: 3 })

const toastIdForExample = (exampleId: string): string =>
  `${exampleId.replaceAll('/', '-')}-toast`

const activeToastCount = (state: ToastPrimitive.ToastState): number =>
  state.toasts.filter(toast => toast.transitionStatus !== 'ending').length

const activeToast = (toast: ToastPrimitive.ToastItem): boolean =>
  toast.transitionStatus !== 'ending'

const showToast = (
  state: ToastPrimitive.ToastState,
  options: ToastPrimitive.ToastAddOptions,
): ToastPrimitive.ToastState => ToastPrimitive.addToast(state, options).state

const toastById = (
  state: ToastPrimitive.ToastState,
  id: string,
): Option.Option<ToastPrimitive.ToastItem> =>
  Option.fromNullishOr(state.toasts.find(toast => toast.id === id))

const shouldScheduleToastTimeout = (
  previous: ToastPrimitive.ToastItem | undefined,
  toast: ToastPrimitive.ToastItem,
): boolean =>
  activeToast(toast) &&
  toast.timerStatus === 'running' &&
  (toast.remainingDuration ?? toast.duration ?? 0) > 0 &&
  (previous === undefined ||
    previous.timerStatus !== 'running' ||
    previous.updateKey !== toast.updateKey)

const scheduleLiveExampleToastTimeouts = (
  previousState: ToastPrimitive.ToastState,
  nextState: ToastPrimitive.ToastState,
  exampleId: string,
): ReadonlyArray<Command.Command<Message>> =>
  nextState.toasts.flatMap(toast =>
    shouldScheduleToastTimeout(
      previousState.toasts.find(previousToast => previousToast.id === toast.id),
      toast,
    )
      ? [
          TimeoutLiveExampleToast({
            exampleId,
            toastId: toast.id,
            updateKey: toast.updateKey ?? 0,
            durationMillis: toast.remainingDuration ?? toast.duration ?? 0,
          }),
        ]
      : [],
  )

const scheduleLiveExampleToastRemovals = (
  previousState: ToastPrimitive.ToastState,
  nextState: ToastPrimitive.ToastState,
  exampleId: string,
): ReadonlyArray<Command.Command<Message>> =>
  nextState.toasts.flatMap(toast => {
    const previous = previousState.toasts.find(
      previousToast => previousToast.id === toast.id,
    )

    return toast.transitionStatus === 'ending' &&
      previous?.transitionStatus !== 'ending'
      ? [RemoveLiveExampleToast({ exampleId, toastId: toast.id })]
      : []
  })

const scheduleLiveExampleToastLifecycle = (
  previousState: ToastPrimitive.ToastState,
  nextState: ToastPrimitive.ToastState,
  exampleId: string,
): ReadonlyArray<Command.Command<Message>> => [
  ...scheduleLiveExampleToastTimeouts(previousState, nextState, exampleId),
  ...scheduleLiveExampleToastRemovals(previousState, nextState, exampleId),
]

const varyingHeightDescriptions: ReadonlyArray<string> = [
  'Short message.',
  'A bit longer message that spans two lines.',
  'This is a longer description that intentionally takes more vertical space to demonstrate stacking with varying heights.',
  'An even longer description that should span multiple lines so the collapsed stack and expanded viewport remain stable.',
]

const showActionUndoneToast = (
  state: ToastPrimitive.ToastState,
  id: string,
): ToastPrimitive.ToastState =>
  showToast(
    ToastPrimitive.closeToast(
      state,
      ToastPrimitive.closeRequest(id, 'manager-close'),
    ),
    {
      id: 'action-undone',
      title: 'Action undone',
      timeout: 5000,
      height: 64,
    },
  )

const updateLiveExampleToastState = (
  state: ToastPrimitive.ToastState,
  exampleId: string,
  message:
    | ToastExampleMessageType
    | SonnerExampleMessageType,
): readonly [
  ToastPrimitive.ToastState,
  ReadonlyArray<Command.Command<Message>>,
] =>
  M.value(message).pipe(
    M.withReturnType<
      readonly [
        ToastPrimitive.ToastState,
        ReadonlyArray<Command.Command<Message>>,
      ]
    >(),
    M.tagsExhaustive({
      ClickedCopyToClipboard: () =>
        [
          showToast(state, {
            id: 'copied',
            description: 'Copied',
            timeout: 1500,
            height: 48,
            position: {
              side: 'top',
              align: 'center',
              sideOffset: 10,
              arrowWidth: 12,
              arrowHeight: 6,
            },
          }),
          [],
        ],
      ClickedCreateStackedToast: () => [
        showToast(state, {
          description: 'Copied',
          priority: 'low',
          timeout: 5000,
          height: 64,
        }),
        [],
      ],
      ClickedCreatePositionToast: () =>
        [
          showToast(state, {
            title: `Toast ${activeToastCount(state) + 1} created`,
            description: 'This is a toast notification.',
            priority: 'low',
            timeout: 5000,
            height: 84,
          }),
          [],
        ],
      ClickedPerformAction: () => [
        showToast(state, {
          id: `undo-${activeToastCount(state) + 1}`,
          title: `Action ${activeToastCount(state) + 1} performed`,
          description: 'You can undo this action.',
          type: 'success',
          actionLabel: 'Undo',
          timeout: 10_000,
          height: 96,
        }),
        [],
      ],
      ClickedRunPromiseToast: () => {
        const change = ToastPrimitive.startPromiseToast(state, {
          loading: 'Waiting for result...',
        })

        return [
          change.state,
          [CompleteLiveExampleToastWait({ exampleId, toastId: change.id })],
        ]
      },
      ClickedCreateCustomToast: () =>
        [
          showToast(state, {
            title: `Toast with custom data ${activeToastCount(state) + 1}`,
            description: 'data.userId is 123',
            timeout: 5000,
            height: 84,
          }),
          [],
        ],
      ClickedSaveDraft: () =>
        {
          const existing = state.toasts.find(
            toast =>
              toast.id === 'save-status' &&
              toast.transitionStatus !== 'ending',
          )
          const replayCount =
            existing === undefined ? 0 : (existing.updateKey ?? 0) + 1
          const description =
            replayCount === 0
              ? 'Click again while it is visible to replay the pulse.'
              : `Pulse replayed ${replayCount} time`

          return [
            showToast(state, {
              id: 'save-status',
              title: 'Draft saved',
              description,
              timeout: 5000,
              height: 84,
            }),
            [],
          ]
        },
      ClickedCreateVaryingHeightToast: () => {
        const count = activeToastCount(state)
        const description =
          varyingHeightDescriptions[count % varyingHeightDescriptions.length] ??
          'Short message.'

        return [
          showToast(state, {
            title: `Toast ${count + 1} created`,
            description,
            timeout: 5000,
            height: 84 + description.length,
          }),
          [],
        ]
      },
      PressedToastAction: ({ press }) =>
        [
          press.id.startsWith('undo-')
            ? showActionUndoneToast(state, press.id)
            : ToastPrimitive.closeToast(
                state,
                ToastPrimitive.closeRequest(press.id, 'manager-close'),
              ),
          [],
        ],
      RequestedToastClose: ({ request }) =>
        [ToastPrimitive.closeToast(state, request), []],
      ChangedToastViewport: ({ interaction }) =>
        [ToastPrimitive.applyViewportInteraction(state, interaction), []],
      ClickedShowToast: () => [
        showToast(state, {
          title: 'Event has been created',
          description: 'Sunday, December 03, 2023 at 9:00 AM',
          timeout: 5000,
          height: 84,
        }),
        [],
      ],
      ClickedShowDescriptionToast: () => [
        showToast(state, {
          title: 'Event has been created',
          description: 'Sunday, December 03, 2023 at 9:00 AM',
          timeout: 5000,
          height: 84,
        }),
        [],
      ],
      ClickedShowPositionToast: ({ position }) =>
        [
          showToast(state, {
            title: `${position} toast`,
            description: 'This toast is rendered inside the live preview.',
            position: {
              ...toastViewportPositionFromPosition(position),
              sideOffset: 10,
              arrowWidth: 12,
              arrowHeight: 6,
            },
            timeout: 5000,
            height: 84,
          }),
          [],
        ],
      ClickedShowTypeToast: ({ variant }) => [
        showToast(state, {
          title: `${variant} toast`,
          description: 'Local Foldkit-native Sonner preview.',
          type: variant === 'promise' ? 'default' : variant,
          timeout: 5000,
          height: 84,
        }),
        [],
      ],
    }),
  )

// MESSAGE

export const CompletedNavigateInternal = m('CompletedNavigateInternal')
export const CompletedLoadExternal = m('CompletedLoadExternal')
export const CompletedScrollToAnchor = m('CompletedScrollToAnchor')
export const CompletedFocusLiveExampleMenu = m(
  'CompletedFocusLiveExampleMenu',
)
export const ClickedLink = m('ClickedLink', { request: UrlRequest })
export const ChangedUrl = m('ChangedUrl', { url: Url })
export const ClickedToggleMobileNavigation = m('ClickedToggleMobileNavigation')
export const ClickedCopySnippet = m('ClickedCopySnippet', { text: S.String })
export const SucceededCopySnippet = m('SucceededCopySnippet', {
  text: S.String,
})
export const FailedCopySnippet = m('FailedCopySnippet')
export const HidCopiedIndicator = m('HidCopiedIndicator', { text: S.String })
export const UpdatedLiveExampleInputValue = m('UpdatedLiveExampleInputValue', {
  exampleId: S.String,
  value: S.String,
})
export const UpdatedLiveExampleOtpValue = m('UpdatedLiveExampleOtpValue', {
  exampleId: S.String,
  value: S.String,
  isComplete: S.Boolean,
  focusSelector: S.optional(S.String),
})
export const UpdatedLiveExampleSliderValues = m(
  'UpdatedLiveExampleSliderValues',
  {
    exampleId: S.String,
    sliderId: S.String,
    values: S.Array(S.Number),
  },
)
export const UpdatedLiveExampleSelectOpen = m('UpdatedLiveExampleSelectOpen', {
  exampleId: S.String,
  open: S.Boolean,
})
export const SelectedLiveExampleSelectValue = m(
  'SelectedLiveExampleSelectValue',
  {
    exampleId: S.String,
    value: S.String,
  },
)
export const UpdatedLiveExampleComboboxOpen = m(
  'UpdatedLiveExampleComboboxOpen',
  {
    exampleId: S.String,
    open: S.Boolean,
  },
)
export const UpdatedLiveExampleComboboxInputValue = m(
  'UpdatedLiveExampleComboboxInputValue',
  {
    exampleId: S.String,
    value: S.String,
  },
)
export const SelectedLiveExampleComboboxValue = m(
  'SelectedLiveExampleComboboxValue',
  {
    exampleId: S.String,
    value: S.optional(S.String),
    values: S.Array(S.String),
  },
)
export const UpdatedLiveExampleRadioGroupValue = m(
  'UpdatedLiveExampleRadioGroupValue',
  {
    exampleId: S.String,
    value: S.String,
  },
)
export const UpdatedLiveExampleCheckboxCheckedState = m(
  'UpdatedLiveExampleCheckboxCheckedState',
  {
    exampleId: S.String,
    controlId: S.String,
    checkedState: S.String,
  },
)
export const UpdatedLiveExampleSwitchCheckedValue = m(
  'UpdatedLiveExampleSwitchCheckedValue',
  {
    exampleId: S.String,
    controlId: S.String,
    isChecked: S.Boolean,
  },
)
export const UpdatedLiveExampleAccordionValues = m(
  'UpdatedLiveExampleAccordionValues',
  {
    exampleId: S.String,
    accordionId: S.String,
    values: S.Array(S.String),
  },
)
export const UpdatedLiveExampleCollapsibleOpen = m(
  'UpdatedLiveExampleCollapsibleOpen',
  {
    exampleId: S.String,
    collapsibleId: S.String,
    open: S.Boolean,
  },
)
export const SelectedLiveExampleTabsValue = m('SelectedLiveExampleTabsValue', {
  exampleId: S.String,
  tabsId: S.String,
  value: S.String,
})
export const UpdatedLiveExampleTogglePressed = m(
  'UpdatedLiveExampleTogglePressed',
  {
    exampleId: S.String,
    controlId: S.String,
    isPressed: S.Boolean,
  },
)
export const UpdatedLiveExampleToggleGroupValues = m(
  'UpdatedLiveExampleToggleGroupValues',
  {
    exampleId: S.String,
    groupId: S.String,
    values: S.Array(S.String),
  },
)
export const SelectedLiveExampleCalendarDate = m(
  'SelectedLiveExampleCalendarDate',
  {
    exampleId: S.String,
    date: S.String,
  },
)
export const ClickedLiveExampleCalendarPreviousMonth = m(
  'ClickedLiveExampleCalendarPreviousMonth',
  {
    exampleId: S.String,
  },
)
export const ClickedLiveExampleCalendarNextMonth = m(
  'ClickedLiveExampleCalendarNextMonth',
  {
    exampleId: S.String,
  },
)
export const GotLiveExampleCarouselMessage = m(
  'GotLiveExampleCarouselMessage',
  {
    exampleId: S.String,
    message: CarouselMessage,
    itemCount: S.Number,
    orientation: S.optional(CarouselOrientation),
    dir: S.optional(S.String),
  },
)
export const GotLiveExampleResizableMessage = m(
  'GotLiveExampleResizableMessage',
  {
    exampleId: S.String,
    groupId: S.String,
    defaultState: S.optional(ResizableState),
    message: ResizableMessage,
  },
)
export const ClickedOpenLiveExampleCommandDialog = m(
  'ClickedOpenLiveExampleCommandDialog',
  {
    exampleId: S.String,
  },
)
export const UpdatedLiveExampleCommandDialogOpen = m(
  'UpdatedLiveExampleCommandDialogOpen',
  {
    exampleId: S.String,
    isOpen: S.Boolean,
  },
)
export const UpdatedLiveExampleOverlayOpen = m('UpdatedLiveExampleOverlayOpen', {
  exampleId: S.String,
  overlayId: S.String,
  open: S.Boolean,
})
export const UpdatedLiveExampleMenuOpen = m('UpdatedLiveExampleMenuOpen', {
  exampleId: S.String,
  menuId: S.String,
  open: S.Boolean,
  parentValue: S.optional(S.String),
})
export const UpdatedLiveExampleMenuChecked = m(
  'UpdatedLiveExampleMenuChecked',
  {
    exampleId: S.String,
    menuId: S.String,
    itemValue: S.String,
    checked: S.Boolean,
  },
)
export const UpdatedLiveExampleMenuContextPoint = m(
  'UpdatedLiveExampleMenuContextPoint',
  {
    exampleId: S.String,
    menuId: S.String,
    point: ContextMenuPoint,
  },
)
export const SelectedLiveExampleMenuValue = m(
  'SelectedLiveExampleMenuValue',
  {
    exampleId: S.String,
    menuId: S.String,
    value: S.optional(S.String),
  },
)
export const SelectedLiveExampleMenuRadioValue = m(
  'SelectedLiveExampleMenuRadioValue',
  {
    exampleId: S.String,
    menuId: S.String,
    groupValue: S.String,
    value: S.String,
  },
)
export const GotLiveExampleDataTableMessage = m(
  'GotLiveExampleDataTableMessage',
  {
    exampleId: S.String,
    message: DataTableExampleMessage,
  },
)
export const GotLiveExampleDatePickerMessage = m(
  'GotLiveExampleDatePickerMessage',
  {
    exampleId: S.String,
    message: DatePickerMessage,
    initialModel: DatePickerModel,
  },
)
export const GotLiveExampleToastMessage = m('GotLiveExampleToastMessage', {
  exampleId: S.String,
  message: S.Union([ToastExampleMessage, SonnerExampleMessage]),
})
export const GotLiveExampleBubbleMessage = m('GotLiveExampleBubbleMessage', {
  exampleId: S.String,
  message: BubbleExampleMessage,
})
export const UpdatedLiveExampleSidebarOpen = m(
  'UpdatedLiveExampleSidebarOpen',
  {
    exampleId: S.String,
    open: S.Boolean,
  },
)
export const UpdatedLiveExampleSidebarPanelOpen = m(
  'UpdatedLiveExampleSidebarPanelOpen',
  {
    exampleId: S.String,
    panelId: S.String,
    open: S.Boolean,
  },
)
export const SelectedLiveExampleSidebarValue = m(
  'SelectedLiveExampleSidebarValue',
  {
    exampleId: S.String,
    panelId: S.String,
    value: S.String,
  },
)
export const CompletedLiveExampleToastWait = m(
  'CompletedLiveExampleToastWait',
  {
    exampleId: S.String,
    toastId: S.String,
  },
)
export const CompletedTimeoutLiveExampleToast = m(
  'CompletedTimeoutLiveExampleToast',
  {
    exampleId: S.String,
    toastId: S.String,
    updateKey: S.Number,
  },
)
export const CompletedRemoveLiveExampleToast = m(
  'CompletedRemoveLiveExampleToast',
  {
    exampleId: S.String,
    toastId: S.String,
  },
)
export const PressedLiveExampleCommandDialogShortcut = m(
  'PressedLiveExampleCommandDialogShortcut',
)
export const PressedEscapeLiveExampleSurface = m(
  'PressedEscapeLiveExampleSurface',
)
export const PressedPointerOutsideLiveExampleSurface = m(
  'PressedPointerOutsideLiveExampleSurface',
)
export const UpdatedSearchQuery = m('UpdatedSearchQuery', { value: S.String })
export const ReceivedPagefindSearchResults = m('ReceivedPagefindSearchResults', {
  results: S.Array(PagefindSearchResult),
  query: S.String,
})
export const ClickedClearSearch = m('ClickedClearSearch')

export const Message = S.Union([
  CompletedNavigateInternal,
  CompletedLoadExternal,
  CompletedScrollToAnchor,
  CompletedFocusLiveExampleMenu,
  CompletedFocusOTPFieldInput,
  ClickedLink,
  ChangedUrl,
  ClickedToggleMobileNavigation,
  ClickedCopySnippet,
  SucceededCopySnippet,
  FailedCopySnippet,
  HidCopiedIndicator,
  UpdatedLiveExampleInputValue,
  UpdatedLiveExampleOtpValue,
  UpdatedLiveExampleSliderValues,
  UpdatedLiveExampleSelectOpen,
  SelectedLiveExampleSelectValue,
  UpdatedLiveExampleComboboxOpen,
  UpdatedLiveExampleComboboxInputValue,
  SelectedLiveExampleComboboxValue,
  UpdatedLiveExampleRadioGroupValue,
  UpdatedLiveExampleCheckboxCheckedState,
  UpdatedLiveExampleSwitchCheckedValue,
  UpdatedLiveExampleAccordionValues,
  UpdatedLiveExampleCollapsibleOpen,
  SelectedLiveExampleTabsValue,
  UpdatedLiveExampleTogglePressed,
  UpdatedLiveExampleToggleGroupValues,
  SelectedLiveExampleCalendarDate,
  ClickedLiveExampleCalendarPreviousMonth,
  ClickedLiveExampleCalendarNextMonth,
  GotLiveExampleCarouselMessage,
  GotLiveExampleResizableMessage,
  ClickedOpenLiveExampleCommandDialog,
  UpdatedLiveExampleCommandDialogOpen,
  UpdatedLiveExampleOverlayOpen,
  UpdatedLiveExampleMenuOpen,
  UpdatedLiveExampleMenuChecked,
  UpdatedLiveExampleMenuContextPoint,
  SelectedLiveExampleMenuValue,
  SelectedLiveExampleMenuRadioValue,
  GotLiveExampleDataTableMessage,
  GotLiveExampleDatePickerMessage,
  GotLiveExampleToastMessage,
  GotLiveExampleBubbleMessage,
  UpdatedLiveExampleSidebarOpen,
  UpdatedLiveExampleSidebarPanelOpen,
  SelectedLiveExampleSidebarValue,
  CompletedLiveExampleToastWait,
  CompletedTimeoutLiveExampleToast,
  CompletedRemoveLiveExampleToast,
  PressedLiveExampleCommandDialogShortcut,
  PressedEscapeLiveExampleSurface,
  PressedPointerOutsideLiveExampleSurface,
  UpdatedSearchQuery,
  ReceivedPagefindSearchResults,
  ClickedClearSearch,
])
export type Message = typeof Message.Type

// INIT

export const init: Runtime.RoutingApplicationInit<Model, Message> = (
  url: Url,
) => [
    {
      route: urlToAppRoute(url),
      data: docsData,
      mobileNavigation: MobileNavigation({ isOpen: false }),
      copiedSnippets: HashSet.empty(),
      liveExampleInputValues: {},
      liveExampleOtpValues: {},
      liveExampleSliderValues: {},
      liveExampleSelectOpenValues: {},
      liveExampleSelectValues: {},
      liveExampleComboboxOpenValues: {},
      liveExampleComboboxInputValues: {},
      liveExampleComboboxValues: {},
      liveExampleComboboxMultipleValues: {},
      liveExampleRadioGroupValues: {},
      liveExampleCheckboxCheckedStates: {},
      liveExampleSwitchCheckedValues: {},
      liveExampleAccordionValues: {},
      liveExampleCollapsibleOpenValues: {},
      liveExampleTabsValues: {},
      liveExampleTogglePressedValues: {},
      liveExampleToggleGroupValues: {},
      liveExampleCalendarSelectedDates: {},
      liveExampleCalendarVisibleMonths: {},
      liveExampleCarouselSelectedIndexes: {},
      liveExampleResizableStates: {},
      liveExampleCommandDialogOpenValues: {},
      liveExampleOverlayOpenValues: {},
      liveExampleMenuOpenValues: {},
      liveExampleMenuOpenSubmenuValues: {},
      liveExampleMenuContextPoints: {},
      liveExampleMenuValues: {},
      liveExampleMenuCheckedValues: {},
      liveExampleMenuRadioValues: {},
      liveExampleDataTableStates: {},
      liveExampleDatePickerStates: {},
      liveExampleToastStates: {},
      liveExampleSidebarOpenValues: {},
      liveExampleSidebarPanelOpenValues: {},
      liveExampleSidebarSelectedValues: {},
      searchQuery: '',
      pagefindSearch: IdlePagefindSearch(),
    },
    commandsForUrlHash(url),
  ]

// UPDATE

const NavigateInternal = Command.define(
  'NavigateInternal',
  { url: S.String },
  CompletedNavigateInternal,
)(({ url }) => pushUrl(url).pipe(Effect.as(CompletedNavigateInternal())))

const LoadExternal = Command.define(
  'LoadExternal',
  { href: S.String },
  CompletedLoadExternal,
)(({ href }) => load(href).pipe(Effect.as(CompletedLoadExternal())))

export const ScrollToAnchor = Command.define(
  'ScrollToAnchor',
  { hash: S.String },
  CompletedScrollToAnchor,
)(({ hash }) =>
  Effect.gen(function* () {
    const target = `#${CSS.escape(hash)}`
    yield* Dom.scrollIntoViewAfterPaint(target, { block: 'start' })
    yield* Dom.focus(target, { preventScroll: true, makeFocusable: true })
  }).pipe(Effect.ignore, Effect.as(CompletedScrollToAnchor())),
)

const FocusLiveExampleMenu = Command.define(
  'FocusLiveExampleMenu',
  { selector: S.String },
  CompletedFocusLiveExampleMenu,
)(({ selector }) =>
  Effect.gen(function* () {
    yield* Render.afterPaint
    yield* Dom.focus(selector, { preventScroll: true, makeFocusable: true })
  }).pipe(
    Effect.ignore,
    Effect.catchCause(() => Effect.void),
    Effect.as(CompletedFocusLiveExampleMenu()),
  ),
)

const commandsForUrlHash = (url: Url): ReadonlyArray<Command.Command<Message>> =>
  Option.match(url.hash, {
    onNone: () => [],
    onSome: hash => [ScrollToAnchor({ hash })],
  })

const MAX_PAGEFIND_RESULTS = 6
const PAGEFIND_PATH = '/pagefind/pagefind.js'

type PagefindResultData = Readonly<{
  url: string
  excerpt: string
  meta?: Readonly<{ title?: string; section?: string }>
}>

type PagefindResult = Readonly<{
  data: () => Promise<PagefindResultData>
}>

type PagefindResponse = Readonly<{
  results: ReadonlyArray<PagefindResult>
}>

type PagefindModule = Readonly<{
  search: (query: string) => Promise<PagefindResponse>
}>

const pagefindSearchResult = (
  result: PagefindSearchResult,
): PagefindSearchResult => result

const importPagefind = (): Promise<PagefindModule> =>
  import(/* @vite-ignore */ PAGEFIND_PATH)

export const SearchPagefind = Command.define(
  'SearchPagefind',
  { query: S.String },
  ReceivedPagefindSearchResults,
)(({ query }) =>
  Effect.gen(function* searchPagefindProgram() {
    const pagefind = yield* Effect.tryPromise({
      try: () => importPagefind(),
      catch: () => new Error('Pagefind is not available.'),
    })

    const response = yield* Effect.tryPromise({
      try: () => pagefind.search(query),
      catch: () => new Error('Pagefind search failed.'),
    })

    const topResults = Array.take(response.results, MAX_PAGEFIND_RESULTS)
    const loadedResults = yield* Effect.tryPromise({
      try: () => Promise.all(topResults.map(result => result.data())),
      catch: () => new Error('Pagefind result loading failed.'),
    })

    const results = Array.map(loadedResults, result =>
      pagefindSearchResult({
        url: result.url,
        title: result.meta?.title ?? 'Untitled',
        excerpt: result.excerpt,
        section: result.meta?.section ?? 'Docs',
      }),
    )

    return ReceivedPagefindSearchResults({ results, query })
  }).pipe(
    Effect.catch(() =>
      Effect.succeed(ReceivedPagefindSearchResults({ results: [], query })),
    ),
  ),
)

export const CopySnippet = Command.define(
  'CopySnippet',
  { text: S.String },
  SucceededCopySnippet,
  FailedCopySnippet,
)(({ text }) =>
  Effect.tryPromise({
    try: () => navigator.clipboard.writeText(text),
    catch: () => new Error('Failed to copy to clipboard'),
  }).pipe(
    Effect.as(SucceededCopySnippet({ text })),
    Effect.catch(() => Effect.succeed(FailedCopySnippet())),
  ),
)

const COPY_INDICATOR_DURATION = '2 seconds'

export const HideCopiedIndicator = Command.define(
  'HideCopiedIndicator',
  { text: S.String },
  HidCopiedIndicator,
)(({ text }) =>
  Effect.sleep(COPY_INDICATOR_DURATION).pipe(
    Effect.as(HidCopiedIndicator({ text })),
  ),
)

export const CompleteLiveExampleToastWait = Command.define(
  'CompleteLiveExampleToastWait',
  { exampleId: S.String, toastId: S.String },
  CompletedLiveExampleToastWait,
)(({ exampleId, toastId }) =>
  Effect.sleep('800 millis').pipe(
    Effect.as(CompletedLiveExampleToastWait({ exampleId, toastId })),
  ),
)

export const TimeoutLiveExampleToast = Command.define(
  'TimeoutLiveExampleToast',
  {
    exampleId: S.String,
    toastId: S.String,
    updateKey: S.Number,
    durationMillis: S.Number,
  },
  CompletedTimeoutLiveExampleToast,
)(({ durationMillis, exampleId, toastId, updateKey }) =>
  Effect.sleep(`${durationMillis} millis`).pipe(
    Effect.as(
      CompletedTimeoutLiveExampleToast({ exampleId, toastId, updateKey }),
    ),
  ),
)

const TOAST_EXIT_ANIMATION_DURATION = '300 millis'

export const RemoveLiveExampleToast = Command.define(
  'RemoveLiveExampleToast',
  { exampleId: S.String, toastId: S.String },
  CompletedRemoveLiveExampleToast,
)(({ exampleId, toastId }) =>
  Effect.sleep(TOAST_EXIT_ANIMATION_DURATION).pipe(
    Effect.as(CompletedRemoveLiveExampleToast({ exampleId, toastId })),
  ),
)

type UpdateReturn = readonly [Model, ReadonlyArray<Command.Command<Message>>]
const withUpdateReturn = M.withReturnType<UpdateReturn>()

const pagefindResultsFromState = (
  state: PagefindSearch,
): ReadonlyArray<PagefindSearchResult> =>
  M.value(state).pipe(
    M.withReturnType<ReadonlyArray<PagefindSearchResult>>(),
    M.tagsExhaustive({
      IdlePagefindSearch: () => [],
      LoadingPagefindSearch: ({ results }) => results,
      LoadedPagefindSearch: ({ results }) => results,
    }),
  )

export const update = (model: Model, message: Message): UpdateReturn =>
  M.value(message).pipe(
    withUpdateReturn,
    M.tagsExhaustive({
      CompletedNavigateInternal: () => [model, []],
      CompletedLoadExternal: () => [model, []],
      CompletedScrollToAnchor: () => [model, []],
      CompletedFocusLiveExampleMenu: () => [model, []],
      CompletedFocusOTPFieldInput: () => [model, []],
      ClickedLink: ({ request }) =>
        M.value(request).pipe(
          withUpdateReturn,
          M.tagsExhaustive({
            Internal: ({ url }) => [
              model,
              [NavigateInternal({ url: urlToString(url) })],
            ],
            External: ({ href }) => [model, [LoadExternal({ href })]],
          }),
        ),
      ChangedUrl: ({ url }) => [
        evo(model, {
          route: () => urlToAppRoute(url),
          mobileNavigation: () => MobileNavigation({ isOpen: false }),
        }),
        commandsForUrlHash(url),
      ],
      ClickedToggleMobileNavigation: () => [
        evo(model, {
          mobileNavigation: ({ isOpen }) =>
            MobileNavigation({ isOpen: !isOpen }),
        }),
        [],
      ],
      ClickedCopySnippet: ({ text }) => [model, [CopySnippet({ text })]],
      SucceededCopySnippet: ({ text }) =>
        HashSet.has(model.copiedSnippets, text)
          ? [model, []]
          : [
            evo(model, {
              copiedSnippets: HashSet.add(text),
            }),
            [HideCopiedIndicator({ text })],
          ],
      FailedCopySnippet: () => [model, []],
      HidCopiedIndicator: ({ text }) => [
        evo(model, {
          copiedSnippets: HashSet.remove(text),
        }),
        [],
      ],
      UpdatedLiveExampleInputValue: ({ exampleId, value }) => [
        evo(model, {
          liveExampleInputValues: EffectRecord.set(exampleId, value),
        }),
        [],
      ],
      UpdatedLiveExampleOtpValue: ({ exampleId, value, focusSelector }) => [
        evo(model, {
          liveExampleOtpValues: EffectRecord.set(exampleId, value),
        }),
        focusSelector === undefined
          ? []
          : [FocusOTPFieldInput({ selector: focusSelector })],
      ],
      UpdatedLiveExampleSliderValues: ({ exampleId, sliderId, values }) => [
        evo(model, {
          liveExampleSliderValues: EffectRecord.set(
            liveExampleControlStateKey(exampleId, sliderId),
            values,
          ),
        }),
        [],
      ],
      UpdatedLiveExampleSelectOpen: ({ exampleId, open }) => [
        evo(model, {
          liveExampleSelectOpenValues: EffectRecord.set(exampleId, open),
        }),
        [],
      ],
      SelectedLiveExampleSelectValue: ({ exampleId, value }) => [
        evo(model, {
          liveExampleSelectValues: EffectRecord.set(exampleId, value),
          liveExampleSelectOpenValues: EffectRecord.set(exampleId, false),
        }),
        [],
      ],
      UpdatedLiveExampleComboboxOpen: ({ exampleId, open }) => [
        evo(model, {
          liveExampleComboboxOpenValues: EffectRecord.set(exampleId, open),
        }),
        [],
      ],
      UpdatedLiveExampleComboboxInputValue: ({ exampleId, value }) => [
        evo(model, {
          liveExampleComboboxInputValues: EffectRecord.set(exampleId, value),
          liveExampleComboboxOpenValues: EffectRecord.set(exampleId, true),
        }),
        [],
      ],
      SelectedLiveExampleComboboxValue: ({ exampleId, value, values }) => [
        evo(model, {
          liveExampleComboboxValues:
            value === undefined
              ? EffectRecord.remove(exampleId)
              : EffectRecord.set(exampleId, value),
          liveExampleComboboxMultipleValues: EffectRecord.set(
            exampleId,
            values,
          ),
          liveExampleComboboxInputValues: EffectRecord.set(exampleId, ''),
          liveExampleComboboxOpenValues: EffectRecord.set(exampleId, false),
        }),
        [],
      ],
      UpdatedLiveExampleRadioGroupValue: ({ exampleId, value }) => [
        evo(model, {
          liveExampleRadioGroupValues: EffectRecord.set(exampleId, value),
        }),
        [],
      ],
      UpdatedLiveExampleCheckboxCheckedState: ({
        exampleId,
        controlId,
        checkedState,
      }) => [
        evo(model, {
          liveExampleCheckboxCheckedStates: currentStates =>
            updatedCheckboxTableCheckedStates(
              currentStates,
              exampleId,
              controlId,
              checkedState,
            ),
        }),
        [],
      ],
      UpdatedLiveExampleSwitchCheckedValue: ({
        exampleId,
        controlId,
        isChecked,
      }) => [
        evo(model, {
          liveExampleSwitchCheckedValues: EffectRecord.set(
            liveExampleControlStateKey(exampleId, controlId),
            isChecked,
          ),
        }),
        [],
      ],
      UpdatedLiveExampleAccordionValues: ({
        exampleId,
        accordionId,
        values,
      }) => [
        evo(model, {
          liveExampleAccordionValues: EffectRecord.set(
            liveExampleControlStateKey(exampleId, accordionId),
            values,
          ),
        }),
        [],
      ],
      UpdatedLiveExampleCollapsibleOpen: ({
        exampleId,
        collapsibleId,
        open,
      }) => [
        evo(model, {
          liveExampleCollapsibleOpenValues: EffectRecord.set(
            liveExampleControlStateKey(exampleId, collapsibleId),
            open,
          ),
        }),
        [],
      ],
      SelectedLiveExampleTabsValue: ({ exampleId, tabsId, value }) => [
        evo(model, {
          liveExampleTabsValues: EffectRecord.set(
            liveExampleControlStateKey(exampleId, tabsId),
            value,
          ),
        }),
        [],
      ],
      UpdatedLiveExampleTogglePressed: ({
        exampleId,
        controlId,
        isPressed,
      }) => [
        evo(model, {
          liveExampleTogglePressedValues: EffectRecord.set(
            liveExampleControlStateKey(exampleId, controlId),
            isPressed,
          ),
        }),
        [],
      ],
      UpdatedLiveExampleToggleGroupValues: ({ exampleId, groupId, values }) => [
        evo(model, {
          liveExampleToggleGroupValues: EffectRecord.set(
            liveExampleControlStateKey(exampleId, groupId),
            values,
          ),
        }),
        [],
      ],
      SelectedLiveExampleCalendarDate: ({ exampleId, date }) => [
        evo(model, {
          liveExampleCalendarSelectedDates: EffectRecord.set(exampleId, date),
        }),
        [],
      ],
      ClickedLiveExampleCalendarPreviousMonth: ({ exampleId }) => {
        const visibleMonth = pipe(
          EffectRecord.get(model.liveExampleCalendarVisibleMonths, exampleId),
          Option.getOrElse(() => '2025-01'),
        )
        const nextState = updateCalendarState(
          calendarState({ visibleMonth }),
          ClickedCalendarPreviousMonth(),
        )

        return [
          evo(model, {
            liveExampleCalendarVisibleMonths: EffectRecord.set(
              exampleId,
              nextState.visibleMonth,
            ),
          }),
          [],
        ]
      },
      ClickedLiveExampleCalendarNextMonth: ({ exampleId }) => {
        const visibleMonth = pipe(
          EffectRecord.get(model.liveExampleCalendarVisibleMonths, exampleId),
          Option.getOrElse(() => '2025-01'),
        )
        const nextState = updateCalendarState(
          calendarState({ visibleMonth }),
          ClickedCalendarNextMonth(),
        )

        return [
          evo(model, {
            liveExampleCalendarVisibleMonths: EffectRecord.set(
              exampleId,
              nextState.visibleMonth,
            ),
          }),
          [],
        ]
      },
      GotLiveExampleCarouselMessage: ({
        exampleId,
        message,
        itemCount,
        orientation,
        dir,
      }) => {
        const selectedIndex = pipe(
          EffectRecord.get(model.liveExampleCarouselSelectedIndexes, exampleId),
          Option.getOrElse(() => 0),
        )
        const [nextState] = updateCarouselState(
          carouselState({
            selectedIndex,
            itemCount,
            ...(orientation === undefined ? {} : { orientation }),
            ...(dir === undefined ? {} : { dir }),
          }),
          message,
        )

        return [
          evo(model, {
            liveExampleCarouselSelectedIndexes: EffectRecord.set(
              exampleId,
              nextState.selectedIndex,
            ),
          }),
          [],
        ]
      },
      GotLiveExampleResizableMessage: ({
        exampleId,
        groupId,
        defaultState,
        message,
      }) => {
        const stateKey = liveExampleResizableStateKey(exampleId, groupId)
        const maybeExistingState = EffectRecord.get(
          model.liveExampleResizableStates,
          stateKey,
        )

        if (Option.isNone(maybeExistingState) && defaultState === undefined) {
          return [model, []]
        }

        const state = Option.match(maybeExistingState, {
          onNone: () => defaultState,
          onSome: existingState => existingState,
        })

        if (state === undefined) {
          return [model, []]
        }

        const [nextState] = updateResizableState(state, message)

        return [
          evo(model, {
            liveExampleResizableStates: EffectRecord.set(stateKey, nextState),
          }),
          [],
        ]
      },
      ClickedOpenLiveExampleCommandDialog: ({ exampleId }) => [
        evo(model, {
          liveExampleCommandDialogOpenValues: EffectRecord.set(exampleId, true),
        }),
        [],
      ],
      UpdatedLiveExampleCommandDialogOpen: ({ exampleId, isOpen }) => [
        evo(model, {
          liveExampleCommandDialogOpenValues: EffectRecord.set(
            exampleId,
            isOpen,
          ),
        }),
        [],
      ],
      UpdatedLiveExampleOverlayOpen: ({ exampleId, overlayId, open }) => [
        evo(model, {
          liveExampleOverlayOpenValues: EffectRecord.set(
            liveExampleControlStateKey(exampleId, overlayId),
            open,
          ),
        }),
        [],
      ],
      UpdatedLiveExampleMenuOpen: ({
        exampleId,
        menuId,
        open,
        parentValue,
      }) => {
        const stateKey = liveExampleControlStateKey(exampleId, menuId)

        if (parentValue !== undefined) {
          const currentValues = pipe(
            EffectRecord.get(model.liveExampleMenuOpenSubmenuValues, stateKey),
            Option.getOrElse((): ReadonlyArray<string> => []),
          )

          return [
            evo(model, {
              liveExampleMenuOpenSubmenuValues: EffectRecord.set(
                stateKey,
                updateLiveExampleMenuSubmenuValues(
                  currentValues,
                  parentValue,
                  open,
                ),
              ),
            }),
            [],
          ]
        }

        return [
          evo(model, {
            liveExampleMenuOpenValues: EffectRecord.set(stateKey, open),
          }),
          [],
        ]
      },
      UpdatedLiveExampleMenuChecked: ({
        exampleId,
        menuId,
        itemValue,
        checked,
      }) => [
        evo(model, {
          liveExampleMenuCheckedValues: EffectRecord.set(
            liveExampleMenuCheckedStateKey(exampleId, menuId, itemValue),
            checked,
          ),
        }),
        [],
      ],
      UpdatedLiveExampleMenuContextPoint: ({ exampleId, menuId, point }) => [
        evo(model, {
          liveExampleMenuContextPoints: EffectRecord.set(
            liveExampleControlStateKey(exampleId, menuId),
            point,
          ),
        }),
        [],
      ],
      SelectedLiveExampleMenuValue: ({ exampleId, menuId, value }) => [
        evo(model, {
          liveExampleMenuValues: EffectRecord.set(
            liveExampleControlStateKey(exampleId, menuId),
            value ?? '',
          ),
        }),
        [
          FocusLiveExampleMenu({
            selector: `#${CSS.escape(value === undefined ? menuId : `${menuId}-popup`)}`,
          }),
        ],
      ],
      SelectedLiveExampleMenuRadioValue: ({
        exampleId,
        menuId,
        groupValue,
        value,
      }) => [
        evo(model, {
          liveExampleMenuRadioValues: EffectRecord.set(
            liveExampleMenuRadioStateKey(exampleId, menuId, groupValue),
            value,
          ),
        }),
        [],
      ],
      GotLiveExampleDataTableMessage: ({ exampleId, message }) => {
        const state = pipe(
          EffectRecord.get(model.liveExampleDataTableStates ?? {}, exampleId),
          Option.getOrElse(() => initialLiveExampleDataTableState(exampleId)),
        )
        const nextState = M.value(message).pipe(
          M.withReturnType<typeof LiveExampleDataTableState.Type>(),
          M.tagsExhaustive({
            UpdatedDataTableFilter: ({ columnId, value }) =>
              setLiveExampleDataTableFilter(state, columnId, value),
            ClickedDataTableSort: ({ columnId }) =>
              toggleLiveExampleDataTableSort(state, columnId),
            ClickedDataTableRowCheckbox: ({ rowId }) =>
              toggleLiveExampleDataTableRowSelection(state, rowId),
            ClickedDataTableSelectAll: ({ rowIds }) =>
              toggleAllLiveExampleDataTablePageRowsSelection(state, rowIds),
            ClickedDataTableColumnVisibility: ({ columnId, isVisible }) =>
              toggleLiveExampleDataTableColumnVisibility(
                state,
                columnId,
                isVisible,
              ),
            ClickedDataTablePreviousPage: () =>
              previousLiveExampleDataTablePage(state),
            ClickedDataTableNextPage: ({ pageCount }) =>
              nextLiveExampleDataTablePage(state, pageCount),
            ClickedDataTableFirstPage: () =>
              firstLiveExampleDataTablePage(state),
            ClickedDataTableLastPage: ({ pageCount }) =>
              lastLiveExampleDataTablePage(state, pageCount),
            SelectedDataTablePageSize: ({ pageSize }) =>
              setLiveExampleDataTablePageSize(state, pageSize),
            ClickedDataTableAction: () => state,
            ClickedDataTableClearFilters: () =>
              clearLiveExampleDataTableFilters(state),
          }),
        )

        return [
          evo(model, {
            liveExampleDataTableStates: () =>
              EffectRecord.set(
                model.liveExampleDataTableStates ?? {},
                exampleId,
                nextState,
              ),
          }),
          [],
        ]
      },
      GotLiveExampleDatePickerMessage: ({
        exampleId,
        message,
        initialModel,
      }) => {
        const state = pipe(
          EffectRecord.get(model.liveExampleDatePickerStates, exampleId),
          Option.getOrElse(() => initialModel),
        )
        const [nextState, commands] = datePickerUpdate(state, message)

        return [
          evo(model, {
            liveExampleDatePickerStates: EffectRecord.set(
              exampleId,
              nextState,
            ),
          }),
          Command.mapMessages(commands, nextMessage =>
            GotLiveExampleDatePickerMessage({
              exampleId,
              message: nextMessage,
              initialModel,
            }),
          ),
        ]
      },
      GotLiveExampleToastMessage: ({ exampleId, message }) => {
        const state = pipe(
          EffectRecord.get(model.liveExampleToastStates, exampleId),
          Option.getOrElse(() => initialLiveExampleToastState(exampleId)),
        )
        const [nextState, commands] = updateLiveExampleToastState(
          state,
          exampleId,
          message,
        )

        return [
          evo(model, {
            liveExampleToastStates: EffectRecord.set(exampleId, nextState),
          }),
          [
            ...commands,
            ...scheduleLiveExampleToastLifecycle(state, nextState, exampleId),
          ],
        ]
      },
      GotLiveExampleBubbleMessage: ({ exampleId, message }) => {
        const state = pipe(
          EffectRecord.get(model.liveExampleToastStates, exampleId),
          Option.getOrElse(() => initialLiveExampleToastState(exampleId)),
        )
        const nextState = M.value(message).pipe(
          M.withReturnType<ToastPrimitive.ToastState>(),
          M.tagsExhaustive({
            ClickedBubbleReply: ({ reply }) =>
              showToast(state, {
                title: 'Reply selected',
                description: reply,
                type: 'success',
                timeout: 5000,
                height: 84,
              }),
          }),
        )

        return [
          evo(model, {
            liveExampleToastStates: EffectRecord.set(exampleId, nextState),
          }),
          scheduleLiveExampleToastLifecycle(state, nextState, exampleId),
        ]
      },
      UpdatedLiveExampleSidebarOpen: ({ exampleId, open }) => [
        evo(model, {
          liveExampleSidebarOpenValues: EffectRecord.set(exampleId, open),
        }),
        [],
      ],
      UpdatedLiveExampleSidebarPanelOpen: ({ exampleId, panelId, open }) => [
        evo(model, {
          liveExampleSidebarPanelOpenValues: EffectRecord.set(
            liveExampleSidebarStateKey(exampleId, panelId),
            open,
          ),
        }),
        [],
      ],
      SelectedLiveExampleSidebarValue: ({ exampleId, panelId, value }) => [
        evo(model, {
          liveExampleSidebarSelectedValues: EffectRecord.set(
            liveExampleSidebarStateKey(exampleId, panelId),
            value,
          ),
          liveExampleSidebarPanelOpenValues: EffectRecord.set(
            liveExampleSidebarStateKey(exampleId, panelId),
            false,
          ),
        }),
        [],
      ],
      CompletedLiveExampleToastWait: ({ exampleId, toastId }) => {
        const state = pipe(
          EffectRecord.get(model.liveExampleToastStates, exampleId),
          Option.getOrElse(() => initialLiveExampleToastState(exampleId)),
        )
        const nextState = ToastPrimitive.resolvePromiseToast(
          state,
          toastId,
          ToastPrimitive.ToastPromiseSucceeded({
            title: 'Result received',
            description: 'The effect completed successfully.',
            timeout: 5000,
          }),
        )

        return [
          evo(model, {
            liveExampleToastStates: EffectRecord.set(exampleId, nextState),
          }),
          scheduleLiveExampleToastLifecycle(state, nextState, exampleId),
        ]
      },
      CompletedTimeoutLiveExampleToast: ({ exampleId, toastId, updateKey }) => {
        const state = pipe(
          EffectRecord.get(model.liveExampleToastStates, exampleId),
          Option.getOrElse(() => initialLiveExampleToastState(exampleId)),
        )
        const maybeToast = toastById(state, toastId)

        return Option.match(maybeToast, {
          onNone: () => [model, []],
          onSome: toast => {
            if (
              !activeToast(toast) ||
              toast.timerStatus !== 'running' ||
              (toast.updateKey ?? 0) !== updateKey
            ) {
              return [model, []]
            }

            const nextState = ToastPrimitive.timeoutToast(state, toastId)

            return [
              evo(model, {
                liveExampleToastStates: EffectRecord.set(exampleId, nextState),
              }),
              scheduleLiveExampleToastRemovals(state, nextState, exampleId),
            ]
          },
        })
      },
      CompletedRemoveLiveExampleToast: ({ exampleId, toastId }) => {
        const state = pipe(
          EffectRecord.get(model.liveExampleToastStates, exampleId),
          Option.getOrElse(() => initialLiveExampleToastState(exampleId)),
        )

        return [
          evo(model, {
            liveExampleToastStates: EffectRecord.set(
              exampleId,
              ToastPrimitive.removeToast(state, toastId),
            ),
          }),
          [],
        ]
      },
      PressedLiveExampleCommandDialogShortcut: () => {
        const isOpen = pipe(
          EffectRecord.get(
            model.liveExampleCommandDialogOpenValues,
            commandDialogDemoExampleId,
          ),
          Option.getOrElse(() => false),
        )

        return [
          evo(model, {
            liveExampleCommandDialogOpenValues: EffectRecord.set(
              commandDialogDemoExampleId,
              !isOpen,
            ),
          }),
          [],
        ]
      },
      PressedEscapeLiveExampleSurface: () => [
        evo(model, {
          liveExampleCommandDialogOpenValues: () => ({}),
          liveExampleOverlayOpenValues: () => ({}),
          liveExampleMenuOpenValues: () => ({}),
          liveExampleMenuOpenSubmenuValues: () => ({}),
          liveExampleMenuValues: () => ({}),
        }),
        [],
      ],
      PressedPointerOutsideLiveExampleSurface: () => [
        evo(model, {
          liveExampleCommandDialogOpenValues: () => ({}),
          liveExampleOverlayOpenValues: () => ({}),
          liveExampleMenuContextPoints: () => ({}),
          liveExampleMenuOpenValues: () => ({}),
          liveExampleMenuOpenSubmenuValues: () => ({}),
          liveExampleMenuValues: () => ({}),
        }),
        [],
      ],
      UpdatedSearchQuery: ({ value }) => {
        if (value === model.searchQuery) {
          return [model, []]
        }

        if (EffectString.isEmpty(EffectString.trim(value))) {
          return [
            evo(model, {
              searchQuery: () => value,
              pagefindSearch: () => IdlePagefindSearch(),
            }),
            [],
          ]
        }

        return [
          evo(model, {
            searchQuery: () => value,
            pagefindSearch: () =>
              LoadingPagefindSearch({
                results: pagefindResultsFromState(model.pagefindSearch),
              }),
          }),
          [SearchPagefind({ query: value })],
        ]
      },
      ReceivedPagefindSearchResults: ({ results, query }) =>
        query === model.searchQuery
          ? [
            evo(model, {
              pagefindSearch: () => LoadedPagefindSearch({ results }),
            }),
            [],
          ]
          : [model, []],
      ClickedClearSearch: () => [
        evo(model, {
          searchQuery: () => '',
          pagefindSearch: () => IdlePagefindSearch(),
        }),
        [],
      ],
    }),
  )

// SUBSCRIPTION

const isCommandComponentRoute = (route: AppRoute): boolean =>
  route._tag === 'ComponentDetail' &&
  route.namespace === 'shadcn' &&
  route.slug === 'command'

const isComponentDetailRoute = (route: AppRoute): boolean =>
  route._tag === 'ComponentDetail'

const isCommandDialogShortcut = (event: KeyboardEvent): boolean =>
  (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'j'

export const subscriptions = Subscription.make<Model, Message>()(entry => ({
  liveExampleEscape: entry(
    { isComponentDetailRoute: S.Boolean },
    {
      modelToDependencies: model => ({
        isComponentDetailRoute: isComponentDetailRoute(model.route),
      }),
      dependenciesToStream: ({ isComponentDetailRoute }) =>
        Stream.when(
          Stream.callback<Message>(queue =>
            Effect.acquireRelease(
              Effect.sync(() => {
                const handler = (event: KeyboardEvent) => {
                  if (event.key === 'Escape' && event.shiftKey !== true) {
                    Queue.offerUnsafe(queue, PressedEscapeLiveExampleSurface())
                  }
                }
                document.addEventListener('keydown', handler, {
                  capture: true,
                })
                return handler
              }),
              handler =>
                Effect.sync(() =>
                  document.removeEventListener('keydown', handler, {
                    capture: true,
                  }),
                ),
            ).pipe(Effect.flatMap(() => Effect.never)),
          ),
          Effect.sync(() => isComponentDetailRoute),
        ),
    },
  ),
  liveExampleOutsidePointer: entry(
    { isComponentDetailRoute: S.Boolean },
    {
      modelToDependencies: model => ({
        isComponentDetailRoute: isComponentDetailRoute(model.route),
      }),
      dependenciesToStream: ({ isComponentDetailRoute }) =>
        Stream.when(
          Stream.callback<Message>(queue =>
            Effect.acquireRelease(
              Effect.sync(() => {
                const handler = (event: PointerEvent) => {
                  if (
                    event.target instanceof Element &&
                    event.target.closest('.live-example-preview') === null
                  ) {
                    Queue.offerUnsafe(
                      queue,
                      PressedPointerOutsideLiveExampleSurface(),
                    )
                  }
                }
                document.addEventListener('pointerdown', handler)
                return handler
              }),
              handler =>
                Effect.sync(() =>
                  document.removeEventListener('pointerdown', handler),
                ),
            ).pipe(Effect.flatMap(() => Effect.never)),
          ),
          Effect.sync(() => isComponentDetailRoute),
        ),
    },
  ),
  commandDialogShortcut: entry(
    { isCommandComponentRoute: S.Boolean },
    {
      modelToDependencies: model => ({
        isCommandComponentRoute: isCommandComponentRoute(model.route),
      }),
      dependenciesToStream: ({ isCommandComponentRoute }) =>
        Stream.when(
          Stream.callback<Message>(queue =>
            Effect.acquireRelease(
              Effect.sync(() => {
                const handler = (event: KeyboardEvent) => {
                  if (isCommandDialogShortcut(event)) {
                    event.preventDefault()
                    Queue.offerUnsafe(
                      queue,
                      PressedLiveExampleCommandDialogShortcut(),
                    )
                  }
                }
                document.addEventListener('keydown', handler)
                return handler
              }),
              handler =>
                Effect.sync(() =>
                  document.removeEventListener('keydown', handler),
                ),
            ).pipe(Effect.flatMap(() => Effect.never)),
          ),
          Effect.sync(() => isCommandComponentRoute),
      ),
    },
  ),
  liveExampleResizablePointer: entry(
    { activeDrags: S.Array(LiveExampleResizableActiveDrag) },
    {
      modelToDependencies: model => ({
        activeDrags: liveExampleResizableActiveDrags(
          model.liveExampleResizableStates,
        ),
      }),
      dependenciesToStream: ({ activeDrags }) =>
        Stream.when(
          Stream.callback<Message>(queue =>
            Effect.acquireRelease(
              Effect.sync(() => {
                const offerToActiveDrags = (message: ResizableMessage): void => {
                  activeDrags.map(activeDrag =>
                    Queue.offerUnsafe(
                      queue,
                      GotLiveExampleResizableMessage({
                        exampleId: activeDrag.exampleId,
                        groupId: activeDrag.groupId,
                        message,
                      }),
                    ),
                  )
                }

                const handlePointerMove = (event: PointerEvent) => {
                  offerToActiveDrags(
                    MovedResizablePointer({
                      screenX: event.screenX,
                      screenY: event.screenY,
                    }),
                  )
                }
                const handlePointerEnd = () => {
                  offerToActiveDrags(EndedResizableDrag())
                }

                document.addEventListener('pointermove', handlePointerMove)
                document.addEventListener('pointerup', handlePointerEnd)
                document.addEventListener('pointercancel', handlePointerEnd)
                window.addEventListener('blur', handlePointerEnd)

                return () => {
                  document.removeEventListener(
                    'pointermove',
                    handlePointerMove,
                  )
                  document.removeEventListener('pointerup', handlePointerEnd)
                  document.removeEventListener(
                    'pointercancel',
                    handlePointerEnd,
                  )
                  window.removeEventListener('blur', handlePointerEnd)
                }
              }),
              cleanup => Effect.sync(cleanup),
            ).pipe(Effect.flatMap(() => Effect.never)),
          ),
          Effect.sync(() => activeDrags.length > 0),
        ),
    },
  ),
}))

// VIEW

type PrimaryNavSection =
  | 'home'
  | 'docs'
  | 'components'
  | 'registry'
  | 'roadmap'
  | 'not-found'

const navLinks: ReadonlyArray<
  Readonly<{
    label: string
    href: string
    section: PrimaryNavSection
  }>
> = [
    { label: 'Home', href: homeRouter({}), section: 'home' },
    { label: 'Docs', href: docsRouter({}), section: 'docs' },
    {
      label: 'Components',
      href: componentsIndexRouter({}),
      section: 'components',
    },
    { label: 'Registry', href: registryRouter({}), section: 'registry' },
    { label: 'Roadmap', href: roadmapRouter({}), section: 'roadmap' },
  ]

const primaryNavSection = (route: AppRoute): PrimaryNavSection =>
  M.value(route).pipe(
    M.withReturnType<PrimaryNavSection>(),
    M.tagsExhaustive({
      Home: () => 'home',
      Docs: () => 'docs',
      ComponentsIndex: () => 'components',
      ComponentsNamespace: () => 'components',
      ComponentDetail: () => 'components',
      Registry: () => 'registry',
      RegistrySchema: () => 'registry',
      RegistryLifecycle: () => 'registry',
      Roadmap: () => 'roadmap',
      NotFound: () => 'not-found',
    }),
  )

const statusText = (value: string): string => value.replaceAll('-', ' ')

const statusBadgeView = (value: string): Html => {
  const h = html<Message>()

  return h.span([h.Class(`status-badge status-${value}`)], [
    statusText(value),
  ])
}

const navLinkView = (
  label: string,
  href: string,
  isActive: boolean,
): Html => {
  const h = html<Message>()

  return h.a(
    [
      h.Class(isActive ? 'docs-nav-link active' : 'docs-nav-link'),
      h.Href(href),
      ...(isActive ? [h.AriaCurrent('page')] : []),
    ],
    [label],
  )
}

const headerView = (model: Model): Html => {
  const h = html<Message>()
  const activeSection = primaryNavSection(model.route)

  return h.header(
    [h.Class('site-header'), h.DataAttribute('pagefind-ignore', '')],
    [
      h.a([h.Class('brand-link'), h.Href(homeRouter({}))], [
        h.span([h.Class('brand-mark'), h.AriaHidden(true)], ['F']),
        h.span([h.Class('brand-wordmark')], ['Foldkit']),
        h.span([h.Class('brand-cn')], ['CN']),
      ]),
      h.nav([h.Class('desktop-nav'), h.AriaLabel('Primary')], [
        ...navLinks.map(link =>
          navLinkView(
            link.label,
            link.href,
            link.section === activeSection,
          ),
        ),
      ]),
      h.button(
        [
          h.Type('button'),
          h.Class('mobile-nav-toggle'),
          h.AriaLabel('Toggle navigation'),
          h.AriaExpanded(model.mobileNavigation.isOpen),
          h.OnClick(ClickedToggleMobileNavigation()),
        ],
        ['Menu'],
      ),
    ],
  )
}

const mobileNavigationView = (model: Model): Html => {
  const h = html<Message>()
  const activeSection = primaryNavSection(model.route)

  return h.keyed('nav')(
    model.mobileNavigation.isOpen ? 'mobile-open' : 'mobile-closed',
    [
      h.Class(
        model.mobileNavigation.isOpen
          ? 'mobile-nav mobile-nav-open'
          : 'mobile-nav',
      ),
      h.AriaLabel('Mobile'),
      h.DataAttribute('pagefind-ignore', ''),
    ],
    navLinks.map(link =>
      navLinkView(link.label, link.href, link.section === activeSection),
    ),
  )
}

const componentSlug = (component: PublicComponent): string =>
  component.entry.item.id.split('/')[1] ?? ''

const componentHref = (component: PublicComponent): string =>
  componentDetailRouter({
    namespace: component.entry.item.namespace,
    slug: componentSlug(component),
  })

const isComponentsIndexRoute = (route: AppRoute): boolean =>
  M.value(route).pipe(
    M.withReturnType<boolean>(),
    M.tagsExhaustive({
      Home: () => false,
      Docs: () => false,
      ComponentsIndex: () => true,
      ComponentsNamespace: () => false,
      ComponentDetail: () => false,
      Registry: () => false,
      RegistrySchema: () => false,
      RegistryLifecycle: () => false,
      Roadmap: () => false,
      NotFound: () => false,
    }),
  )

const isComponentNamespaceActive = (
  route: AppRoute,
  namespace: string,
): boolean =>
  M.value(route).pipe(
    M.withReturnType<boolean>(),
    M.tagsExhaustive({
      Home: () => false,
      Docs: () => false,
      ComponentsIndex: () => false,
      ComponentsNamespace: route => route.namespace === namespace,
      ComponentDetail: route => route.namespace === namespace,
      Registry: () => false,
      RegistrySchema: () => false,
      RegistryLifecycle: () => false,
      Roadmap: () => false,
      NotFound: () => false,
    }),
  )

const isComponentLinkActive = (
  route: AppRoute,
  component: PublicComponent,
): boolean =>
  M.value(route).pipe(
    M.withReturnType<boolean>(),
    M.tagsExhaustive({
      Home: () => false,
      Docs: () => false,
      ComponentsIndex: () => false,
      ComponentsNamespace: () => false,
      ComponentDetail: ({ namespace, slug }) =>
        component.entry.item.id === `${namespace}/${slug}`,
      Registry: () => false,
      RegistrySchema: () => false,
      RegistryLifecycle: () => false,
      Roadmap: () => false,
      NotFound: () => false,
    }),
  )

const searchResultView = (component: PublicComponent): Html => {
  const h = html<Message>()

  return h.li([h.Class('search-result')], [
    h.a([h.Href(componentHref(component))], [
      h.span([h.Class('search-result-title')], [component.entry.item.name]),
      h.code([], [component.entry.item.id]),
    ]),
    h.div(
      [h.Class('badge-row')],
      componentSearchBadges(component).map(statusBadgeView),
    ),
  ])
}

const htmlTagPattern = /<[^>]+>/gu

const pagefindExcerptText = (excerpt: string): string =>
  excerpt.replaceAll(htmlTagPattern, '')

const pagefindSearchResultView = (result: PagefindSearchResult): Html => {
  const h = html<Message>()

  return h.li([h.Class('search-result')], [
    h.a([h.Href(result.url)], [
      h.span([h.Class('search-result-title')], [result.title]),
      h.code([], [result.url]),
    ]),
    h.p([h.Class('search-excerpt')], [pagefindExcerptText(result.excerpt)]),
  ])
}

const searchResultsGroupView = (
  label: string,
  results: Html,
): Html => {
  const h = html<Message>()

  return h.section([h.Class('search-results-group')], [
    h.h3([h.Class('search-results-heading')], [label]),
    results,
  ])
}

const componentSearchResultsView = (
  results: ReadonlyArray<PublicComponent>,
): Html => {
  const h = html<Message>()

  return Array.match(results, {
    onEmpty: () => h.empty,
    onNonEmpty: matches =>
      searchResultsGroupView(
        'Components',
        h.ul([h.Class('search-results'), h.AriaLabel('Component search results')], [
          ...matches.map(searchResultView),
        ]),
      ),
  })
}

const pagefindSearchResultsView = (state: PagefindSearch): Html => {
  const h = html<Message>()

  return M.value(state).pipe(
    M.withReturnType<Html>(),
    M.tagsExhaustive({
      IdlePagefindSearch: () => h.empty,
      LoadingPagefindSearch: ({ results }) =>
        Array.match(results, {
          onEmpty: () =>
            h.p([h.Class('search-empty'), h.Role('status')], [
              'Searching documentation...',
            ]),
          onNonEmpty: matches =>
            searchResultsGroupView(
              'Documentation',
              h.ul(
                [
                  h.Class('search-results'),
                  h.AriaLabel('Full-text search results'),
                ],
                [...matches.map(pagefindSearchResultView)],
              ),
            ),
        }),
      LoadedPagefindSearch: ({ results }) =>
        Array.match(results, {
          onEmpty: () => h.empty,
          onNonEmpty: matches =>
            searchResultsGroupView(
              'Documentation',
              h.ul(
                [
                  h.Class('search-results'),
                  h.AriaLabel('Full-text search results'),
                ],
                [...matches.map(pagefindSearchResultView)],
              ),
            ),
        }),
    }),
  )
}

const searchResultsView = (
  query: string,
  componentResults: ReadonlyArray<PublicComponent>,
  pagefindSearch: PagefindSearch,
): Html => {
  const h = html<Message>()
  const fullTextResults = pagefindResultsFromState(pagefindSearch)
  const isLoading = pagefindSearch._tag === 'LoadingPagefindSearch'
  const hasNoComponentResults = Array.match(componentResults, {
    onEmpty: () => true,
    onNonEmpty: () => false,
  })
  const hasNoFullTextResults = Array.match(fullTextResults, {
    onEmpty: () => true,
    onNonEmpty: () => false,
  })

  if (EffectString.isEmpty(EffectString.trim(query))) {
    return h.empty
  }

  if (
    hasNoComponentResults &&
    hasNoFullTextResults &&
    !isLoading
  ) {
    return h.p([h.Class('search-empty'), h.Role('status')], [
      'No public docs match that search.',
    ])
  }

  return h.div([h.Class('search-results-stack')], [
    componentSearchResultsView(componentResults),
    pagefindSearchResultsView(pagefindSearch),
  ])
}

const componentSearchView = (model: Model): Html => {
  const h = html<Message>()
  const results = searchPublicComponents(
    publicComponents(model.data),
    model.searchQuery,
  )
  const isClearDisabled = EffectString.isEmpty(
    EffectString.trim(model.searchQuery),
  )

  return h.div(
    [
      h.Class('component-search'),
      h.Role('search'),
      h.AriaLabel('Documentation search'),
    ],
    [
      h.label([h.For('component-search-input'), h.Class('search-label')], [
        'Search documentation',
      ]),
      ShadcnInputGroup.InputGroup({
        className: 'search-control',
        children: [
          ShadcnInputGroup.InputGroupInput({
            id: 'component-search-input',
            type: 'search',
            placeholder: 'Search components and docs',
            value: model.searchQuery,
            onValueChange: ({ value }) => UpdatedSearchQuery({ value }),
          }),
          ShadcnInputGroup.InputGroupButton({
            className: 'search-clear-button',
            size: 'icon-xs',
            ariaLabel: 'Clear component search',
            isDisabled: isClearDisabled,
            onClick: ClickedClearSearch(),
            children: ['×'],
          }),
        ],
      }),
      searchResultsView(model.searchQuery, results, model.pagefindSearch),
    ],
  )
}

const componentNavigationView = (
  model: Model,
  groups: ReadonlyArray<NamespaceGroup>,
): Html => {
  const h = html<Message>()

  return h.nav([h.AriaLabel('Component navigation')], [
    h.a(
      [
        h.Class(
          isComponentsIndexRoute(model.route)
            ? 'sidebar-root-link active'
            : 'sidebar-root-link',
        ),
        h.Href(componentsIndexRouter({})),
        ...(isComponentsIndexRoute(model.route) ? [h.AriaCurrent('page')] : []),
      ],
      ['All components'],
    ),
    ...groups.map(group =>
      h.section([h.Class('sidebar-group')], [
        h.h2([h.Class('sidebar-heading')], [
          h.a(
            [
              h.Href(componentsNamespaceRouter({ namespace: group.namespace })),
              ...(isComponentNamespaceActive(model.route, group.namespace)
                ? [h.Class('active')]
                : []),
            ],
            [group.label],
          ),
        ]),
        h.ul(
          [h.Class('sidebar-list')],
          group.components.map(component =>
            h.keyed('li')(
              component.entry.item.id,
              [],
              [
                h.a(
                  [
                    h.Href(componentHref(component)),
                    h.AriaLabel(
                      `${component.entry.item.name} (${component.entry.item.id})`,
                    ),
                    ...(isComponentLinkActive(model.route, component)
                      ? [h.Class('active'), h.AriaCurrent('page')]
                      : []),
                  ],
                  [
                    h.span([], [component.entry.item.name]),
                    component.entry.item.lifecycle.availability === 'preview'
                      ? statusBadgeView('preview')
                      : h.empty,
                  ],
                ),
              ],
            ),
          ),
        ),
      ]),
    ),
  ])
}

const sidebarView = (
  model: Model,
  groups: ReadonlyArray<NamespaceGroup>,
): Html => {
  const h = html<Message>()

  return h.aside(
    [h.Class('docs-sidebar'), h.DataAttribute('pagefind-ignore', '')],
    [
      h.section([h.Class('docs-sidebar-section docs-sidebar-search')], [
        componentSearchView(model),
      ]),
      h.section([h.Class('docs-sidebar-section docs-sidebar-components')], [
        h.h2([h.Class('sidebar-heading docs-sidebar-section-heading')], [
          'Components',
        ]),
        componentNavigationView(model, groups),
      ]),
    ],
  )
}

const exampleAnchorId = (example: ExampleDocsArtifact): string =>
  example.id.replaceAll(/[^a-z0-9_-]+/giu, '-')

const tableOfContentsComponent = (
  model: Model,
): Option.Option<PublicComponent> =>
  M.value(model.route).pipe(
    M.withReturnType<Option.Option<PublicComponent>>(),
    M.tagsExhaustive({
      Home: () => Option.none(),
      Docs: () => Option.none(),
      ComponentsIndex: () => Option.none(),
      ComponentsNamespace: () => Option.none(),
      ComponentDetail: ({ namespace, slug }) =>
        findRoutedComponent(model.data, namespace, slug),
      Registry: () => Option.none(),
      RegistrySchema: () => Option.none(),
      RegistryLifecycle: () => Option.none(),
      Roadmap: () => Option.none(),
      NotFound: () => Option.none(),
    }),
  )

const tableOfContentsExampleLinksView = (
  component: PublicComponent,
): Html => {
  const h = html<Message>()

  return Option.match(component.maybeDocsArtifact, {
    onNone: () => h.empty,
    onSome: artifact =>
      Array.isReadonlyArrayEmpty(artifact.examples)
        ? h.empty
        : h.ul(
          [h.Class('toc-example-list')],
          artifact.examples.map(example =>
            h.li([], [
              h.a([h.Href(`#${exampleAnchorId(example)}`)], [example.title]),
            ]),
          ),
        ),
  })
}

const tableOfContentsView = (
  maybeComponent: Option.Option<PublicComponent>,
): Html => {
  const h = html<Message>()

  return Option.match(maybeComponent, {
    onNone: () => h.empty,
    onSome: component =>
      h.aside(
        [
          h.Class('docs-toc'),
          h.AriaLabel('On this page'),
          h.DataAttribute('pagefind-ignore', ''),
        ],
        [
          h.p([h.Class('toc-heading')], ['On this page']),
          h.a([h.Href('#overview')], ['Overview']),
          h.a([h.Href('#installation')], ['Installation']),
          h.a([h.Href('#usage')], ['Usage']),
          h.div([h.Class('toc-group')], [
            h.a([h.Href('#examples')], ['Examples']),
            tableOfContentsExampleLinksView(component),
          ]),
          h.a([h.Href('#api')], ['API']),
          h.a([h.Href('#accessibility')], ['Accessibility']),
          h.a([h.Href('#quality')], ['Quality']),
          h.a([h.Href('#source')], ['Source']),
          h.a([h.Href('#foldkit-differences')], ['Foldkit Differences']),
        ],
      ),
  })
}

const shellView = (model: Model, content: Html): Html => {
  const h = html<Message>()
  const groups = namespaceGroups(model.data)
  const maybeTableOfContents = tableOfContentsComponent(model)
  const layoutClass = Option.match(maybeTableOfContents, {
    onNone: () => 'docs-layout no-toc',
    onSome: () => 'docs-layout has-toc',
  })

  return h.div([h.Class('app-shell')], [
    headerView(model),
    mobileNavigationView(model),
    h.div([h.Class(layoutClass)], [
      sidebarView(model, groups),
      h.main(
        [
          h.Id('main-content'),
          h.Class('docs-main'),
          h.DataAttribute('pagefind-body', ''),
        ],
        [
          h.keyed('div')(
            model.route._tag,
            [h.Class('route-frame')],
            [content],
          ),
        ],
      ),
      tableOfContentsView(maybeTableOfContents),
    ]),
  ])
}

const dataNoticeView = (data: DocsData): Html => {
  const h = html<Message>()

  return M.value(data).pipe(
    M.withReturnType<Html>(),
    M.tagsExhaustive({
      LoadedDocsData: () =>
        h.p([h.Class('eyebrow')], [
          `${generatedComponentCount(data)} public component docs artifacts generated`,
        ]),
      FailedDocsData: ({ message }) =>
        h.p([h.Class('data-error'), h.Role('status')], [
          `Generated registry artifacts could not be loaded: ${message}`,
        ]),
    }),
  )
}

const pageHeaderView = (
  eyebrow: string,
  title: string,
  summary: string,
): Html => {
  const h = html<Message>()

  return h.header([h.Class('page-header')], [
    h.p(
      [h.Class('eyebrow'), h.DataAttribute('pagefind-meta', 'section')],
      [eyebrow],
    ),
    h.h1([h.Id('overview')], [title]),
    h.p([h.Class('lede')], [summary]),
  ])
}

const homePageView = (model: Model): Html => {
  const h = html<Message>()

  return h.article([], [
    pageHeaderView(
      'Registry documentation',
      'Foldkit CN',
      'A Foldkit-native front door for installable component registry artifacts.',
    ),
    dataNoticeView(model.data),
    h.section([h.Id('status'), h.Class('content-section')], [
      h.h2([], ['What is here now']),
      h.p([], [
        'The shell reads generated registry outputs, separates public components by namespace, and gives Registry and Roadmap pages stable URLs for the next documentation passes.',
      ]),
      h.div([h.Class('action-row')], [
        h.a([h.Class('action-link'), h.Href(componentsIndexRouter({}))], [
          'Browse components',
        ]),
        h.a([h.Class('action-link'), h.Href(registryRouter({}))], [
          'Inspect registry',
        ]),
      ]),
    ]),
  ])
}

const docsPageView = (): Html => {
  const h = html<Message>()

  return h.article([], [
    pageHeaderView(
      'Docs',
      'Documentation overview',
      'The docs site starts with generated registry data, then layers authored guidance onto each artifact.',
    ),
    h.section([h.Id('status'), h.Class('content-section')], [
      h.h2([], ['Start points']),
      h.ul([h.Class('link-list')], [
        h.li([], [
          h.a([h.Href(componentsIndexRouter({}))], ['Components']),
          ' lists installable and preview component rows.',
        ]),
        h.li([], [
          h.a([h.Href(registrySchemaRouter({}))], ['Registry Schema']),
          ' names the generated artifact boundary.',
        ]),
        h.li([], [
          h.a([h.Href(registryLifecycleRouter({}))], ['Registry Lifecycle']),
          ' explains availability, parity, drift, and docs readiness.',
        ]),
      ]),
    ]),
  ])
}

const componentSummaryView = (component: PublicComponent): Html => {
  const h = html<Message>()

  return h.keyed('article')(
    component.entry.item.id,
    [h.Class('component-row')],
    [
      h.div([], [
        h.h3([], [
          h.a(
            [
              h.Href(
                componentDetailRouter({
                  namespace: component.entry.item.namespace,
                  slug: component.entry.item.id.split('/')[1] ?? '',
                }),
              ),
            ],
            [component.entry.item.name],
          ),
        ]),
        h.p([], [component.entry.item.description]),
      ]),
      h.dl([h.Class('meta-list')], [
        h.div([], [
          h.dt([], ['Availability']),
          h.dd([], [component.entry.item.lifecycle.availability]),
        ]),
        h.div([], [
          h.dt([], ['Docs']),
          h.dd([], [component.entry.item.lifecycle.docsStatus]),
        ]),
      ]),
    ],
  )
}

const componentsIndexPageView = (model: Model): Html => {
  const h = html<Message>()
  const groups = namespaceGroups(model.data)

  return h.article([], [
    pageHeaderView(
      'Components',
      'Components',
      'Installable and preview components from the generated registry and docs indexes.',
    ),
    h.section([h.Id('status'), h.Class('content-section')], [
      h.h2([], ['Namespaces']),
      ...groups.map(group =>
        h.section([h.Class('namespace-section')], [
          h.h3([], [
            h.a(
              [
                h.Href(
                  componentsNamespaceRouter({ namespace: group.namespace }),
                ),
              ],
              [group.label],
            ),
          ]),
          ...group.components.map(componentSummaryView),
        ]),
      ),
    ]),
  ])
}

const componentsNamespacePageView = (
  model: Model,
  namespace: string,
): Html => {
  const h = html<Message>()
  const maybeGroup = pipe(
    namespaceGroups(model.data),
    Array.findFirst(group => group.namespace === namespace),
  )

  return Option.match(maybeGroup, {
    onNone: () =>
      notFoundPageView(
        NotFoundRoute({ path: componentsNamespaceRouter({ namespace }) }),
      ),
    onSome: group =>
      h.article([], [
        pageHeaderView(
          'Components',
          `${group.label} components`,
          'Public component rows for this registry namespace.',
        ),
        h.section([h.Id('status'), h.Class('content-section')], [
          h.h2([], ['Generated entries']),
          ...group.components.map(componentSummaryView),
        ]),
      ]),
  })
}

const installCommandFor = (itemId: string): string =>
  `bunx foldkitcn add ${itemId}`

const physicalInstallPathFor = (itemId: string): string =>
  `src/components/foldkitcn/${itemId}.ts`

const aliasImportPathFor = (itemId: string): string =>
  `@/components/foldkitcn/${itemId}`

const importSnippetFor = (component: PublicComponent): string =>
  `import { ${component.entry.item.name} } from '${aliasImportPathFor(
    component.entry.item.id,
  )}'`

const isDocsOnlyComponent = (component: PublicComponent): boolean =>
  component.entry.item.lifecycle.availability === 'preview' &&
  Option.match(component.maybeDocsArtifact, {
    onNone: () => false,
    onSome: artifact =>
      Array.isReadonlyArrayEmpty(artifact.installableSourcePaths),
  })

const snippetBlockView = (
  text: string,
  ariaLabel: string,
  copiedSnippets: HashSet.HashSet<string>,
): Html => {
  const h = html<Message>()
  const isCopied = HashSet.has(copiedSnippets, text)

  return h.div([h.Class('snippet-block')], [
    h.pre(
      [h.Class('code-block'), h.DataAttribute('pagefind-ignore', '')],
      [h.code([], [text])],
    ),
    h.button(
      [
        h.Type('button'),
        h.Class('copy-button'),
        h.AriaLabel(ariaLabel),
        h.OnClick(ClickedCopySnippet({ text })),
      ],
      [h.span([h.AriaHidden(true)], ['Copy'])],
    ),
    h.span(
      [h.Role('status'), h.AriaLive('polite'), h.Class('sr-only')],
      [isCopied ? 'Copied to clipboard' : ''],
    ),
  ])
}

const dependenciesPanelView = (component: PublicComponent): Html => {
  const h = html<Message>()

  return Option.match(component.maybeDocsArtifact, {
    onNone: () => h.empty,
    onSome: artifact => {
      const registryDependencies =
        artifact.dependencies?.registry ?? component.entry.item.dependencies.registry

      return Array.match(registryDependencies, {
        onEmpty: () => h.empty,
        onNonEmpty: dependencies =>
          h.aside([h.Class('relationship-panel'), h.AriaLabel('Composes')], [
            h.h2([], ['Composes']),
            h.ul(
              [h.Class('compact-list')],
              dependencies.map(dependency =>
                h.li([], [h.code([], [dependency.target])]),
              ),
            ),
          ]),
      })
    },
  })
}

const installationSectionView = (
  component: PublicComponent,
  copiedSnippets: HashSet.HashSet<string>,
): Html => {
  const h = html<Message>()
  const availability = component.entry.item.lifecycle.availability

  return h.section([h.Id('installation'), h.Class('content-section')], [
    h.h2([], ['Installation']),
    isDocsOnlyComponent(component)
      ? h.p([], [
          'This docs-only page has no installable component. Foldkit CN does not ship default typography styles or a Typography helper.',
        ])
      : M.value(availability).pipe(
          M.withReturnType<Html>(),
          M.when('installable', () =>
            h.div([], [
              h.p([], [
                'Install the component into your app, then import it from the generated local namespace.',
              ]),
              snippetBlockView(
                installCommandFor(component.entry.item.id),
                `Copy ${component.entry.item.name} install command`,
                copiedSnippets,
              ),
            ]),
          ),
          M.when('preview', () =>
            h.p([], [
              'This component is in preview. The public install command is not enabled for this row yet.',
            ]),
          ),
          M.when('private', () =>
            h.p([], [
              'This component is private. It is hidden from public navigation and is not installable from the public docs site.',
            ]),
          ),
          M.orElse(() =>
            h.p([], [
              'This component is tracked as roadmap work. Install instructions will appear after the registry marks it installable.',
            ]),
          ),
        ),
  ])
}

const docsOnlyUsageView = (): Html => {
  const h = html<Message>()

  return h.div([], [
    h.p([], [
      'Apply utility classes directly to semantic HTML inside your Foldkit views. There is no generated Typography import for this docs-only row.',
    ]),
    h.pre(
      [h.Class('code-block'), h.DataAttribute('pagefind-ignore', '')],
      [
        h.code([], [
          "h.h1([h.Class('scroll-m-20 text-4xl font-extrabold tracking-tight')], ['Taxing Laughter: The Joke Tax Chronicles'])",
        ]),
      ],
    ),
  ])
}

const usageSectionView = (
  component: PublicComponent,
  copiedSnippets: HashSet.HashSet<string>,
): Html => {
  const h = html<Message>()

  return h.section([h.Id('usage'), h.Class('content-section')], [
    h.h2([], ['Usage']),
    isDocsOnlyComponent(component)
      ? docsOnlyUsageView()
      : Option.match(component.maybeDocsArtifact, {
          onNone: () =>
            h.p([], [
              'Usage guidance is waiting for the generated docs artifact.',
            ]),
          onSome: artifact =>
            h.div([], [
              h.p([], [
                'Import the helper from the generated local namespace and call it from a Foldkit view after binding the Html factory.',
              ]),
              snippetBlockView(
                importSnippetFor(component),
                `Copy ${component.entry.item.name} import snippet`,
                copiedSnippets,
              ),
              h.dl([h.Class('meta-list wide')], [
                h.div([], [
                  h.dt([], ['Default physical path']),
                  h.dd([], [physicalInstallPathFor(artifact.itemId)]),
                ]),
                h.div([], [
                  h.dt([], ['Default alias']),
                  h.dd([], [aliasImportPathFor(artifact.itemId)]),
                ]),
              ]),
            ]),
        }),
  ])
}

const examplesSectionView = (
  component: PublicComponent,
  copiedSnippets: HashSet.HashSet<string>,
  liveExampleInputValues: Readonly<Record<string, string>>,
  liveExampleOtpValues: Readonly<Record<string, string>>,
  liveExampleSliderValues: Readonly<Record<string, ReadonlyArray<number>>>,
  liveExampleSelectOpenValues: Readonly<Record<string, boolean>>,
  liveExampleSelectValues: Readonly<Record<string, string>>,
  liveExampleComboboxOpenValues: Readonly<Record<string, boolean>>,
  liveExampleComboboxInputValues: Readonly<Record<string, string>>,
  liveExampleComboboxValues: Readonly<Record<string, string>>,
  liveExampleComboboxMultipleValues: Readonly<
    Record<string, ReadonlyArray<string>>
  >,
  liveExampleRadioGroupValues: Readonly<Record<string, string>>,
  liveExampleCheckboxCheckedStates: Readonly<Record<string, string>>,
  liveExampleSwitchCheckedValues: Readonly<Record<string, boolean>>,
  liveExampleAccordionValues: Readonly<Record<string, ReadonlyArray<string>>>,
  liveExampleCollapsibleOpenValues: Readonly<Record<string, boolean>>,
  liveExampleTabsValues: Readonly<Record<string, string>>,
  liveExampleTogglePressedValues: Readonly<Record<string, boolean>>,
  liveExampleToggleGroupValues: Readonly<
    Record<string, ReadonlyArray<string>>
  >,
  liveExampleCalendarSelectedDates: Readonly<Record<string, string>>,
  liveExampleCalendarVisibleMonths: Readonly<Record<string, string>>,
  liveExampleCarouselSelectedIndexes: Readonly<Record<string, number>>,
  liveExampleResizableStates: Readonly<Record<string, ResizableState>>,
  liveExampleCommandDialogOpenValues: Readonly<Record<string, boolean>>,
  liveExampleOverlayOpenValues: Readonly<Record<string, boolean>>,
  liveExampleMenuOpenValues: Readonly<Record<string, boolean>>,
  liveExampleMenuOpenSubmenuValues: Readonly<
    Record<string, ReadonlyArray<string>>
  >,
  liveExampleMenuContextPoints: Readonly<
    Record<string, typeof ContextMenuPoint.Type>
  >,
  liveExampleMenuValues: Readonly<Record<string, string>>,
  liveExampleMenuCheckedValues: Readonly<Record<string, boolean>>,
  liveExampleMenuRadioValues: Readonly<Record<string, string>>,
  liveExampleDataTableStates: Readonly<
    Record<string, typeof LiveExampleDataTableState.Type>
  >,
  liveExampleDatePickerStates: Readonly<Record<string, DatePickerModelType>>,
  liveExampleToastStates: Readonly<Record<string, ToastPrimitive.ToastState>>,
  liveExampleSidebarOpenValues: Readonly<Record<string, boolean>>,
  liveExampleSidebarPanelOpenValues: Readonly<Record<string, boolean>>,
  liveExampleSidebarSelectedValues: Readonly<Record<string, string>>,
): Html => {
  const h = html<Message>()
  const liveExampleContext = {
    inputValueFor: (
      example: ExampleDocsArtifact,
      defaultValue: string,
    ): string =>
      pipe(
        EffectRecord.get(liveExampleInputValues, example.id),
        Option.getOrElse(() => defaultValue),
      ),
    inputIdPrefixFor: (example: ExampleDocsArtifact): string =>
      `${example.id.replaceAll(/[^a-z0-9_-]+/giu, '-')}-`,
    onInputValueChange: (
      example: ExampleDocsArtifact,
      change: Readonly<{ value: string }>,
    ): Message =>
      UpdatedLiveExampleInputValue({
        exampleId: example.id,
        value: change.value,
      }),
    otpValueFor: (
      example: ExampleDocsArtifact,
      defaultValue: string,
    ): string =>
      pipe(
        EffectRecord.get(liveExampleOtpValues, example.id),
        Option.getOrElse(() => defaultValue),
      ),
    onOtpValueChange: (
      example: ExampleDocsArtifact,
      change: OTPFieldValueChange,
    ): Message =>
      UpdatedLiveExampleOtpValue({
        exampleId: example.id,
        value: change.value,
        isComplete: change.isComplete,
        focusSelector: change.focusSelector,
      }),
    sliderValuesFor: (
      example: ExampleDocsArtifact,
      sliderId: string,
      defaultValues: ReadonlyArray<number>,
    ): ReadonlyArray<number> =>
      pipe(
        EffectRecord.get(
          liveExampleSliderValues,
          liveExampleControlStateKey(example.id, sliderId),
        ),
        Option.getOrElse(() => defaultValues),
      ),
    onSliderValueChange: (
      example: ExampleDocsArtifact,
      sliderId: string,
      change: Readonly<{ values: ReadonlyArray<number> }>,
    ): Message =>
      UpdatedLiveExampleSliderValues({
        exampleId: example.id,
        sliderId,
        values: [...change.values],
      }),
    selectIsOpenFor: (example: ExampleDocsArtifact): boolean =>
      pipe(
        EffectRecord.get(liveExampleSelectOpenValues, example.id),
        Option.getOrElse(() => false),
      ),
    selectValueFor: (
      example: ExampleDocsArtifact,
      defaultValue: string | undefined,
    ): string | undefined =>
      pipe(
        EffectRecord.get(liveExampleSelectValues, example.id),
        Option.getOrElse(() => defaultValue),
      ),
    onSelectOpenChange: (
      example: ExampleDocsArtifact,
      change: Readonly<{ open: boolean }>,
    ): Message =>
      UpdatedLiveExampleSelectOpen({
        exampleId: example.id,
        open: change.open,
      }),
    onSelectValueChange: (
      example: ExampleDocsArtifact,
      change: Readonly<{ value: string }>,
    ): Message =>
      SelectedLiveExampleSelectValue({
        exampleId: example.id,
        value: change.value,
      }),
    comboboxIsOpenFor: (example: ExampleDocsArtifact): boolean =>
      pipe(
        EffectRecord.get(liveExampleComboboxOpenValues, example.id),
        Option.getOrElse(() => false),
      ),
    maybeComboboxInputValueFor: (example: ExampleDocsArtifact) =>
      EffectRecord.get(liveExampleComboboxInputValues, example.id),
    comboboxInputValueFor: (
      example: ExampleDocsArtifact,
      defaultValue: string,
    ): string =>
      pipe(
        EffectRecord.get(liveExampleComboboxInputValues, example.id),
        Option.getOrElse(() => defaultValue),
      ),
    comboboxValueFor: (
      example: ExampleDocsArtifact,
      defaultValue: string | undefined,
    ): string | undefined =>
      pipe(
        EffectRecord.get(liveExampleComboboxValues, example.id),
        Option.getOrElse(() => defaultValue),
      ),
    comboboxValuesFor: (
      example: ExampleDocsArtifact,
      defaultValues: ReadonlyArray<string>,
    ): ReadonlyArray<string> =>
      pipe(
        EffectRecord.get(liveExampleComboboxMultipleValues, example.id),
        Option.getOrElse(() => defaultValues),
      ),
    onComboboxOpenChange: (
      example: ExampleDocsArtifact,
      change: Readonly<{ open: boolean }>,
    ): Message =>
      UpdatedLiveExampleComboboxOpen({
        exampleId: example.id,
        open: change.open,
      }),
    onComboboxInputValueChange: (
      example: ExampleDocsArtifact,
      change: Readonly<{ value: string }>,
    ): Message =>
      UpdatedLiveExampleComboboxInputValue({
        exampleId: example.id,
        value: change.value,
      }),
    onComboboxValueChange: (
      example: ExampleDocsArtifact,
      change: ComboboxValueChange,
    ): Message =>
      SelectedLiveExampleComboboxValue({
        exampleId: example.id,
        value: change.value,
        values: [...change.values],
      }),
    radioGroupValueFor: (
      example: ExampleDocsArtifact,
      defaultValue: string,
    ): string =>
      pipe(
        EffectRecord.get(liveExampleRadioGroupValues, example.id),
        Option.getOrElse(() => defaultValue),
      ),
    radioGroupIdPrefixFor: (example: ExampleDocsArtifact): string =>
      `${example.id.replaceAll(/[^a-z0-9_-]+/giu, '-')}-`,
    onRadioGroupValueChange: (
      example: ExampleDocsArtifact,
      change: Readonly<{ value: string }>,
    ): Message =>
      UpdatedLiveExampleRadioGroupValue({
        exampleId: example.id,
        value: change.value,
      }),
    checkboxCheckedStateFor: (
      example: ExampleDocsArtifact,
      controlId: string,
      defaultCheckedState: 'checked' | 'unchecked' | 'indeterminate',
    ): 'checked' | 'unchecked' | 'indeterminate' =>
      pipe(
        EffectRecord.get(
          liveExampleCheckboxCheckedStates,
          liveExampleControlStateKey(example.id, controlId),
        ),
        Option.filter(
          (
            checkedState,
          ): checkedState is 'checked' | 'unchecked' | 'indeterminate' =>
            checkedState === 'checked' ||
            checkedState === 'unchecked' ||
            checkedState === 'indeterminate',
        ),
        Option.getOrElse(() => defaultCheckedState),
      ),
    onCheckboxCheckedChange: (
      example: ExampleDocsArtifact,
      controlId: string,
      change: Readonly<{ checkedState: string }>,
    ): Message =>
      UpdatedLiveExampleCheckboxCheckedState({
        exampleId: example.id,
        controlId,
        checkedState: change.checkedState,
      }),
    switchIsCheckedFor: (
      example: ExampleDocsArtifact,
      controlId: string,
      defaultIsChecked: boolean,
    ): boolean =>
      pipe(
        EffectRecord.get(
          liveExampleSwitchCheckedValues,
          liveExampleControlStateKey(example.id, controlId),
        ),
        Option.getOrElse(() => defaultIsChecked),
      ),
    onSwitchCheckedChange: (
      example: ExampleDocsArtifact,
      controlId: string,
      change: Readonly<{ isChecked: boolean }>,
    ): Message =>
      UpdatedLiveExampleSwitchCheckedValue({
        exampleId: example.id,
        controlId,
        isChecked: change.isChecked,
      }),
    accordionValuesFor: (
      example: ExampleDocsArtifact,
      accordionId: string,
      defaultValues: ReadonlyArray<string>,
    ): ReadonlyArray<string> =>
      pipe(
        EffectRecord.get(
          liveExampleAccordionValues,
          liveExampleControlStateKey(example.id, accordionId),
        ),
        Option.getOrElse(() => defaultValues),
      ),
    onAccordionValueChange: (
      example: ExampleDocsArtifact,
      accordionId: string,
      change: Readonly<{ value: ReadonlyArray<string> }>,
    ): Message =>
      UpdatedLiveExampleAccordionValues({
        exampleId: example.id,
        accordionId,
        values: [...change.value],
      }),
    collapsibleIsOpenFor: (
      example: ExampleDocsArtifact,
      collapsibleId: string,
      defaultOpen: boolean,
    ): boolean =>
      pipe(
        EffectRecord.get(
          liveExampleCollapsibleOpenValues,
          liveExampleControlStateKey(example.id, collapsibleId),
        ),
        Option.getOrElse(() => defaultOpen),
      ),
    onCollapsibleOpenChange: (
      example: ExampleDocsArtifact,
      collapsibleId: string,
      change: Readonly<{ open: boolean }>,
    ): Message =>
      UpdatedLiveExampleCollapsibleOpen({
        exampleId: example.id,
        collapsibleId,
        open: change.open,
      }),
    tabsValueFor: (
      example: ExampleDocsArtifact,
      tabsId: string,
      defaultValue: string | undefined,
    ): string | undefined =>
      pipe(
        EffectRecord.get(
          liveExampleTabsValues,
          liveExampleControlStateKey(example.id, tabsId),
        ),
        Option.getOrElse(() => defaultValue),
      ),
    onTabsValueChange: (
      example: ExampleDocsArtifact,
      tabsId: string,
      change: Readonly<{ value: string }>,
    ): Message =>
      SelectedLiveExampleTabsValue({
        exampleId: example.id,
        tabsId,
        value: change.value,
      }),
    toggleIsPressedFor: (
      example: ExampleDocsArtifact,
      controlId: string,
      defaultIsPressed: boolean,
    ): boolean =>
      pipe(
        EffectRecord.get(
          liveExampleTogglePressedValues,
          liveExampleControlStateKey(example.id, controlId),
        ),
        Option.getOrElse(() => defaultIsPressed),
      ),
    onTogglePressedChange: (
      example: ExampleDocsArtifact,
      controlId: string,
      change: Readonly<{ isPressed: boolean }>,
    ): Message =>
      UpdatedLiveExampleTogglePressed({
        exampleId: example.id,
        controlId,
        isPressed: change.isPressed,
      }),
    toggleGroupValuesFor: (
      example: ExampleDocsArtifact,
      groupId: string,
      defaultValues: ReadonlyArray<string>,
    ): ReadonlyArray<string> =>
      pipe(
        EffectRecord.get(
          liveExampleToggleGroupValues,
          liveExampleControlStateKey(example.id, groupId),
        ),
        Option.getOrElse(() => defaultValues),
      ),
    onToggleGroupValueChange: (
      example: ExampleDocsArtifact,
      groupId: string,
      change: Readonly<{ value: ReadonlyArray<string> }>,
    ): Message =>
      UpdatedLiveExampleToggleGroupValues({
        exampleId: example.id,
        groupId,
        values: [...change.value],
      }),
    calendarSelectedDateFor: (
      example: ExampleDocsArtifact,
      defaultValue: string | undefined,
    ): string | undefined =>
      pipe(
        EffectRecord.get(liveExampleCalendarSelectedDates, example.id),
        Option.getOrElse(() => defaultValue),
      ),
    calendarVisibleMonthFor: (
      example: ExampleDocsArtifact,
      defaultValue: string,
    ): string =>
      pipe(
        EffectRecord.get(liveExampleCalendarVisibleMonths, example.id),
        Option.getOrElse(() => defaultValue),
      ),
    onCalendarSelectDate: (
      example: ExampleDocsArtifact,
      change: Readonly<{ date: string }>,
    ): Message =>
      SelectedLiveExampleCalendarDate({
        exampleId: example.id,
        date: change.date,
      }),
    onCalendarPreviousMonth: (example: ExampleDocsArtifact): Message =>
      ClickedLiveExampleCalendarPreviousMonth({
        exampleId: example.id,
      }),
    onCalendarNextMonth: (example: ExampleDocsArtifact): Message =>
      ClickedLiveExampleCalendarNextMonth({
        exampleId: example.id,
      }),
    carouselSelectedIndexFor: (
      example: ExampleDocsArtifact,
      defaultSelectedIndex: number,
    ): number =>
      pipe(
        EffectRecord.get(liveExampleCarouselSelectedIndexes, example.id),
        Option.getOrElse(() => defaultSelectedIndex),
      ),
    onCarouselMessage: (
      example: ExampleDocsArtifact,
      change: Readonly<{
        message: typeof CarouselMessage.Type
        itemCount: number
        orientation?: typeof CarouselOrientation.Type
        dir?: string
      }>,
    ): Message =>
      GotLiveExampleCarouselMessage({
        exampleId: example.id,
        message: change.message,
        itemCount: change.itemCount,
        ...(change.orientation === undefined
          ? {}
          : { orientation: change.orientation }),
        ...(change.dir === undefined ? {} : { dir: change.dir }),
      }),
    resizableStateFor: (
      example: ExampleDocsArtifact,
      groupId: string,
    ): Option.Option<ResizableState> =>
      EffectRecord.get(
        liveExampleResizableStates,
        liveExampleResizableStateKey(example.id, groupId),
      ),
    onResizableMessage: (
      example: ExampleDocsArtifact,
      change: Readonly<{
        groupId: string
        defaultState: ResizableState
        message: ResizableMessage
      }>,
    ): Message =>
      GotLiveExampleResizableMessage({
        exampleId: example.id,
        groupId: change.groupId,
        defaultState: change.defaultState,
        message: change.message,
      }),
    commandDialogIsOpenFor: (example: ExampleDocsArtifact): boolean =>
      pipe(
        EffectRecord.get(liveExampleCommandDialogOpenValues, example.id),
        Option.getOrElse(() => false),
      ),
    commandDialogIdFor: (example: ExampleDocsArtifact): string =>
      `${example.id.replaceAll(/[^a-z0-9_-]+/giu, '-')}-dialog`,
    onCommandDialogOpen: (example: ExampleDocsArtifact): Message =>
      ClickedOpenLiveExampleCommandDialog({ exampleId: example.id }),
    onCommandDialogOpenChange: (
      example: ExampleDocsArtifact,
      change: Readonly<{ open: boolean }>,
    ): Message =>
      UpdatedLiveExampleCommandDialogOpen({
        exampleId: example.id,
        isOpen: change.open,
      }),
    overlayIsOpenFor: (
      example: ExampleDocsArtifact,
      overlayId: string,
      defaultOpen: boolean,
    ): boolean =>
      pipe(
        EffectRecord.get(
          liveExampleOverlayOpenValues,
          liveExampleControlStateKey(example.id, overlayId),
        ),
        Option.getOrElse(() => defaultOpen),
      ),
    onOverlayOpenChange: (
      example: ExampleDocsArtifact,
      overlayId: string,
      change: Readonly<{ open: boolean }>,
    ): Message =>
      UpdatedLiveExampleOverlayOpen({
        exampleId: example.id,
        overlayId,
        open: change.open,
      }),
    menuIsOpenFor: (
      example: ExampleDocsArtifact,
      menuId: string,
      defaultOpen: boolean,
    ): boolean =>
      pipe(
        EffectRecord.get(
          liveExampleMenuOpenValues,
          liveExampleControlStateKey(example.id, menuId),
        ),
        Option.getOrElse(() => defaultOpen),
      ),
    menuOpenSubmenuValuesFor: (
      example: ExampleDocsArtifact,
      menuId: string,
      defaultValues: ReadonlyArray<string>,
    ): ReadonlyArray<string> =>
      pipe(
        EffectRecord.get(
          liveExampleMenuOpenSubmenuValues,
          liveExampleControlStateKey(example.id, menuId),
        ),
        Option.getOrElse(() => defaultValues),
      ),
    menuContextPointFor: (
      example: ExampleDocsArtifact,
      menuId: string,
    ): Option.Option<typeof ContextMenuPoint.Type> =>
      EffectRecord.get(
        liveExampleMenuContextPoints,
        liveExampleControlStateKey(example.id, menuId),
      ),
    menuValueFor: (
      example: ExampleDocsArtifact,
      menuId: string,
      defaultValue: string | undefined,
    ): string | undefined =>
      pipe(
        EffectRecord.get(
          liveExampleMenuValues,
          liveExampleControlStateKey(example.id, menuId),
        ),
        Option.filter(value => value !== ''),
        Option.getOrElse(() => defaultValue),
      ),
    menuCheckedStateFor: (
      example: ExampleDocsArtifact,
      menuId: string,
      itemValue: string,
      defaultChecked: boolean,
    ): boolean =>
      pipe(
        EffectRecord.get(
          liveExampleMenuCheckedValues,
          liveExampleMenuCheckedStateKey(example.id, menuId, itemValue),
        ),
        Option.getOrElse(() => defaultChecked),
      ),
    menuRadioValueFor: (
      example: ExampleDocsArtifact,
      menuId: string,
      groupValue: string,
      defaultValue: string | undefined,
    ): string | undefined =>
      pipe(
        EffectRecord.get(
          liveExampleMenuRadioValues,
          liveExampleMenuRadioStateKey(example.id, menuId, groupValue),
        ),
        Option.getOrElse(() => defaultValue),
      ),
    onMenuOpenChange: (
      example: ExampleDocsArtifact,
      menuId: string,
      change: Readonly<{
        open: boolean
        parentValue?: string | undefined
      }>,
    ): Message =>
      UpdatedLiveExampleMenuOpen({
        exampleId: example.id,
        menuId,
        open: change.open,
        ...(change.parentValue === undefined
          ? {}
          : { parentValue: change.parentValue }),
      }),
    onMenuContextPointChange: (
      example: ExampleDocsArtifact,
      menuId: string,
      point: typeof ContextMenuPoint.Type,
    ): Message =>
      UpdatedLiveExampleMenuContextPoint({
        exampleId: example.id,
        menuId,
        point,
      }),
    onMenuCheckedChange: (
      example: ExampleDocsArtifact,
      menuId: string,
      change: MenuCheckedChange,
    ): Message =>
      UpdatedLiveExampleMenuChecked({
        exampleId: example.id,
        menuId,
        itemValue: change.value,
        checked: change.checked,
      }),
    onMenuRadioValueChange: (
      example: ExampleDocsArtifact,
      menuId: string,
      change: MenuRadioValueChange,
    ): Message =>
      SelectedLiveExampleMenuRadioValue({
        exampleId: example.id,
        menuId,
        groupValue: change.groupValue,
        value: change.value,
      }),
    onMenuValueChange: (
      example: ExampleDocsArtifact,
      menuId: string,
      change: Readonly<{ value?: string | undefined }>,
    ): Message =>
      SelectedLiveExampleMenuValue({
        exampleId: example.id,
        menuId,
        ...(change.value === undefined ? {} : { value: change.value }),
      }),
    dataTableStateFor: (
      example: ExampleDocsArtifact,
      defaultState: typeof LiveExampleDataTableState.Type,
    ): typeof LiveExampleDataTableState.Type =>
      pipe(
        EffectRecord.get(liveExampleDataTableStates, example.id),
        Option.getOrElse(() => defaultState),
      ),
    onDataTableMessage: (
      example: ExampleDocsArtifact,
      message: DataTableExampleMessageType,
    ): Message =>
      GotLiveExampleDataTableMessage({
        exampleId: example.id,
        message,
      }),
    datePickerStateFor: (
      example: ExampleDocsArtifact,
      initialModel: DatePickerModelType,
    ): DatePickerModelType =>
      pipe(
        EffectRecord.get(liveExampleDatePickerStates, example.id),
        Option.getOrElse(() => initialModel),
      ),
    onDatePickerMessage: (
      example: ExampleDocsArtifact,
      message: DatePickerMessageType,
      initialModel: DatePickerModelType,
    ): Message =>
      GotLiveExampleDatePickerMessage({
        exampleId: example.id,
        message,
        initialModel,
      }),
    toastStateFor: (example: ExampleDocsArtifact): ToastPrimitive.ToastState =>
      pipe(
        EffectRecord.get(liveExampleToastStates, example.id),
        Option.getOrElse(() => initialLiveExampleToastState(example.id)),
      ),
    onToastMessage: (
      example: ExampleDocsArtifact,
      message: ToastExampleMessageType | SonnerExampleMessageType,
    ): Message =>
      GotLiveExampleToastMessage({
        exampleId: example.id,
        message,
      }),
    onBubbleMessage: (
      example: ExampleDocsArtifact,
      message: typeof BubbleExampleMessage.Type,
    ): Message =>
      GotLiveExampleBubbleMessage({
        exampleId: example.id,
        message,
      }),
    sidebarIsOpenFor: (
      example: ExampleDocsArtifact,
      defaultOpen: boolean,
    ): boolean =>
      pipe(
        EffectRecord.get(liveExampleSidebarOpenValues, example.id),
        Option.getOrElse(() => defaultOpen),
      ),
    onSidebarOpenChange: (
      example: ExampleDocsArtifact,
      change: Readonly<{ open: boolean }>,
    ): Message =>
      UpdatedLiveExampleSidebarOpen({
        exampleId: example.id,
        open: change.open,
      }),
    sidebarPanelIsOpenFor: (
      example: ExampleDocsArtifact,
      panelId: string,
      defaultOpen: boolean,
    ): boolean =>
      pipe(
        EffectRecord.get(
          liveExampleSidebarPanelOpenValues,
          liveExampleSidebarStateKey(example.id, panelId),
        ),
        Option.getOrElse(() => defaultOpen),
      ),
    onSidebarPanelOpenChange: (
      example: ExampleDocsArtifact,
      change: Readonly<{ panelId: string; open: boolean }>,
    ): Message =>
      UpdatedLiveExampleSidebarPanelOpen({
        exampleId: example.id,
        panelId: change.panelId,
        open: change.open,
      }),
    sidebarSelectedValueFor: (
      example: ExampleDocsArtifact,
      panelId: string,
      defaultValue: string,
    ): string =>
      pipe(
        EffectRecord.get(
          liveExampleSidebarSelectedValues,
          liveExampleSidebarStateKey(example.id, panelId),
        ),
        Option.getOrElse(() => defaultValue),
      ),
    onSidebarSelectedValueChange: (
      example: ExampleDocsArtifact,
      change: Readonly<{ panelId: string; value: string }>,
    ): Message =>
      SelectedLiveExampleSidebarValue({
        exampleId: example.id,
        panelId: change.panelId,
        value: change.value,
      }),
  }
  const liveExamplePreviewView = (example: ExampleDocsArtifact): Html =>
    Option.match(liveExampleViewFor(example, liveExampleContext), {
      onNone: () => h.empty,
      onSome: exampleView =>
        h.div(
          [
            h.Class('live-example-preview'),
            h.AriaLabel(`${example.title} live preview`),
          ],
          [exampleView],
        ),
    })

  return h.section([h.Id('examples'), h.Class('content-section')], [
    h.h2([], ['Examples']),
    Option.match(component.maybeDocsArtifact, {
      onNone: () => h.p([], ['Example metadata is not loaded.']),
      onSome: artifact =>
        h.div(
          [h.Class('example-list')],
          artifact.examples.map(example =>
            h.keyed('article')(
              example.id,
              [h.Id(exampleAnchorId(example)), h.Class('example-card')],
              [
                h.div([h.Class('example-card-header')], [
                  h.div([], [
                    h.h3([], [example.title]),
                    h.p([], [example.description]),
                  ]),
                  statusBadgeView(example.previewStatus),
                ]),
                liveExamplePreviewView(example),
                snippetBlockView(
                  example.snippet,
                  `Copy ${example.title} example snippet`,
                  copiedSnippets,
                ),
              ],
            ),
          ),
        ),
    }),
  ])
}

const apiSectionView = (component: PublicComponent): Html => {
  const h = html<Message>()

  return h.section([h.Id('api'), h.Class('content-section')], [
    h.h2([], ['API']),
    isDocsOnlyComponent(component)
      ? h.p([], [
          'There is no Typography component API. Parent views render semantic HTML and apply utility classes directly.',
        ])
      : h.p([], [
          'API extraction is pending. The component is currently documented through generated source paths, examples, and registry metadata.',
        ]),
  ])
}

const accessibilitySectionView = (): Html => {
  const h = html<Message>()

  return h.section([h.Id('accessibility'), h.Class('content-section')], [
    h.h2([], ['Accessibility']),
    h.p([], [
      'Use Button for actions, provide clear visible text or an accessible label for icon-only buttons, and keep navigation or side effects in Foldkit messages and commands.',
    ]),
  ])
}

const qualitySectionView = (component: PublicComponent): Html => {
  const h = html<Message>()

  return h.section([h.Id('quality'), h.Class('content-section')], [
    h.h2([], ['Quality']),
    Option.match(component.maybeDocsArtifact, {
      onNone: () =>
        h.p([], ['Quality metadata is waiting for the generated docs artifact.']),
      onSome: artifact =>
        h.div([], [
          h.dl([h.Class('meta-list wide')], [
            h.div([], [
              h.dt([], ['Availability']),
              h.dd([], [statusText(artifact.quality.availability)]),
            ]),
            h.div([], [
              h.dt([], ['Implementation']),
              h.dd([], [statusText(artifact.quality.implementationStatus)]),
            ]),
            h.div([], [
              h.dt([], ['Parity']),
              h.dd([], [statusText(artifact.quality.parityStatus)]),
            ]),
            h.div([], [
              h.dt([], ['Drift']),
              h.dd([], [statusText(artifact.quality.driftStatus)]),
            ]),
            h.div([], [
              h.dt([], ['Origin']),
              h.dd([], [
                Option.match(
                  Array.head(
                    artifact.originProvenance,
                  ),
                  {
                    onNone: () => 'local registry source',
                    onSome: origin => origin.originName,
                  },
                ),
              ]),
            ]),
          ]),
          h.h3([], ['Accepted deviations']),
          h.ul(
            [h.Class('compact-list')],
            artifact.quality.deviations.map(deviation =>
              h.li([], [
                h.strong([], [statusText(deviation.status)]),
                ` - ${deviation.summary}`,
              ]),
            ),
          ),
        ]),
    }),
  ])
}

const sourceSectionView = (component: PublicComponent): Html => {
  const h = html<Message>()

  return h.section([h.Id('source'), h.Class('content-section')], [
    h.h2([], ['Source']),
    Option.match(component.maybeDocsArtifact, {
      onNone: () =>
        h.p([], [`Generated artifact: ${component.docsRoute.docsArtifactPath}`]),
      onSome: artifact =>
        h.div([], [
          h.dl([h.Class('meta-list wide')], [
            h.div([], [
              h.dt([], ['Docs artifact']),
              h.dd([], [component.docsRoute.docsArtifactPath]),
            ]),
            h.div([], [
              h.dt([], ['Sidecar']),
              h.dd(
                [],
                [
                  Option.match(artifact.markdownPath, {
                    onNone: () => 'missing',
                    onSome: path => path,
                  }),
                ],
              ),
            ]),
            h.div([], [
              h.dt([], ['Source root']),
              h.dd([], [artifact.sourceRoot]),
            ]),
          ]),
          Array.isReadonlyArrayEmpty(artifact.installableSourcePaths)
            ? h.p([], [
                'This docs-only row has no installable source files. Its local source is sidecar documentation plus deterministic examples.',
              ])
            : h.ul(
                [h.Class('compact-list')],
                artifact.installableSourcePaths.map(sourcePath =>
                  h.li([], [h.code([], [sourcePath])]),
                ),
              ),
        ]),
    }),
  ])
}

const foldkitDifferencesSectionView = (component: PublicComponent): Html => {
  const h = html<Message>()

  return h.section(
    [h.Id('foldkit-differences'), h.Class('content-section')],
    [
      h.h2([], ['Foldkit Differences']),
      isDocsOnlyComponent(component)
        ? h.p([], [
            'Typography mirrors the origin docs-only stance: Foldkit CN does not ship default prose styles, React is fixture evidence only, and the RTL example uses deterministic local text instead of the origin language selector.',
          ])
        : h.p([], [
            'This item replaces the origin React, CVA, and icon-package assumptions with Foldkit Html, local Base UI behavior, Effect Schema literals, and local inline SVG examples.',
          ]),
      Option.match(component.maybeDocsArtifact, {
        onNone: () => h.empty,
        onSome: artifact => {
          const developmentDependencies =
            artifact.dependencies.development

          return h.ul(
            [h.Class('compact-list')],
            developmentDependencies.map(dependency =>
              h.li([], [
                h.code([], [dependency.specifier]),
                `: ${dependency.reason}`,
              ]),
            ),
          )
        },
      }),
    ],
  )
}

const componentDetailPageView = (
  model: Model,
  namespace: string,
  slug: string,
): Html => {
  const h = html<Message>()
  const maybeComponent = findRoutedComponent(model.data, namespace, slug)

  return Option.match(maybeComponent, {
    onNone: () =>
      notFoundPageView(
        NotFoundRoute({ path: componentDetailRouter({ namespace, slug }) }),
      ),
    onSome: component =>
      h.article([], [
        pageHeaderView(
          component.entry.item.namespace,
          component.entry.item.name,
          component.entry.item.description,
        ),
        h.section([h.Id('overview'), h.Class('content-section')], [
          // h.h2([], ['Overview']),
          // h.p([], [component.entry.item.description]),
          dependenciesPanelView(component),
        ]),
        installationSectionView(component, model.copiedSnippets),
        usageSectionView(component, model.copiedSnippets),
        examplesSectionView(
          component,
          model.copiedSnippets,
          model.liveExampleInputValues,
          model.liveExampleOtpValues,
          model.liveExampleSliderValues,
          model.liveExampleSelectOpenValues,
          model.liveExampleSelectValues,
          model.liveExampleComboboxOpenValues,
          model.liveExampleComboboxInputValues,
          model.liveExampleComboboxValues,
          model.liveExampleComboboxMultipleValues,
          model.liveExampleRadioGroupValues,
          model.liveExampleCheckboxCheckedStates,
          model.liveExampleSwitchCheckedValues,
          model.liveExampleAccordionValues,
          model.liveExampleCollapsibleOpenValues,
          model.liveExampleTabsValues,
          model.liveExampleTogglePressedValues,
          model.liveExampleToggleGroupValues,
          model.liveExampleCalendarSelectedDates,
          model.liveExampleCalendarVisibleMonths,
          model.liveExampleCarouselSelectedIndexes,
          model.liveExampleResizableStates,
          model.liveExampleCommandDialogOpenValues,
          model.liveExampleOverlayOpenValues,
          model.liveExampleMenuOpenValues,
          model.liveExampleMenuOpenSubmenuValues,
          model.liveExampleMenuContextPoints,
          model.liveExampleMenuValues,
          model.liveExampleMenuCheckedValues,
          model.liveExampleMenuRadioValues,
          model.liveExampleDataTableStates ?? {},
          model.liveExampleDatePickerStates,
          model.liveExampleToastStates,
          model.liveExampleSidebarOpenValues,
          model.liveExampleSidebarPanelOpenValues,
          model.liveExampleSidebarSelectedValues,
        ),
        apiSectionView(component),
        accessibilitySectionView(),
        qualitySectionView(component),
        sourceSectionView(component),
        foldkitDifferencesSectionView(component),
      ]),
  })
}

const registryPageView = (): Html => {
  const h = html<Message>()

  return h.article([], [
    pageHeaderView(
      'Registry',
      'Registry',
      'Generated registry files are the website boundary; registry source stays behind the build step.',
    ),
    h.section([h.Id('status'), h.Class('content-section')], [
      h.h2([], ['Artifacts']),
      h.p([], [
        'The catalog comes from registry/index.json. Component route metadata comes from registry/docs/index.json. The runtime shell does not read registry-src.',
      ]),
      h.ul([h.Class('link-list')], [
        h.li([], [h.a([h.Href(registrySchemaRouter({}))], ['Schema'])]),
        h.li([], [
          h.a([h.Href(registryLifecycleRouter({}))], ['Lifecycle']),
        ]),
      ]),
    ]),
  ])
}

const registrySchemaPageView = (): Html => {
  const h = html<Message>()

  return h.article([], [
    pageHeaderView(
      'Registry',
      'Registry Schema',
      'Schema-backed registry artifacts define what the docs shell can trust.',
    ),
    h.section([h.Id('status'), h.Class('content-section')], [
      h.h2([], ['Current boundary']),
      h.p([], [
        'This page will summarize the RegistryIndex and ComponentDocsIndex contracts. For now it anchors the generated artifact split used by the shell.',
      ]),
    ]),
  ])
}

const registryLifecyclePageView = (): Html => {
  const h = html<Message>()

  return h.article([], [
    pageHeaderView(
      'Registry',
      'Registry Lifecycle',
      'Lifecycle data explains what can be installed, previewed, documented, or deferred.',
    ),
    h.section([h.Id('status'), h.Class('content-section')], [
      h.h2([], ['Axes']),
      h.ul([h.Class('link-list')], [
        h.li([], ['availability: private, preview, installable']),
        h.li([], ['implementationStatus: planned, dossier-ready, implemented']),
        h.li([], ['parityStatus and driftStatus: origin confidence signals']),
        h.li([], ['docsStatus: missing, stub, complete']),
      ]),
    ]),
  ])
}

const roadmapStatView = (
  label: string,
  value: string,
  detail: string,
): Html => {
  const h = html<Message>()

  return h.div([h.Class('roadmap-stat')], [
    h.dt([], [label]),
    h.dd([], [value]),
    h.p([], [detail]),
  ])
}

const roadmapRowView = (row: OriginComponentProgressRow): Html => {
  const h = html<Message>()

  return h.li([h.Class('roadmap-row')], [
    h.div([h.Class('roadmap-row-header')], [
      h.strong([], [row.itemId]),
      statusBadgeView(row.readiness),
    ]),
    h.p([], [
      row.readiness === 'blocked'
        ? `${row.blockers.length} roadmap blocker${row.blockers.length === 1 ? '' : 's'
        } tracked in the progress report.`
        : 'Origin evidence is available; the next step is a focused dossier.',
    ]),
    h.a([h.Class('source-link'), h.Href(row.docsUrl)], ['Origin docs']),
  ])
}

const roadmapBlockedGroupView = (group: RoadmapBlockedGroup): Html => {
  const h = html<Message>()

  return h.article([h.Class('roadmap-group')], [
    h.h3([], [group.label]),
    h.p([], [group.summary]),
    h.ul([h.Class('roadmap-list')], group.rows.map(roadmapRowView)),
  ])
}

const roadmapLoadedPageView = (
  progressReport: OriginComponentProgressReport,
): Html => {
  const h = html<Message>()
  const snapshot = roadmapSnapshot(progressReport)

  return h.article([], [
    pageHeaderView(
      'Roadmap',
      'Roadmap',
      'A product view of component availability, next candidates, and blocked work from the structured progress report.',
    ),
    h.section([h.Id('status'), h.Class('content-section')], [
      h.h2([], ['Available now']),
      h.dl([h.Class('roadmap-stats')], [
        roadmapStatView(
          'Base UI',
          `${snapshot.report.summary.baseUi.imported} of ${snapshot.report.summary.baseUi.total}`,
          `${snapshot.report.summary.baseUi.remaining} remaining origin rows`,
        ),
        roadmapStatView(
          'shadcn',
          `${snapshot.report.summary.shadcn.imported} of ${snapshot.report.summary.shadcn.total}`,
          `${snapshot.report.summary.shadcn.remaining} remaining origin rows`,
        ),
        roadmapStatView(
          'Blocked',
          String(snapshot.report.summary.blockedCount),
          'Rows waiting on product or foundation decisions',
        ),
        roadmapStatView(
          'Ready for dossier',
          String(snapshot.report.summary.readyForDossierCount),
          'Rows with enough source evidence for the next planning pass',
        ),
      ]),
    ]),
    h.section([h.Id('next-candidates'), h.Class('content-section')], [
      h.h2([], ['Next candidates']),
      h.p([], [
        'These rows have enough public source evidence to start the next focused dossier without broad registry rewrites.',
      ]),
      h.ul([h.Class('roadmap-list')], snapshot.nextCandidates.map(roadmapRowView)),
    ]),
    h.section([h.Id('blocked'), h.Class('content-section')], [
      h.h2([], ['Blocked categories']),
      ...snapshot.blockedGroups.map(roadmapBlockedGroupView),
    ]),
    h.section([h.Id('next'), h.Class('content-section')], [
      h.h2([], ['What is next']),
      h.ul(
        [h.Class('link-list')],
        snapshot.nextSteps.map(step => h.li([], [step])),
      ),
    ]),
  ])
}

const roadmapPageView = (model: Model): Html => {
  const h = html<Message>()

  return M.value(model.data).pipe(
    M.withReturnType<Html>(),
    M.tagsExhaustive({
      LoadedDocsData: ({ progressReport }) =>
        roadmapLoadedPageView(progressReport),
      FailedDocsData: ({ message }) =>
        h.article([], [
          pageHeaderView(
            'Roadmap',
            'Roadmap',
            'Progress data could not be loaded from the generated artifacts.',
          ),
          h.p([h.Class('data-error'), h.Role('status')], [message]),
        ]),
    }),
  )
}

const notFoundPageView = (route: typeof NotFoundRoute.Type): Html => {
  const h = html<Message>()

  return h.article([], [
    pageHeaderView(
      'Not Found',
      'Page Not Found',
      `The path "${route.path}" was not found in the Foldkit CN docs shell.`,
    ),
    h.section([h.Id('status'), h.Class('content-section')], [
      h.a([h.Class('action-link'), h.Href(homeRouter({}))], [
        'Back to Foldkit CN',
      ]),
    ]),
  ])
}

const routeContentView = (model: Model): Html =>
  M.value(model.route).pipe(
    M.withReturnType<Html>(),
    M.tagsExhaustive({
      Home: () => homePageView(model),
      Docs: () => docsPageView(),
      ComponentsIndex: () => componentsIndexPageView(model),
      ComponentsNamespace: ({ namespace }) =>
        componentsNamespacePageView(model, namespace),
      ComponentDetail: ({ namespace, slug }) =>
        componentDetailPageView(model, namespace, slug),
      Registry: () => registryPageView(),
      RegistrySchema: () => registrySchemaPageView(),
      RegistryLifecycle: () => registryLifecyclePageView(),
      Roadmap: () => roadmapPageView(model),
      NotFound: route => notFoundPageView(route),
    }),
  )

const routeMetadata = (data: DocsData, route: AppRoute) =>
  pipe(
    routeMetadataForRoute(data, route),
    Option.getOrElse(() => fallbackRouteMetadata(route)),
  )

const routeTitle = (data: DocsData, route: AppRoute): string =>
  routeMetadata(data, route).title

export const view = (model: Model): Document => ({
  title: routeTitle(model.data, model.route),
  body: shellView(model, routeContentView(model)),
})
