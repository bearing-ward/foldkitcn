import { Option, pipe } from 'effect'
import type { Html } from 'foldkit/html'

import {
  ButtonDemo as BaseButtonDemo,
  ButtonDisabled as BaseButtonDisabled,
  ButtonLoading as BaseButtonLoading,
  ButtonNonNative as BaseButtonNonNative,
  ButtonTypes as BaseButtonTypes,
} from './registry/base-ui/button/examples'
import type { InputValueChange } from './registry/base-ui/input'
import {
  InputDemo as BaseInputDemo,
  InputDisabled as BaseInputDisabled,
} from './registry/base-ui/input/examples'
import type { InputExampleController } from './registry/base-ui/input/examples'
import type { ToastState } from './registry/base-ui/toast'
import {
  ToastAnchored as BaseToastAnchored,
  ToastCustom as BaseToastCustom,
  ToastCustomPosition as BaseToastCustomPosition,
  ToastDeduplicated as BaseToastDeduplicated,
  ToastPromise as BaseToastPromise,
  ToastUndoAction as BaseToastUndoAction,
  ToastVaryingHeights as BaseToastVaryingHeights,
} from './registry/base-ui/toast/examples'
import type {
  ToastExampleController,
  ToastExampleMessage,
} from './registry/base-ui/toast/examples'
import type { ExampleDocsArtifact } from './registry/schema'
import {
  AttachmentDemo,
  AttachmentGroupDemo,
  AttachmentImage,
  AttachmentSizes,
  AttachmentStates,
  AttachmentTriggerDemo,
} from './registry/shadcn/attachment/examples'
import { AttachmentWorkflowDemo } from './registry/shadcn/attachment/workflow'
import {
  BubbleAlignmentDemo,
  BubbleCollapsibleDemo,
  BubbleDemo,
  BubbleGroupDemo,
  BubbleLinkButtonDemo,
  BubbleMarkdownDemo,
  BubblePopoverDemo,
  BubbleReactionsDemo,
  BubbleTooltipDemo,
  BubbleVariantsDemo,
} from './registry/shadcn/bubble/examples'
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
} from './registry/shadcn/button-group/examples'
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
} from './registry/shadcn/button/examples'
import {
  CalendarBasic,
  CalendarBookedDates,
  CalendarDemo,
  CalendarRtl,
} from './registry/shadcn/calendar/examples'
import type { CalendarExampleController } from './registry/shadcn/calendar/examples'
import type { CalendarSelectChange } from './registry/shadcn/calendar/index'
import {
  CarouselApi,
  CarouselDemo,
  CarouselMultiple,
  CarouselOrientation,
  CarouselRtl,
  CarouselSize,
  CarouselSpacing,
} from './registry/shadcn/carousel/examples'
import type {
  CarouselExampleController,
  CarouselExampleMessageChange,
} from './registry/shadcn/carousel/examples'
import {
  CommandBasic,
  CommandDemo,
  CommandDialogDemo,
  CommandManyItems,
  CommandRtl,
  CommandWithGroups,
  CommandWithShortcuts,
} from './registry/shadcn/command/examples'
import type { CommandDialogExampleController } from './registry/shadcn/command/examples'
import {
  EmptyAvatar,
  EmptyAvatarGroup,
  EmptyDemo,
  EmptyInCard,
  EmptyInputGroup,
  EmptyMuted,
  EmptyOutline,
  EmptyRtl,
} from './registry/shadcn/empty/examples'
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
} from './registry/shadcn/input-group/examples'
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
} from './registry/shadcn/item/examples'
import {
  MarkerBorder,
  MarkerDemo,
  MarkerIconDemo,
  MarkerLinkButton,
  MarkerSeparator,
  MarkerShimmer,
  MarkerStatus,
  MarkerVariants,
} from './registry/shadcn/marker/examples'
import {
  MessageScrollerDemo,
  MessageScrollerEmpty,
  MessageScrollerLoadHistory,
  MessageScrollerOpeningPosition,
  MessageScrollerScrollable,
} from './registry/shadcn/message-scroller/examples'
import {
  MessageActionsDemo,
  MessageAttachmentDemo,
  MessageAvatarDemo,
  MessageDemo,
  MessageGroupDemo,
  MessageHeaderFooterDemo,
  MessageMarkdownDemo,
} from './registry/shadcn/message/examples'
import {
  PaginationDemo,
  PaginationIconsOnly,
  PaginationRtl,
  PaginationSimple,
} from './registry/shadcn/pagination/examples'
import type { RadioGroupValueChange } from './registry/shadcn/radio-group'
import {
  RadioGroupChoiceCard,
  RadioGroupDemo,
  RadioGroupDescription,
  RadioGroupDisabled,
  RadioGroupFieldset,
  RadioGroupInvalid,
  RadioGroupRtl,
} from './registry/shadcn/radio-group/examples'
import type { RadioGroupExampleController } from './registry/shadcn/radio-group/examples'
import {
  ResizableDemo,
  ResizableHandleDemo,
  ResizableRtl,
  ResizableVertical,
} from './registry/shadcn/resizable/examples'
import type {
  ResizableExampleController,
  ResizableExampleMessageChange,
} from './registry/shadcn/resizable/examples'
import type { ResizableState } from './registry/shadcn/resizable/index'
import {
  SidebarControlled,
  SidebarDemo,
  SidebarFooter,
  SidebarGroupAction,
  SidebarGroupCollapsible,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuCollapsible,
  SidebarMenuSub,
  SidebarRsc,
  SidebarRtl,
} from './registry/shadcn/sidebar/examples'
import type {
  SidebarController,
  SidebarOpenChange,
  SidebarPanelOpenChange,
  SidebarSelectedValueChange,
} from './registry/shadcn/sidebar/examples'
import {
  SonnerDemo as ShadcnSonnerDemo,
  SonnerDescription as ShadcnSonnerDescription,
  SonnerPosition as ShadcnSonnerPosition,
  SonnerTypes as ShadcnSonnerTypes,
} from './registry/shadcn/sonner/examples'
import {
  SpinnerBadge,
  SpinnerButton,
  SpinnerCustom,
  SpinnerDemo,
  SpinnerEmpty,
  SpinnerInputGroup,
  SpinnerRtl,
  SpinnerSize,
} from './registry/shadcn/spinner/examples'
import {
  TableActions,
  TableDemo,
  TableFooterExample,
  TableRtl,
} from './registry/shadcn/table/examples'

export type LiveExampleContext<Message> = Readonly<{
  inputValueFor: (example: ExampleDocsArtifact, defaultValue: string) => string
  inputIdPrefixFor: (example: ExampleDocsArtifact) => string
  onInputValueChange: (
    example: ExampleDocsArtifact,
    change: InputValueChange,
  ) => Message
  radioGroupValueFor: (
    example: ExampleDocsArtifact,
    defaultValue: string,
  ) => string
  radioGroupIdPrefixFor: (example: ExampleDocsArtifact) => string
  onRadioGroupValueChange: (
    example: ExampleDocsArtifact,
    change: RadioGroupValueChange,
  ) => Message
  calendarSelectedDateFor: (
    example: ExampleDocsArtifact,
    defaultValue: string | undefined,
  ) => string | undefined
  onCalendarSelectDate: (
    example: ExampleDocsArtifact,
    change: CalendarSelectChange,
  ) => Message
  carouselSelectedIndexFor: (
    example: ExampleDocsArtifact,
    defaultSelectedIndex: number,
  ) => number
  onCarouselMessage: (
    example: ExampleDocsArtifact,
    change: CarouselExampleMessageChange,
  ) => Message
  resizableStateFor: (
    example: ExampleDocsArtifact,
    groupId: string,
  ) => Option.Option<ResizableState>
  onResizableMessage: (
    example: ExampleDocsArtifact,
    change: ResizableExampleMessageChange,
  ) => Message
  commandDialogIsOpenFor: (example: ExampleDocsArtifact) => boolean
  commandDialogIdFor: (example: ExampleDocsArtifact) => string
  onCommandDialogOpen: (example: ExampleDocsArtifact) => Message
  onCommandDialogOpenChange: (
    example: ExampleDocsArtifact,
    change: Readonly<{ open: boolean }>,
  ) => Message
  toastStateFor: (example: ExampleDocsArtifact) => ToastState
  onToastMessage: (
    example: ExampleDocsArtifact,
    message: ToastExampleMessage,
  ) => Message
  sidebarIsOpenFor: (
    example: ExampleDocsArtifact,
    defaultOpen: boolean,
  ) => boolean
  onSidebarOpenChange: (
    example: ExampleDocsArtifact,
    change: SidebarOpenChange,
  ) => Message
  sidebarPanelIsOpenFor: (
    example: ExampleDocsArtifact,
    panelId: string,
    defaultOpen: boolean,
  ) => boolean
  onSidebarPanelOpenChange: (
    example: ExampleDocsArtifact,
    change: SidebarPanelOpenChange,
  ) => Message
  sidebarSelectedValueFor: (
    example: ExampleDocsArtifact,
    panelId: string,
    defaultValue: string,
  ) => string
  onSidebarSelectedValueChange: (
    example: ExampleDocsArtifact,
    change: SidebarSelectedValueChange,
  ) => Message
}>

type RadioGroupExampleView = <Message = never>(
  controller?: RadioGroupExampleController<Message>,
) => Html

type InputExampleView = <Message = never>(
  controller?: InputExampleController<Message>,
) => Html

type CommandDialogExampleView = <Message = never>(
  controller?: CommandDialogExampleController<Message>,
) => Html

type CalendarExampleView = <Message = never>(
  controller?: CalendarExampleController<Message>,
) => Html

type CarouselExampleView = <Message = never>(
  controller?: CarouselExampleController<Message>,
) => Html

type ResizableExampleView = <Message = never>(
  controller?: ResizableExampleController<Message>,
) => Html

type ToastExampleView = <Message = never>(
  controller?: ToastExampleController<Message>,
) => Html

type SidebarExampleView = <Message = never>(
  controller?: SidebarController<Message>,
) => Html

type LiveExampleDefinition = Readonly<{
  render: <Message>(
    example: ExampleDocsArtifact,
    context: LiveExampleContext<Message>,
  ) => Html
}>

const liveExampleKey = (
  componentItemId: string,
  previewExportName: string,
): string => `${componentItemId}#${previewExportName}`

const staticExample = (view: () => Html): LiveExampleDefinition => ({
  render: () => view(),
})

const inputExample = (
  view: InputExampleView,
  defaultValue: string,
): LiveExampleDefinition => ({
  render: (example, context) =>
    view({
      value: context.inputValueFor(example, defaultValue),
      idPrefix: context.inputIdPrefixFor(example),
      onValueChange: change => context.onInputValueChange(example, change),
    }),
})

const radioGroupExample = (
  view: RadioGroupExampleView,
  defaultValue: string,
): LiveExampleDefinition => ({
  render: (example, context) =>
    view({
      value: context.radioGroupValueFor(example, defaultValue),
      idPrefix: context.radioGroupIdPrefixFor(example),
      onValueChange: change => context.onRadioGroupValueChange(example, change),
    }),
})

const commandDialogExample = (
  view: CommandDialogExampleView,
): LiveExampleDefinition => ({
  render: (example, context) =>
    view({
      id: context.commandDialogIdFor(example),
      isOpen: context.commandDialogIsOpenFor(example),
      onOpen: context.onCommandDialogOpen(example),
      onOpenChange: change =>
        context.onCommandDialogOpenChange(example, change),
    }),
})

const calendarExample = (
  view: CalendarExampleView,
  defaultSelectedDate?: string,
): LiveExampleDefinition => ({
  render: (example, context) => {
    const selectedDate = context.calendarSelectedDateFor(
      example,
      defaultSelectedDate,
    )

    return view({
      ...(selectedDate === undefined ? {} : { selectedDate }),
      onSelectDate: change => context.onCalendarSelectDate(example, change),
    })
  },
})

const carouselExample = (
  view: CarouselExampleView,
  defaultSelectedIndex = 0,
): LiveExampleDefinition => ({
  render: (example, context) =>
    view({
      selectedIndex: context.carouselSelectedIndexFor(
        example,
        defaultSelectedIndex,
      ),
      onCarouselMessage: change => context.onCarouselMessage(example, change),
    }),
})

const resizableExample = (
  view: ResizableExampleView,
): LiveExampleDefinition => ({
  render: <Message>(
    example: ExampleDocsArtifact,
    context: LiveExampleContext<Message>,
  ) => {
    const onResizableMessage = (change: ResizableExampleMessageChange) =>
      context.onResizableMessage(example, change)

    return view<Message>({
      exampleId: example.id,
      stateFor: groupId => context.resizableStateFor(example, groupId),
      onResizableMessage,
      externalPointerTracking: true,
    })
  },
})

const toastExample = (view: ToastExampleView): LiveExampleDefinition => ({
  render: (example, context) =>
    view({
      state: context.toastStateFor(example),
      onToastMessage: message => context.onToastMessage(example, message),
    }),
})

const sidebarExample = (
  view: SidebarExampleView,
  defaultOpen = true,
): LiveExampleDefinition => ({
  render: (example, context) =>
    view({
      open: context.sidebarIsOpenFor(example, defaultOpen),
      onOpenChange: change => context.onSidebarOpenChange(example, change),
      panelIsOpen: (panelId, panelDefaultOpen) =>
        context.sidebarPanelIsOpenFor(example, panelId, panelDefaultOpen),
      onPanelOpenChange: change =>
        context.onSidebarPanelOpenChange(example, change),
      selectedValueFor: (panelId, defaultValue) =>
        context.sidebarSelectedValueFor(example, panelId, defaultValue),
      onSelectedValueChange: change =>
        context.onSidebarSelectedValueChange(example, change),
    }),
})

const liveExampleViews: Readonly<Record<string, LiveExampleDefinition>> = {
  [liveExampleKey('base-ui/button', 'ButtonDemo')]:
    staticExample(BaseButtonDemo),
  [liveExampleKey('base-ui/button', 'ButtonDisabled')]:
    staticExample(BaseButtonDisabled),
  [liveExampleKey('base-ui/button', 'ButtonNonNative')]:
    staticExample(BaseButtonNonNative),
  [liveExampleKey('base-ui/button', 'ButtonTypes')]:
    staticExample(BaseButtonTypes),
  [liveExampleKey('base-ui/button', 'ButtonLoading')]:
    staticExample(BaseButtonLoading),
  [liveExampleKey('base-ui/input', 'InputDemo')]: inputExample(
    BaseInputDemo,
    '',
  ),
  [liveExampleKey('base-ui/input', 'InputDisabled')]: inputExample(
    BaseInputDisabled,
    'Colm Tuite',
  ),
  [liveExampleKey('base-ui/toast', 'ToastAnchored')]:
    toastExample(BaseToastAnchored),
  [liveExampleKey('base-ui/toast', 'ToastCustomPosition')]: toastExample(
    BaseToastCustomPosition,
  ),
  [liveExampleKey('base-ui/toast', 'ToastUndoAction')]:
    toastExample(BaseToastUndoAction),
  [liveExampleKey('base-ui/toast', 'ToastPromise')]:
    toastExample(BaseToastPromise),
  [liveExampleKey('base-ui/toast', 'ToastCustom')]:
    toastExample(BaseToastCustom),
  [liveExampleKey('base-ui/toast', 'ToastDeduplicated')]: toastExample(
    BaseToastDeduplicated,
  ),
  [liveExampleKey('base-ui/toast', 'ToastVaryingHeights')]: toastExample(
    BaseToastVaryingHeights,
  ),
  [liveExampleKey('shadcn/button', 'ButtonDefault')]:
    staticExample(ButtonDefault),
  [liveExampleKey('shadcn/button', 'ButtonDemo')]: staticExample(ButtonDemo),
  [liveExampleKey('shadcn/button', 'ButtonOutline')]:
    staticExample(ButtonOutline),
  [liveExampleKey('shadcn/button', 'ButtonSecondary')]:
    staticExample(ButtonSecondary),
  [liveExampleKey('shadcn/button', 'ButtonGhost')]: staticExample(ButtonGhost),
  [liveExampleKey('shadcn/button', 'ButtonDestructive')]:
    staticExample(ButtonDestructive),
  [liveExampleKey('shadcn/button', 'ButtonLink')]: staticExample(ButtonLink),
  [liveExampleKey('shadcn/button', 'ButtonIcon')]: staticExample(ButtonIcon),
  [liveExampleKey('shadcn/button', 'ButtonWithIcon')]:
    staticExample(ButtonWithIcon),
  [liveExampleKey('shadcn/button', 'ButtonSize')]: staticExample(ButtonSize),
  [liveExampleKey('shadcn/button', 'ButtonRounded')]:
    staticExample(ButtonRounded),
  [liveExampleKey('shadcn/button', 'ButtonSpinner')]:
    staticExample(ButtonSpinner),
  [liveExampleKey('shadcn/button', 'ButtonRender')]:
    staticExample(ButtonRender),
  [liveExampleKey('shadcn/button', 'ButtonRtl')]: staticExample(ButtonRtl),
  [liveExampleKey('shadcn/attachment', 'AttachmentDemo')]:
    staticExample(AttachmentDemo),
  [liveExampleKey('shadcn/attachment', 'AttachmentGroupDemo')]:
    staticExample(AttachmentGroupDemo),
  [liveExampleKey('shadcn/attachment', 'AttachmentImage')]:
    staticExample(AttachmentImage),
  [liveExampleKey('shadcn/attachment', 'AttachmentSizes')]:
    staticExample(AttachmentSizes),
  [liveExampleKey('shadcn/attachment', 'AttachmentStates')]:
    staticExample(AttachmentStates),
  [liveExampleKey('shadcn/attachment', 'AttachmentWorkflowDemo')]:
    staticExample(AttachmentWorkflowDemo),
  [liveExampleKey('shadcn/attachment', 'AttachmentTriggerDemo')]: staticExample(
    AttachmentTriggerDemo,
  ),
  [liveExampleKey('shadcn/bubble', 'BubbleDemo')]: staticExample(BubbleDemo),
  [liveExampleKey('shadcn/bubble', 'BubbleGroupDemo')]:
    staticExample(BubbleGroupDemo),
  [liveExampleKey('shadcn/bubble', 'BubbleVariantsDemo')]:
    staticExample(BubbleVariantsDemo),
  [liveExampleKey('shadcn/bubble', 'BubbleAlignmentDemo')]:
    staticExample(BubbleAlignmentDemo),
  [liveExampleKey('shadcn/bubble', 'BubbleLinkButtonDemo')]:
    staticExample(BubbleLinkButtonDemo),
  [liveExampleKey('shadcn/bubble', 'BubbleReactionsDemo')]:
    staticExample(BubbleReactionsDemo),
  [liveExampleKey('shadcn/bubble', 'BubbleCollapsibleDemo')]: staticExample(
    BubbleCollapsibleDemo,
  ),
  [liveExampleKey('shadcn/bubble', 'BubbleTooltipDemo')]:
    staticExample(BubbleTooltipDemo),
  [liveExampleKey('shadcn/bubble', 'BubblePopoverDemo')]:
    staticExample(BubblePopoverDemo),
  [liveExampleKey('shadcn/bubble', 'BubbleMarkdownDemo')]:
    staticExample(BubbleMarkdownDemo),
  [liveExampleKey('shadcn/message', 'MessageDemo')]: staticExample(MessageDemo),
  [liveExampleKey('shadcn/message', 'MessageGroupDemo')]:
    staticExample(MessageGroupDemo),
  [liveExampleKey('shadcn/message', 'MessageAvatarDemo')]:
    staticExample(MessageAvatarDemo),
  [liveExampleKey('shadcn/message', 'MessageHeaderFooterDemo')]: staticExample(
    MessageHeaderFooterDemo,
  ),
  [liveExampleKey('shadcn/message', 'MessageActionsDemo')]:
    staticExample(MessageActionsDemo),
  [liveExampleKey('shadcn/message', 'MessageAttachmentDemo')]: staticExample(
    MessageAttachmentDemo,
  ),
  [liveExampleKey('shadcn/message', 'MessageMarkdownDemo')]:
    staticExample(MessageMarkdownDemo),
  [liveExampleKey('shadcn/message-scroller', 'MessageScrollerDemo')]:
    staticExample(MessageScrollerDemo),
  [liveExampleKey('shadcn/message-scroller', 'MessageScrollerScrollable')]:
    staticExample(MessageScrollerScrollable),
  [liveExampleKey('shadcn/message-scroller', 'MessageScrollerLoadHistory')]:
    staticExample(MessageScrollerLoadHistory),
  [liveExampleKey('shadcn/message-scroller', 'MessageScrollerOpeningPosition')]:
    staticExample(MessageScrollerOpeningPosition),
  [liveExampleKey('shadcn/message-scroller', 'MessageScrollerEmpty')]:
    staticExample(MessageScrollerEmpty),
  [liveExampleKey('shadcn/sonner', 'SonnerDemo')]:
    staticExample(ShadcnSonnerDemo),
  [liveExampleKey('shadcn/sonner', 'SonnerDescription')]: staticExample(
    ShadcnSonnerDescription,
  ),
  [liveExampleKey('shadcn/sonner', 'SonnerPosition')]:
    staticExample(ShadcnSonnerPosition),
  [liveExampleKey('shadcn/sonner', 'SonnerTypes')]:
    staticExample(ShadcnSonnerTypes),
  [liveExampleKey('shadcn/button-group', 'ButtonGroupDemo')]:
    staticExample(ButtonGroupDemo),
  [liveExampleKey('shadcn/button-group', 'ButtonGroupDropdown')]:
    staticExample(ButtonGroupDropdown),
  [liveExampleKey('shadcn/button-group', 'ButtonGroupInput')]:
    staticExample(ButtonGroupInput),
  [liveExampleKey('shadcn/button-group', 'ButtonGroupOrientation')]:
    staticExample(ButtonGroupOrientation),
  [liveExampleKey('shadcn/button-group', 'ButtonGroupPopover')]:
    staticExample(ButtonGroupPopover),
  [liveExampleKey('shadcn/button-group', 'ButtonGroupRtl')]:
    staticExample(ButtonGroupRtl),
  [liveExampleKey('shadcn/button-group', 'ButtonGroupSelect')]:
    staticExample(ButtonGroupSelect),
  [liveExampleKey('shadcn/button-group', 'ButtonGroupSeparatorDemo')]:
    staticExample(ButtonGroupSeparatorDemo),
  [liveExampleKey('shadcn/button-group', 'ButtonGroupSize')]:
    staticExample(ButtonGroupSize),
  [liveExampleKey('shadcn/button-group', 'ButtonGroupSplit')]:
    staticExample(ButtonGroupSplit),
  [liveExampleKey('shadcn/calendar', 'CalendarDemo')]: calendarExample(
    CalendarDemo,
    '2025-01-06',
  ),
  [liveExampleKey('shadcn/calendar', 'CalendarBasic')]:
    calendarExample(CalendarBasic),
  [liveExampleKey('shadcn/calendar', 'CalendarBookedDates')]: calendarExample(
    CalendarBookedDates,
    '2025-01-06',
  ),
  [liveExampleKey('shadcn/calendar', 'CalendarRtl')]: calendarExample(
    CalendarRtl,
    '2025-01-06',
  ),
  [liveExampleKey('shadcn/carousel', 'CarouselDemo')]:
    carouselExample(CarouselDemo),
  [liveExampleKey('shadcn/carousel', 'CarouselSize')]:
    carouselExample(CarouselSize),
  [liveExampleKey('shadcn/carousel', 'CarouselMultiple')]:
    carouselExample(CarouselMultiple),
  [liveExampleKey('shadcn/carousel', 'CarouselSpacing')]:
    carouselExample(CarouselSpacing),
  [liveExampleKey('shadcn/carousel', 'CarouselOrientation')]:
    carouselExample(CarouselOrientation),
  [liveExampleKey('shadcn/carousel', 'CarouselApi')]:
    carouselExample(CarouselApi),
  [liveExampleKey('shadcn/carousel', 'CarouselRtl')]:
    carouselExample(CarouselRtl),
  [liveExampleKey('shadcn/command', 'CommandDemo')]: staticExample(CommandDemo),
  [liveExampleKey('shadcn/command', 'CommandBasic')]:
    commandDialogExample(CommandBasic),
  [liveExampleKey('shadcn/command', 'CommandDialogDemo')]:
    commandDialogExample(CommandDialogDemo),
  [liveExampleKey('shadcn/command', 'CommandWithGroups')]:
    commandDialogExample(CommandWithGroups),
  [liveExampleKey('shadcn/command', 'CommandManyItems')]:
    commandDialogExample(CommandManyItems),
  [liveExampleKey('shadcn/command', 'CommandRtl')]: staticExample(CommandRtl),
  [liveExampleKey('shadcn/command', 'CommandWithShortcuts')]:
    commandDialogExample(CommandWithShortcuts),
  [liveExampleKey('shadcn/item', 'ItemAvatar')]: staticExample(ItemAvatar),
  [liveExampleKey('shadcn/item', 'ItemDemo')]: staticExample(ItemDemo),
  [liveExampleKey('shadcn/item', 'ItemDropdown')]: staticExample(ItemDropdown),
  [liveExampleKey('shadcn/item', 'ItemGroupExample')]:
    staticExample(ItemGroupExample),
  [liveExampleKey('shadcn/item', 'ItemHeaderDemo')]:
    staticExample(ItemHeaderDemo),
  [liveExampleKey('shadcn/item', 'ItemIcon')]: staticExample(ItemIcon),
  [liveExampleKey('shadcn/item', 'ItemImage')]: staticExample(ItemImage),
  [liveExampleKey('shadcn/item', 'ItemLink')]: staticExample(ItemLink),
  [liveExampleKey('shadcn/item', 'ItemRtl')]: staticExample(ItemRtl),
  [liveExampleKey('shadcn/item', 'ItemSizeDemo')]: staticExample(ItemSizeDemo),
  [liveExampleKey('shadcn/item', 'ItemVariant')]: staticExample(ItemVariant),
  [liveExampleKey('shadcn/marker', 'MarkerDemo')]: staticExample(MarkerDemo),
  [liveExampleKey('shadcn/marker', 'MarkerStatus')]:
    staticExample(MarkerStatus),
  [liveExampleKey('shadcn/marker', 'MarkerVariants')]:
    staticExample(MarkerVariants),
  [liveExampleKey('shadcn/marker', 'MarkerIconDemo')]:
    staticExample(MarkerIconDemo),
  [liveExampleKey('shadcn/marker', 'MarkerBorder')]:
    staticExample(MarkerBorder),
  [liveExampleKey('shadcn/marker', 'MarkerSeparator')]:
    staticExample(MarkerSeparator),
  [liveExampleKey('shadcn/marker', 'MarkerShimmer')]:
    staticExample(MarkerShimmer),
  [liveExampleKey('shadcn/marker', 'MarkerLinkButton')]:
    staticExample(MarkerLinkButton),
  [liveExampleKey('shadcn/input-group', 'InputGroupDemo')]:
    staticExample(InputGroupDemo),
  [liveExampleKey('shadcn/input-group', 'InputGroupBasic')]:
    staticExample(InputGroupBasic),
  [liveExampleKey('shadcn/input-group', 'InputGroupInlineStart')]:
    staticExample(InputGroupInlineStart),
  [liveExampleKey('shadcn/input-group', 'InputGroupInlineEnd')]:
    staticExample(InputGroupInlineEnd),
  [liveExampleKey('shadcn/input-group', 'InputGroupBlockStart')]:
    staticExample(InputGroupBlockStart),
  [liveExampleKey('shadcn/input-group', 'InputGroupBlockEnd')]:
    staticExample(InputGroupBlockEnd),
  [liveExampleKey('shadcn/input-group', 'InputGroupWithButtons')]:
    staticExample(InputGroupWithButtons),
  [liveExampleKey('shadcn/input-group', 'InputGroupButtonGroup')]:
    staticExample(InputGroupButtonGroup),
  [liveExampleKey('shadcn/input-group', 'InputGroupDropdown')]:
    staticExample(InputGroupDropdown),
  [liveExampleKey('shadcn/input-group', 'InputGroupIcon')]:
    staticExample(InputGroupIcon),
  [liveExampleKey('shadcn/input-group', 'InputGroupKbd')]:
    staticExample(InputGroupKbd),
  [liveExampleKey('shadcn/input-group', 'InputGroupLabel')]:
    staticExample(InputGroupLabel),
  [liveExampleKey('shadcn/input-group', 'InputGroupTextExample')]:
    staticExample(InputGroupTextExample),
  [liveExampleKey('shadcn/input-group', 'InputGroupTextareaExample')]:
    staticExample(InputGroupTextareaExample),
  [liveExampleKey('shadcn/input-group', 'InputGroupInCard')]:
    staticExample(InputGroupInCard),
  [liveExampleKey('shadcn/input-group', 'InputGroupWithKbd')]:
    staticExample(InputGroupWithKbd),
  [liveExampleKey('shadcn/input-group', 'InputGroupSpinner')]:
    staticExample(InputGroupSpinner),
  [liveExampleKey('shadcn/input-group', 'InputGroupRtl')]:
    staticExample(InputGroupRtl),
  [liveExampleKey('shadcn/empty', 'EmptyAvatarGroup')]:
    staticExample(EmptyAvatarGroup),
  [liveExampleKey('shadcn/empty', 'EmptyAvatar')]: staticExample(EmptyAvatar),
  [liveExampleKey('shadcn/empty', 'EmptyMuted')]: staticExample(EmptyMuted),
  [liveExampleKey('shadcn/empty', 'EmptyInCard')]: staticExample(EmptyInCard),
  [liveExampleKey('shadcn/empty', 'EmptyDemo')]: staticExample(EmptyDemo),
  [liveExampleKey('shadcn/empty', 'EmptyInputGroup')]:
    staticExample(EmptyInputGroup),
  [liveExampleKey('shadcn/empty', 'EmptyOutline')]: staticExample(EmptyOutline),
  [liveExampleKey('shadcn/empty', 'EmptyRtl')]: staticExample(EmptyRtl),
  [liveExampleKey('shadcn/spinner', 'SpinnerDemo')]: staticExample(SpinnerDemo),
  [liveExampleKey('shadcn/spinner', 'SpinnerBadge')]:
    staticExample(SpinnerBadge),
  [liveExampleKey('shadcn/spinner', 'SpinnerButton')]:
    staticExample(SpinnerButton),
  [liveExampleKey('shadcn/spinner', 'SpinnerCustom')]:
    staticExample(SpinnerCustom),
  [liveExampleKey('shadcn/spinner', 'SpinnerInputGroup')]:
    staticExample(SpinnerInputGroup),
  [liveExampleKey('shadcn/spinner', 'SpinnerEmpty')]:
    staticExample(SpinnerEmpty),
  [liveExampleKey('shadcn/spinner', 'SpinnerRtl')]: staticExample(SpinnerRtl),
  [liveExampleKey('shadcn/spinner', 'SpinnerSize')]: staticExample(SpinnerSize),
  [liveExampleKey('shadcn/table', 'TableActions')]: staticExample(TableActions),
  [liveExampleKey('shadcn/table', 'TableDemo')]: staticExample(TableDemo),
  [liveExampleKey('shadcn/table', 'TableFooterExample')]:
    staticExample(TableFooterExample),
  [liveExampleKey('shadcn/table', 'TableRtl')]: staticExample(TableRtl),
  [liveExampleKey('shadcn/pagination', 'PaginationDemo')]:
    staticExample(PaginationDemo),
  [liveExampleKey('shadcn/pagination', 'PaginationIconsOnly')]:
    staticExample(PaginationIconsOnly),
  [liveExampleKey('shadcn/pagination', 'PaginationRtl')]:
    staticExample(PaginationRtl),
  [liveExampleKey('shadcn/pagination', 'PaginationSimple')]:
    staticExample(PaginationSimple),
  [liveExampleKey('shadcn/resizable', 'ResizableDemo')]:
    resizableExample(ResizableDemo),
  [liveExampleKey('shadcn/resizable', 'ResizableHandleDemo')]:
    resizableExample(ResizableHandleDemo),
  [liveExampleKey('shadcn/resizable', 'ResizableVertical')]:
    resizableExample(ResizableVertical),
  [liveExampleKey('shadcn/resizable', 'ResizableRtl')]:
    resizableExample(ResizableRtl),
  [liveExampleKey('shadcn/sidebar', 'SidebarControlled')]:
    sidebarExample(SidebarControlled),
  [liveExampleKey('shadcn/sidebar', 'SidebarDemo')]:
    sidebarExample(SidebarDemo),
  [liveExampleKey('shadcn/sidebar', 'SidebarFooter')]:
    sidebarExample(SidebarFooter),
  [liveExampleKey('shadcn/sidebar', 'SidebarGroupAction')]:
    staticExample(SidebarGroupAction),
  [liveExampleKey('shadcn/sidebar', 'SidebarGroupCollapsible')]: staticExample(
    SidebarGroupCollapsible,
  ),
  [liveExampleKey('shadcn/sidebar', 'SidebarHeader')]:
    sidebarExample(SidebarHeader),
  [liveExampleKey('shadcn/sidebar', 'SidebarMenuAction')]:
    staticExample(SidebarMenuAction),
  [liveExampleKey('shadcn/sidebar', 'SidebarMenuBadge')]:
    staticExample(SidebarMenuBadge),
  [liveExampleKey('shadcn/sidebar', 'SidebarMenuCollapsible')]: staticExample(
    SidebarMenuCollapsible,
  ),
  [liveExampleKey('shadcn/sidebar', 'SidebarMenuSub')]:
    staticExample(SidebarMenuSub),
  [liveExampleKey('shadcn/sidebar', 'SidebarMenu')]: staticExample(SidebarMenu),
  [liveExampleKey('shadcn/sidebar', 'SidebarRsc')]: staticExample(SidebarRsc),
  [liveExampleKey('shadcn/sidebar', 'SidebarRtl')]: sidebarExample(SidebarRtl),
  [liveExampleKey('shadcn/radio-group', 'RadioGroupDemo')]: radioGroupExample(
    RadioGroupDemo,
    'comfortable',
  ),
  [liveExampleKey('shadcn/radio-group', 'RadioGroupDescription')]:
    radioGroupExample(RadioGroupDescription, 'comfortable'),
  [liveExampleKey('shadcn/radio-group', 'RadioGroupChoiceCard')]:
    radioGroupExample(RadioGroupChoiceCard, 'plus'),
  [liveExampleKey('shadcn/radio-group', 'RadioGroupDisabled')]:
    radioGroupExample(RadioGroupDisabled, 'option-2'),
  [liveExampleKey('shadcn/radio-group', 'RadioGroupFieldset')]:
    radioGroupExample(RadioGroupFieldset, 'monthly'),
  [liveExampleKey('shadcn/radio-group', 'RadioGroupInvalid')]:
    radioGroupExample(RadioGroupInvalid, 'email'),
  [liveExampleKey('shadcn/radio-group', 'RadioGroupRtl')]: radioGroupExample(
    RadioGroupRtl,
    'comfortable',
  ),
}

export const liveExampleViewFor = <Message>(
  example: ExampleDocsArtifact,
  context: LiveExampleContext<Message>,
): Option.Option<Html> => {
  if (example.previewStatus !== 'live-ready') {
    return Option.none()
  }

  return pipe(
    example.previewExportName,
    Option.flatMap(previewExportName =>
      Option.fromNullishOr(
        liveExampleViews[
          liveExampleKey(example.componentItemId, previewExportName)
        ],
      ),
    ),
    Option.map(definition => definition.render(example, context)),
  )
}
