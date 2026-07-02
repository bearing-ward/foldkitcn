import { Option, pipe } from 'effect'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'

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
  AccordionBasic,
  AccordionCard,
  AccordionDisabled,
  AccordionMultiple,
  AccordionRtl,
} from './registry/shadcn/accordion/examples'
import type { AccordionExampleController } from './registry/shadcn/accordion/examples'
import type { AccordionValueChange } from './registry/shadcn/accordion/index'
import {
  AlertDialogBasic,
  AlertDialogDemo,
  AlertDialogDestructive,
  AlertDialogRtl,
  AlertDialogSmall,
  AlertDialogSmallWithMedia,
  AlertDialogWithMedia,
} from './registry/shadcn/alert-dialog/examples'
import type { AlertDialogExampleController } from './registry/shadcn/alert-dialog/examples'
import {
  AlertActionExample,
  AlertBasic,
  AlertColors,
  AlertDemo,
  AlertDestructive,
  AlertRtl,
} from './registry/shadcn/alert/examples'
import {
  AspectRatioDemo,
  AspectRatioPortrait,
  AspectRatioRtl,
  AspectRatioSquare,
} from './registry/shadcn/aspect-ratio/examples'
import {
  AttachmentDemo,
  AttachmentGroupDemo,
  AttachmentImage,
  AttachmentSizes,
  AttachmentStates,
  AttachmentTriggerDemo,
} from './registry/shadcn/attachment/examples'
import {
  AvatarBadgeIconExample,
  AvatarBasic,
  AvatarDemo,
  AvatarDropdown,
  AvatarGroupCountExample,
  AvatarGroupCountIconExample,
  AvatarGroupExample,
  AvatarRtl,
  AvatarSizeExample,
  AvatarWithBadge,
} from './registry/shadcn/avatar/examples'
import {
  BadgeColors,
  BadgeDemo,
  BadgeIcon,
  BadgeLink,
  BadgeRtl,
  BadgeSpinner,
  BadgeVariants,
} from './registry/shadcn/badge/examples'
import {
  BreadcrumbBasic,
  BreadcrumbDemo,
  BreadcrumbDropdown,
  BreadcrumbEllipsisDemo,
  BreadcrumbLinkDemo,
  BreadcrumbRtl,
  BreadcrumbSeparatorDemo,
} from './registry/shadcn/breadcrumb/examples'
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
  CardDemo,
  CardEdgeToEdge,
  CardImage,
  CardRtl,
  CardSmall,
  CardSpacing,
} from './registry/shadcn/card/examples'
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
import type {
  CheckboxCheckedChange,
  CheckboxCheckedState,
} from './registry/shadcn/checkbox'
import { view as CheckboxView } from './registry/shadcn/checkbox'
import {
  CollapsibleBasic,
  CollapsibleDemo,
  CollapsibleFileTree,
  CollapsibleRtl,
  CollapsibleSettings,
} from './registry/shadcn/collapsible/examples'
import type { CollapsibleExampleController } from './registry/shadcn/collapsible/examples'
import type { CollapsibleOpenChange } from './registry/shadcn/collapsible/index'
import {
  displayValue as displayComboboxValue,
  view as ComboboxView,
} from './registry/shadcn/combobox'
import type {
  ComboboxInputValueChange,
  ComboboxItemDescriptor,
  ComboboxOpenChange,
  ComboboxValueChange,
} from './registry/shadcn/combobox'
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
  ContextMenuBasic,
  ContextMenuCheckboxes,
  ContextMenuDemo,
  ContextMenuDestructive,
  ContextMenuGroups,
  ContextMenuIcons,
  ContextMenuRadio,
  ContextMenuRtl,
  ContextMenuShortcuts,
  ContextMenuSides,
  ContextMenuSubmenu,
} from './registry/shadcn/context-menu/examples'
import type { ContextMenuExampleController } from './registry/shadcn/context-menu/examples'
import {
  DialogCloseButton,
  DialogDemo,
  DialogNoCloseButton,
  DialogRtl,
  DialogScrollableContent,
  DialogStickyFooter,
} from './registry/shadcn/dialog/examples'
import type { DialogExampleController } from './registry/shadcn/dialog/examples'
import {
  DirectionDemo,
  DirectionRtlCard,
} from './registry/shadcn/direction/examples'
import {
  DrawerDemo,
  DrawerRtl,
  DrawerScrollableContent,
  DrawerWithSides,
} from './registry/shadcn/drawer/examples'
import type { DrawerExampleController } from './registry/shadcn/drawer/examples'
import {
  DropdownMenuAvatar,
  DropdownMenuBasic,
  DropdownMenuCheckboxes,
  DropdownMenuCheckboxesIcons,
  DropdownMenuComplex,
  DropdownMenuDemo,
  DropdownMenuDestructive,
  DropdownMenuIcons,
  DropdownMenuRadioGroup,
  DropdownMenuRadioIcons,
  DropdownMenuRtl,
  DropdownMenuShortcuts,
  DropdownMenuSubmenu,
} from './registry/shadcn/dropdown-menu/examples'
import type { DropdownMenuExampleController } from './registry/shadcn/dropdown-menu/examples'
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
  FieldCheckbox,
  FieldInput,
  FieldResponsive,
  FieldRtl,
  FieldTextarea,
} from './registry/shadcn/field/examples'
import {
  HoverCardDemo,
  HoverCardRtl,
  HoverCardSides,
} from './registry/shadcn/hover-card/examples'
import type { HoverCardExampleController } from './registry/shadcn/hover-card/examples'
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
  InputOTPGroup,
  InputOTPSeparator,
  view as InputOTPView,
} from './registry/shadcn/input-otp'
import {
  InputBasic,
  InputDemo,
  InputDisabled,
  InputFile,
  InputInvalid,
  InputRequired,
} from './registry/shadcn/input/examples'
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
  KbdButton,
  KbdDemo,
  KbdGroupExample,
  KbdInputGroup,
  KbdRtl,
  KbdTooltip,
} from './registry/shadcn/kbd/examples'
import { LabelDemo, LabelRtl } from './registry/shadcn/label/examples'
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
  MenubarCheckbox,
  MenubarDemo,
  MenubarIcons,
  MenubarRadio,
  MenubarRtl,
  MenubarSubmenu,
} from './registry/shadcn/menubar/examples'
import type { MenubarExampleController } from './registry/shadcn/menubar/examples'
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
  NativeSelectDemo,
  NativeSelectDisabled,
  NativeSelectGroups,
  NativeSelectInvalid,
  NativeSelectRtl,
} from './registry/shadcn/native-select/examples'
import {
  NavigationMenuDemo,
  NavigationMenuRtl,
} from './registry/shadcn/navigation-menu/examples'
import type { NavigationMenuExampleController } from './registry/shadcn/navigation-menu/examples'
import {
  PaginationDemo,
  PaginationIconsOnly,
  PaginationRtl,
  PaginationSimple,
} from './registry/shadcn/pagination/examples'
import {
  PopoverAlignments,
  PopoverBasic,
  PopoverDemo,
  PopoverForm,
  PopoverRtl,
} from './registry/shadcn/popover/examples'
import type { PopoverExampleController } from './registry/shadcn/popover/examples'
import {
  ProgressControlled,
  ProgressDemo,
  ProgressRtl,
  ProgressWithLabel,
} from './registry/shadcn/progress/examples'
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
  ScrollAreaDemo,
  ScrollAreaHorizontalDemo,
  ScrollAreaRtl,
} from './registry/shadcn/scroll-area/examples'
import {
  displayValue as displaySelectValue,
  view as SelectView,
} from './registry/shadcn/select'
import type {
  SelectItemDescriptor,
  SelectOpenChange,
  SelectValueChange,
} from './registry/shadcn/select'
import {
  SeparatorDemo,
  SeparatorList,
  SeparatorMenu,
  SeparatorRtl,
  SeparatorVertical,
} from './registry/shadcn/separator/examples'
import {
  SheetDemo,
  SheetNoCloseButton,
  SheetRtl,
  SheetSide,
} from './registry/shadcn/sheet/examples'
import type { SheetExampleController } from './registry/shadcn/sheet/examples'
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
  SkeletonAvatar,
  SkeletonCard,
  SkeletonDemo,
  SkeletonForm,
  SkeletonRtl,
  SkeletonTable,
  SkeletonText,
} from './registry/shadcn/skeleton/examples'
import { view as SliderView } from './registry/shadcn/slider'
import type { SliderValueChange } from './registry/shadcn/slider'
import {
  renderSonnerDemoToaster,
  SonnerDemo as ShadcnSonnerDemo,
  SonnerDescription as ShadcnSonnerDescription,
  SonnerPosition as ShadcnSonnerPosition,
  SonnerTypes as ShadcnSonnerTypes,
} from './registry/shadcn/sonner/examples'
import type {
  ToastExampleController as SonnerExampleController,
  ToastExampleMessage as SonnerExampleMessage,
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
import type { SwitchCheckedChange } from './registry/shadcn/switch'
import { view as SwitchView } from './registry/shadcn/switch'
import {
  TableActions,
  TableDemo,
  TableFooterExample,
  TableRtl,
} from './registry/shadcn/table/examples'
import {
  TabsDemo,
  TabsDisabled,
  TabsIcons,
  TabsLine,
  TabsRtl,
  TabsVertical,
} from './registry/shadcn/tabs/examples'
import type { TabsExampleController } from './registry/shadcn/tabs/examples'
import type { TabsValueChange } from './registry/shadcn/tabs/index'
import {
  TextareaButton,
  TextareaDemo,
  TextareaDisabled,
  TextareaField,
  TextareaInvalid,
  TextareaRtl,
} from './registry/shadcn/textarea/examples'
import {
  ToastDemo as ShadcnToastDemo,
  ToastDestructive as ShadcnToastDestructive,
  ToastSimple as ShadcnToastSimple,
  ToastStacked as ShadcnToastStacked,
  ToastWithAction as ShadcnToastWithAction,
  ToastWithTitle as ShadcnToastWithTitle,
} from './registry/shadcn/toast/examples'
import type {
  ToastExampleController as ShadcnToastExampleController,
  ToastExampleMessage as ShadcnToastExampleMessage,
} from './registry/shadcn/toast/examples'
import {
  ToggleGroupDemo,
  ToggleGroupDisabled,
  ToggleGroupFontWeightSelector,
  ToggleGroupOutline,
  ToggleGroupRtl,
  ToggleGroupSizes,
  ToggleGroupSpacing,
  ToggleGroupVertical,
} from './registry/shadcn/toggle-group/examples'
import type { ToggleGroupExampleController } from './registry/shadcn/toggle-group/examples'
import type { ToggleGroupValueChange } from './registry/shadcn/toggle-group/index'
import {
  ToggleDemo,
  ToggleDisabled,
  ToggleOutline,
  ToggleRtl,
  ToggleSizes,
  ToggleText,
} from './registry/shadcn/toggle/examples'
import type { ToggleExampleController } from './registry/shadcn/toggle/examples'
import type { TogglePressedChange } from './registry/shadcn/toggle/index'
import {
  TooltipDemo,
  TooltipDisabled,
  TooltipKeyboard,
  TooltipRtl,
  TooltipSides,
} from './registry/shadcn/tooltip/examples'
import type { TooltipExampleController } from './registry/shadcn/tooltip/examples'

export type LiveExampleContext<Message> = Readonly<{
  inputValueFor: (example: ExampleDocsArtifact, defaultValue: string) => string
  inputIdPrefixFor: (example: ExampleDocsArtifact) => string
  onInputValueChange: (
    example: ExampleDocsArtifact,
    change: InputValueChange,
  ) => Message
  otpValueFor: (example: ExampleDocsArtifact, defaultValue: string) => string
  onOtpValueChange: (
    example: ExampleDocsArtifact,
    change: Readonly<{ value: string }>,
  ) => Message
  sliderValuesFor: (
    example: ExampleDocsArtifact,
    sliderId: string,
    defaultValues: ReadonlyArray<number>,
  ) => ReadonlyArray<number>
  onSliderValueChange: (
    example: ExampleDocsArtifact,
    sliderId: string,
    change: SliderValueChange,
  ) => Message
  selectIsOpenFor: (example: ExampleDocsArtifact) => boolean
  selectValueFor: (
    example: ExampleDocsArtifact,
    defaultValue: string | undefined,
  ) => string | undefined
  onSelectOpenChange: (
    example: ExampleDocsArtifact,
    change: SelectOpenChange,
  ) => Message
  onSelectValueChange: (
    example: ExampleDocsArtifact,
    change: SelectValueChange,
  ) => Message
  comboboxIsOpenFor: (example: ExampleDocsArtifact) => boolean
  comboboxInputValueFor: (
    example: ExampleDocsArtifact,
    defaultValue: string,
  ) => string
  comboboxValueFor: (
    example: ExampleDocsArtifact,
    defaultValue: string | undefined,
  ) => string | undefined
  comboboxValuesFor: (
    example: ExampleDocsArtifact,
    defaultValues: ReadonlyArray<string>,
  ) => ReadonlyArray<string>
  onComboboxOpenChange: (
    example: ExampleDocsArtifact,
    change: ComboboxOpenChange,
  ) => Message
  onComboboxInputValueChange: (
    example: ExampleDocsArtifact,
    change: ComboboxInputValueChange,
  ) => Message
  onComboboxValueChange: (
    example: ExampleDocsArtifact,
    change: ComboboxValueChange,
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
  checkboxCheckedStateFor: (
    example: ExampleDocsArtifact,
    controlId: string,
    defaultCheckedState: CheckboxCheckedState,
  ) => CheckboxCheckedState
  onCheckboxCheckedChange: (
    example: ExampleDocsArtifact,
    controlId: string,
    change: CheckboxCheckedChange,
  ) => Message
  switchIsCheckedFor: (
    example: ExampleDocsArtifact,
    controlId: string,
    defaultIsChecked: boolean,
  ) => boolean
  onSwitchCheckedChange: (
    example: ExampleDocsArtifact,
    controlId: string,
    change: SwitchCheckedChange,
  ) => Message
  accordionValuesFor: (
    example: ExampleDocsArtifact,
    accordionId: string,
    defaultValues: ReadonlyArray<string>,
  ) => ReadonlyArray<string>
  onAccordionValueChange: (
    example: ExampleDocsArtifact,
    accordionId: string,
    change: AccordionValueChange,
  ) => Message
  collapsibleIsOpenFor: (
    example: ExampleDocsArtifact,
    collapsibleId: string,
    defaultOpen: boolean,
  ) => boolean
  onCollapsibleOpenChange: (
    example: ExampleDocsArtifact,
    collapsibleId: string,
    change: CollapsibleOpenChange,
  ) => Message
  tabsValueFor: (
    example: ExampleDocsArtifact,
    tabsId: string,
    defaultValue: string | undefined,
  ) => string | undefined
  onTabsValueChange: (
    example: ExampleDocsArtifact,
    tabsId: string,
    change: TabsValueChange,
  ) => Message
  toggleIsPressedFor: (
    example: ExampleDocsArtifact,
    controlId: string,
    defaultIsPressed: boolean,
  ) => boolean
  onTogglePressedChange: (
    example: ExampleDocsArtifact,
    controlId: string,
    change: TogglePressedChange,
  ) => Message
  toggleGroupValuesFor: (
    example: ExampleDocsArtifact,
    groupId: string,
    defaultValues: ReadonlyArray<string>,
  ) => ReadonlyArray<string>
  onToggleGroupValueChange: (
    example: ExampleDocsArtifact,
    groupId: string,
    change: ToggleGroupValueChange,
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
  overlayIsOpenFor: (
    example: ExampleDocsArtifact,
    overlayId: string,
    defaultOpen: boolean,
  ) => boolean
  onOverlayOpenChange: (
    example: ExampleDocsArtifact,
    overlayId: string,
    change: Readonly<{ open: boolean }>,
  ) => Message
  menuIsOpenFor: (
    example: ExampleDocsArtifact,
    menuId: string,
    defaultOpen: boolean,
  ) => boolean
  menuOpenSubmenuValuesFor: (
    example: ExampleDocsArtifact,
    menuId: string,
    defaultValues: ReadonlyArray<string>,
  ) => ReadonlyArray<string>
  menuContextPointFor: (
    example: ExampleDocsArtifact,
    menuId: string,
  ) => Option.Option<
    Readonly<{
      clientX: number
      clientY: number
      screenX: number
      screenY: number
      pointerType: string
    }>
  >
  menuValueFor: (
    example: ExampleDocsArtifact,
    menuId: string,
    defaultValue: string | undefined,
  ) => string | undefined
  onMenuOpenChange: (
    example: ExampleDocsArtifact,
    menuId: string,
    change: Readonly<{
      open: boolean
      parentValue?: string | undefined
    }>,
  ) => Message
  onMenuContextPointChange: (
    example: ExampleDocsArtifact,
    menuId: string,
    point: Readonly<{
      clientX: number
      clientY: number
      screenX: number
      screenY: number
      pointerType: string
    }>,
  ) => Message
  onMenuValueChange: (
    example: ExampleDocsArtifact,
    menuId: string,
    change: Readonly<{ value?: string | undefined }>,
  ) => Message
  toastStateFor: (example: ExampleDocsArtifact) => ToastState
  onToastMessage: (
    example: ExampleDocsArtifact,
    message:
      | ToastExampleMessage
      | SonnerExampleMessage
      | ShadcnToastExampleMessage,
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

type ShadcnToastExampleView = <Message = never>(
  controller?: ShadcnToastExampleController<Message>,
) => Html

type SonnerExampleView = <Message = never>(
  controller?: SonnerExampleController<Message>,
) => Html

type AlertDialogExampleView = <Message = never>(
  controller?: AlertDialogExampleController<Message>,
) => Html

type DialogExampleView = <Message = never>(
  controller?: DialogExampleController<Message>,
) => Html

type DrawerExampleView = <Message = never>(
  controller?: DrawerExampleController<Message>,
) => Html

type HoverCardExampleView = <Message = never>(
  controller?: HoverCardExampleController<Message>,
) => Html

type PopoverExampleView = <Message = never>(
  controller?: PopoverExampleController<Message>,
) => Html

type SheetExampleView = <Message = never>(
  controller?: SheetExampleController<Message>,
) => Html

type TooltipExampleView = <Message = never>(
  controller?: TooltipExampleController<Message>,
) => Html

type DropdownMenuExampleView = <Message = never>(
  controller?: DropdownMenuExampleController<Message>,
) => Html

type ContextMenuExampleView = <Message = never>(
  controller?: ContextMenuExampleController<Message>,
) => Html

type MenubarExampleView = <Message = never>(
  controller?: MenubarExampleController<Message>,
) => Html

type NavigationMenuExampleView = <Message = never>(
  controller?: NavigationMenuExampleController<Message>,
) => Html

type SidebarExampleView = <Message = never>(
  controller?: SidebarController<Message>,
) => Html

type AccordionExampleView = <Message = never>(
  controller?: AccordionExampleController<Message>,
) => Html

type CollapsibleExampleView = <Message = never>(
  controller?: CollapsibleExampleController<Message>,
) => Html

type TabsExampleView = <Message = never>(
  controller?: TabsExampleController<Message>,
) => Html

type ToggleExampleView = <Message = never>(
  controller?: ToggleExampleController<Message>,
) => Html

type ToggleGroupExampleView = <Message = never>(
  controller?: ToggleGroupExampleController<Message>,
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

const compactExample = (view: () => Html): LiveExampleDefinition => ({
  render: () => {
    const h = html<never>()

    return h.div(
      [h.Class('flex w-full min-w-0 items-center justify-center')],
      [view()],
    )
  },
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

const otpExample = (
  config: Readonly<{
    id: string
    defaultValue?: string
    length?: number
    validationType?: 'numeric' | 'alpha' | 'alphanumeric' | 'none'
    isDisabled?: boolean
    isInvalid?: boolean
    dir?: string
    split?: boolean
  }>,
): LiveExampleDefinition => ({
  render: <Message>(
    example: ExampleDocsArtifact,
    context: LiveExampleContext<Message>,
  ) => {
    const h = html<Message>()
    const value = context.otpValueFor(example, config.defaultValue ?? '')
    const input = InputOTPView<Message>({
      id: config.id,
      length: config.length ?? 6,
      value,
      validationType: config.validationType,
      isDisabled: config.isDisabled,
      isInvalid: config.isInvalid,
      dir: config.dir,
      onValueChange: change => context.onOtpValueChange(example, change),
      toView: attributes =>
        config.split === true
          ? h.div(
              [...attributes.root],
              [
                InputOTPGroup<Message>({ attributes, indexes: [0, 1, 2] }),
                InputOTPSeparator(),
                InputOTPGroup<Message>({ attributes, indexes: [3, 4, 5] }),
                h.input([...attributes.hiddenInput]),
              ],
            )
          : InputOTPGroup<Message>({
              attributes,
              indexes: Array.from(
                { length: attributes.state.length },
                (_item, index) => index,
              ),
            }),
    })

    return h.div(
      [
        h.Class('grid justify-items-center gap-2'),
        ...(config.dir === 'rtl' ? [h.Dir('rtl')] : []),
      ],
      [
        input,
        ...(config.isDisabled === true
          ? []
          : [
              h.div(
                [h.Class('text-center text-sm text-muted-foreground')],
                [value === '' ? 'Enter code' : `Value: ${value}`],
              ),
            ]),
      ],
    )
  },
})

const sliderExample = (
  config: Readonly<{
    id: string
    defaultValues: ReadonlyArray<number>
    min?: number
    max?: number
    step?: number
    orientation?: 'horizontal' | 'vertical'
    dir?: 'ltr' | 'rtl'
    className?: string
    isDisabled?: boolean
    label?: string
  }>,
): LiveExampleDefinition => ({
  render: <Message>(
    example: ExampleDocsArtifact,
    context: LiveExampleContext<Message>,
  ) => {
    const h = html<Message>()
    const values = context.sliderValuesFor(
      example,
      config.id,
      config.defaultValues,
    )
    const valueText = values.join(', ')

    return h.div(
      [
        h.Class(
          config.orientation === 'vertical'
            ? 'mx-auto flex items-center justify-center gap-6'
            : 'mx-auto grid w-full max-w-xs gap-3',
        ),
      ],
      [
        ...(config.orientation === 'vertical'
          ? []
          : [
              h.div(
                [h.Class('flex items-center justify-between gap-2 text-sm')],
                [
                  h.span([], [config.label ?? 'Value']),
                  h.span([h.Class('text-muted-foreground')], [valueText]),
                ],
              ),
            ]),
        SliderView<Message>({
          id: config.id,
          values: [...values],
          min: config.min,
          max: config.max,
          step: config.step,
          orientation: config.orientation,
          dir: config.dir,
          className: config.className,
          isDisabled: config.isDisabled,
          onValueChange: change =>
            context.onSliderValueChange(example, config.id, change),
        }),
      ],
    )
  },
})

const selectFruitItems: ReadonlyArray<SelectItemDescriptor> = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Blueberry', value: 'blueberry' },
  { label: 'Grapes', value: 'grapes' },
  { label: 'Pineapple', value: 'pineapple' },
]

const selectVegetableItems: ReadonlyArray<SelectItemDescriptor> = [
  { label: 'Carrot', value: 'carrot' },
  { label: 'Broccoli', value: 'broccoli' },
  { label: 'Spinach', value: 'spinach' },
]

const selectTimezoneGroups: ReadonlyArray<
  Readonly<{ label: string; items: ReadonlyArray<SelectItemDescriptor> }>
> = [
  {
    label: 'North America',
    items: [
      { label: 'Eastern Standard Time', value: 'est' },
      { label: 'Central Standard Time', value: 'cst' },
      { label: 'Mountain Standard Time', value: 'mst' },
      { label: 'Pacific Standard Time', value: 'pst' },
    ],
  },
  {
    label: 'Europe',
    items: [
      { label: 'Greenwich Mean Time', value: 'gmt' },
      { label: 'Central European Time', value: 'cet' },
      { label: 'Eastern European Time', value: 'eet' },
      { label: 'Central Africa Time', value: 'cat' },
    ],
  },
  {
    label: 'Asia Pacific',
    items: [
      { label: 'India Standard Time', value: 'ist' },
      { label: 'China Standard Time', value: 'cst_china' },
      { label: 'Japan Standard Time', value: 'jst' },
      { label: 'Australian Eastern Standard Time', value: 'aest' },
    ],
  },
]

const groupedSelectExample = (
  config: Readonly<{
    id: string
    items: ReadonlyArray<SelectItemDescriptor>
    placeholder: string
    defaultValue?: string
    isDisabled?: boolean
    isInvalid?: boolean
    dir?: string
    triggerClassName?: string
    groups?: ReadonlyArray<
      Readonly<{ label?: string; items: ReadonlyArray<SelectItemDescriptor> }>
    >
  }>,
): LiveExampleDefinition => ({
  render: <Message>(
    example: ExampleDocsArtifact,
    context: LiveExampleContext<Message>,
  ) => {
    const h = html<Message>()
    const value = context.selectValueFor(example, config.defaultValue)
    const groups = config.groups ?? [{ items: config.items }]
    const displayValue = displaySelectValue({
      items: config.items,
      placeholder: config.placeholder,
      value,
    })

    return SelectView<Message>({
      id: config.id,
      open: context.selectIsOpenFor(example),
      items: config.items,
      placeholder: config.placeholder,
      triggerClassName: config.triggerClassName ?? 'w-full max-w-48',
      contentClassName: 'max-h-64',
      ...(value === undefined ? {} : { value }),
      ...(config.isDisabled === undefined
        ? {}
        : { isDisabled: config.isDisabled }),
      ...(config.isInvalid === undefined
        ? {}
        : { isInvalid: config.isInvalid }),
      ...(config.dir === undefined ? {} : { dir: config.dir }),
      onOpenChange: change => context.onSelectOpenChange(example, change),
      onValueChange: change => context.onSelectValueChange(example, change),
      toView: attributes =>
        h.div(
          [...attributes.root, h.Class('relative')],
          [
            h.button(
              [...attributes.trigger],
              [
                h.span([...attributes.value], [displayValue]),
                h.span([...attributes.icon], ['v']),
              ],
            ),
            h.div(
              [...attributes.portal],
              attributes.isMounted
                ? [
                    h.div([...attributes.backdrop.root], []),
                    h.div(
                      [...attributes.positioner.root],
                      [
                        h.div(
                          [...attributes.popup.root],
                          [
                            h.div([...attributes.scrollUp.root], ['^']),
                            h.div(
                              [...attributes.list.root],
                              groups.flatMap((group, index) => [
                                h.div(
                                  [...attributes.group],
                                  [
                                    ...(group.label === undefined
                                      ? []
                                      : [
                                          h.div(
                                            [...attributes.groupLabel],
                                            [group.label],
                                          ),
                                        ]),
                                    ...attributes.items
                                      .filter(itemAttributes =>
                                        group.items.some(
                                          item =>
                                            item.value ===
                                            itemAttributes.item.value,
                                        ),
                                      )
                                      .map(itemAttributes =>
                                        h.div(
                                          [...itemAttributes.root],
                                          [
                                            h.span(
                                              [...itemAttributes.text],
                                              [itemAttributes.item.label],
                                            ),
                                            h.span(
                                              [...itemAttributes.indicator],
                                              [],
                                            ),
                                          ],
                                        ),
                                      ),
                                  ],
                                ),
                                ...(index === groups.length - 1
                                  ? []
                                  : [h.div([...attributes.separator], [])]),
                              ]),
                            ),
                            h.div([...attributes.scrollDown.root], ['v']),
                          ],
                        ),
                      ],
                    ),
                  ]
                : [],
            ),
            h.input([...attributes.hiddenInput]),
          ],
        ),
    })
  },
})

const comboboxFrameworks: ReadonlyArray<ComboboxItemDescriptor> = [
  { label: 'Next.js', value: 'next' },
  { label: 'SvelteKit', value: 'sveltekit' },
  { label: 'Nuxt.js', value: 'nuxt' },
  { label: 'Remix', value: 'remix' },
  { label: 'Astro', value: 'astro' },
]

const comboboxCountries: ReadonlyArray<ComboboxItemDescriptor> = [
  { label: 'Argentina', value: 'argentina', textValue: 'Argentina ar' },
  { label: 'Australia', value: 'australia', textValue: 'Australia au' },
  { label: 'Brazil', value: 'brazil', textValue: 'Brazil br' },
  { label: 'Canada', value: 'canada', textValue: 'Canada ca' },
  { label: 'China', value: 'china', textValue: 'China cn' },
  { label: 'France', value: 'france', textValue: 'France fr' },
  { label: 'Japan', value: 'japan', textValue: 'Japan jp' },
  {
    label: 'United States',
    value: 'united-states',
    textValue: 'United States',
  },
]

const comboboxTimezoneGroups: ReadonlyArray<
  Readonly<{ label: string; items: ReadonlyArray<ComboboxItemDescriptor> }>
> = [
  {
    label: 'Americas',
    items: [
      { label: '(GMT-5) New York', value: 'new-york' },
      { label: '(GMT-8) Los Angeles', value: 'los-angeles' },
      { label: '(GMT-6) Chicago', value: 'chicago' },
    ],
  },
  {
    label: 'Europe',
    items: [
      { label: '(GMT+0) London', value: 'london' },
      { label: '(GMT+1) Paris', value: 'paris' },
      { label: '(GMT+1) Berlin', value: 'berlin' },
    ],
  },
  {
    label: 'Asia Pacific',
    items: [
      { label: '(GMT+9) Tokyo', value: 'tokyo' },
      { label: '(GMT+8) Singapore', value: 'singapore' },
      { label: '(GMT+11) Sydney', value: 'sydney' },
    ],
  },
]

const comboboxCategories: ReadonlyArray<ComboboxItemDescriptor> = [
  { label: 'التكنولوجيا', value: 'technology' },
  { label: 'التصميم', value: 'design' },
  { label: 'الأعمال', value: 'business' },
  { label: 'التسويق', value: 'marketing' },
]

const groupedComboboxExample = (
  config: Readonly<{
    id: string
    items: ReadonlyArray<ComboboxItemDescriptor>
    placeholder: string
    defaultInputValue?: string
    defaultValue?: string
    defaultValues?: ReadonlyArray<string>
    selectionMode?: 'single' | 'multiple'
    isDisabled?: boolean
    isInvalid?: boolean
    showClear?: boolean
    autoHighlight?: boolean
    highlightedValue?: string
    contentClassName?: string
    inputGroupClassName?: string
    chipsClassName?: string
    anchorToChips?: boolean
    dir?: string
    emptyText?: string
    groups?: ReadonlyArray<
      Readonly<{ label?: string; items: ReadonlyArray<ComboboxItemDescriptor> }>
    >
  }>,
): LiveExampleDefinition => ({
  render: <Message>(
    example: ExampleDocsArtifact,
    context: LiveExampleContext<Message>,
  ) => {
    const h = html<Message>()
    const inputValue = context.comboboxInputValueFor(
      example,
      config.defaultInputValue ?? '',
    )
    const value = context.comboboxValueFor(example, config.defaultValue)
    const values = context.comboboxValuesFor(
      example,
      config.defaultValues ?? [],
    )
    const groups = config.groups ?? [{ items: config.items }]

    return ComboboxView<Message>({
      id: config.id,
      open: context.comboboxIsOpenFor(example),
      inputValue,
      items: config.items,
      placeholder: config.placeholder,
      contentClassName: config.contentClassName ?? 'max-h-64',
      ...(config.selectionMode === undefined
        ? {}
        : { selectionMode: config.selectionMode }),
      ...(value === undefined ? {} : { value }),
      ...(values.length === 0 ? {} : { values }),
      ...(config.highlightedValue === undefined
        ? {}
        : { highlightedValue: config.highlightedValue }),
      ...(config.isDisabled === undefined
        ? {}
        : { isDisabled: config.isDisabled }),
      ...(config.isInvalid === undefined
        ? {}
        : { isInvalid: config.isInvalid }),
      ...(config.autoHighlight === undefined
        ? {}
        : { autoHighlight: config.autoHighlight }),
      ...(config.showClear === undefined
        ? {}
        : { showClear: config.showClear }),
      ...(config.inputGroupClassName === undefined
        ? {}
        : { inputGroupClassName: config.inputGroupClassName }),
      ...(config.chipsClassName === undefined
        ? {}
        : { chipsClassName: config.chipsClassName }),
      ...(config.anchorToChips === undefined
        ? {}
        : { anchorToChips: config.anchorToChips }),
      ...(config.dir === undefined ? {} : { dir: config.dir }),
      onOpenChange: change => context.onComboboxOpenChange(example, change),
      onInputValueChange: change =>
        context.onComboboxInputValueChange(example, change),
      onValueChange: change => context.onComboboxValueChange(example, change),
      toView: attributes =>
        h.div(
          [...attributes.root, h.Class('relative')],
          [
            ...(config.selectionMode === 'multiple'
              ? [
                  h.div(
                    [...attributes.chips],
                    [
                      ...attributes.chipItems.map(chip =>
                        h.div(
                          [...chip.root],
                          [chip.item.label, h.button([...chip.remove], ['x'])],
                        ),
                      ),
                      h.input([
                        ...attributes.chipInput,
                        h.Placeholder(config.placeholder),
                      ]),
                    ],
                  ),
                ]
              : [
                  h.div(
                    [...attributes.inputGroup],
                    [
                      h.input([...attributes.input]),
                      h.div(
                        [
                          h.Role('group'),
                          h.DataAttribute('slot', 'input-group-addon'),
                          h.DataAttribute('align', 'inline-end'),
                        ],
                        [
                          h.button([...attributes.trigger], ['v']),
                          ...(config.showClear === true
                            ? [h.button([...attributes.clear], ['x'])]
                            : []),
                        ],
                      ),
                    ],
                  ),
                ]),
            h.div(
              [...attributes.portal],
              attributes.isMounted
                ? [
                    h.div([...attributes.backdrop.root], []),
                    h.div(
                      [...attributes.positioner.root],
                      [
                        h.div(
                          [...attributes.popup.root],
                          [
                            h.div(
                              [...attributes.empty],
                              attributes.isEmpty
                                ? [config.emptyText ?? 'No items found.']
                                : [],
                            ),
                            h.div(
                              [...attributes.list.root],
                              groups.flatMap((group, index) => [
                                h.div(
                                  [...attributes.group],
                                  [
                                    ...(group.label === undefined
                                      ? []
                                      : [
                                          h.div(
                                            [...attributes.groupLabel],
                                            [group.label],
                                          ),
                                        ]),
                                    ...attributes.items
                                      .filter(itemAttributes =>
                                        group.items.some(
                                          item =>
                                            item.value ===
                                            itemAttributes.item.value,
                                        ),
                                      )
                                      .map(itemAttributes =>
                                        h.div(
                                          [...itemAttributes.root],
                                          [
                                            h.span(
                                              [...itemAttributes.text],
                                              [itemAttributes.item.label],
                                            ),
                                            h.span(
                                              [...itemAttributes.indicator],
                                              [],
                                            ),
                                          ],
                                        ),
                                      ),
                                  ],
                                ),
                                ...(index === groups.length - 1
                                  ? []
                                  : [h.div([...attributes.separator], [])]),
                              ]),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ]
                : [],
            ),
            ...attributes.hiddenInputs.map(hiddenInput =>
              h.input([...hiddenInput]),
            ),
            ...(config.selectionMode === 'multiple'
              ? []
              : [
                  h.div(
                    [h.Class('mt-2 text-center text-sm text-muted-foreground')],
                    [
                      displayComboboxValue({
                        items: config.items,
                        placeholder: config.placeholder,
                        value,
                      }),
                    ],
                  ),
                ]),
          ],
        ),
    })
  },
})

const checkboxPreview = (
  controls: ReadonlyArray<
    Readonly<{
      id: string
      label: string
      defaultCheckedState?: CheckboxCheckedState
      isDisabled?: boolean
      isInvalid?: boolean
      dir?: string
    }>
  >,
): LiveExampleDefinition => ({
  render: <Message>(
    example: ExampleDocsArtifact,
    context: LiveExampleContext<Message>,
  ) => {
    const h = html<Message>()

    return h.div(
      [
        h.Class('flex w-full flex-col gap-4'),
        ...(controls[0]?.dir === 'rtl' ? [h.Dir('rtl')] : []),
      ],
      controls.map(control =>
        h.label(
          [h.Class('flex items-center gap-2 text-sm font-medium')],
          [
            CheckboxView<Message>({
              id: control.id,
              checkedState: context.checkboxCheckedStateFor(
                example,
                control.id,
                control.defaultCheckedState ?? 'unchecked',
              ),
              ...(control.isDisabled === undefined
                ? {}
                : { isDisabled: control.isDisabled }),
              ...(control.isInvalid === undefined
                ? {}
                : { isInvalid: control.isInvalid }),
              ...(control.dir === undefined ? {} : { dir: control.dir }),
              onCheckedChange: change =>
                context.onCheckboxCheckedChange(example, control.id, change),
            }),
            control.label,
          ],
        ),
      ),
    )
  },
})

const switchPreview = (
  controls: ReadonlyArray<
    Readonly<{
      id: string
      label: string
      defaultIsChecked?: boolean
      isDisabled?: boolean
      isInvalid?: boolean
      dir?: string
      size?: 'sm' | 'default'
    }>
  >,
): LiveExampleDefinition => ({
  render: <Message>(
    example: ExampleDocsArtifact,
    context: LiveExampleContext<Message>,
  ) => {
    const h = html<Message>()

    return h.div(
      [
        h.Class('flex w-full flex-col gap-4'),
        ...(controls[0]?.dir === 'rtl' ? [h.Dir('rtl')] : []),
      ],
      controls.map(control =>
        h.label(
          [
            h.Class(
              'flex items-center justify-between gap-4 text-sm font-medium',
            ),
          ],
          [
            control.label,
            SwitchView<Message>({
              id: control.id,
              isChecked: context.switchIsCheckedFor(
                example,
                control.id,
                control.defaultIsChecked ?? false,
              ),
              ...(control.isDisabled === undefined
                ? {}
                : { isDisabled: control.isDisabled }),
              ...(control.isInvalid === undefined
                ? {}
                : { isInvalid: control.isInvalid }),
              ...(control.dir === undefined ? {} : { dir: control.dir }),
              ...(control.size === undefined ? {} : { size: control.size }),
              onCheckedChange: change =>
                context.onSwitchCheckedChange(example, control.id, change),
            }),
          ],
        ),
      ),
    )
  },
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

const shadcnToastExample = (
  view: ShadcnToastExampleView,
): LiveExampleDefinition => ({
  render: (example, context) =>
    view({
      state: context.toastStateFor(example),
      onToastMessage: message => context.onToastMessage(example, message),
    }),
})

const sonnerExample = (view: SonnerExampleView): LiveExampleDefinition => ({
  render: <Message>(
    example: ExampleDocsArtifact,
    context: LiveExampleContext<Message>,
  ) => {
    const h = html<never>()
    const controller: SonnerExampleController<Message> = {
      state: context.toastStateFor(example),
      onToastMessage: message => context.onToastMessage(example, message),
    }

    return h.div(
      [
        h.Class(
          'relative flex min-h-44 w-full flex-col items-center justify-center self-stretch overflow-hidden',
        ),
      ],
      [
        view(controller),
        h.div(
          [h.Class('pointer-events-none absolute inset-0')],
          [renderSonnerDemoToaster(controller)],
        ),
      ],
    )
  },
})

const overlayController = <Message>(
  example: ExampleDocsArtifact,
  context: LiveExampleContext<Message>,
) => ({
  openFor: (overlayId: string, _defaultOpen: boolean): boolean =>
    context.overlayIsOpenFor(example, overlayId, false),
  onOpenChange: (
    overlayId: string,
    change: Readonly<{ open: boolean }>,
  ): Message => context.onOverlayOpenChange(example, overlayId, change),
})

const dropdownMenuExample = (
  view: DropdownMenuExampleView,
): LiveExampleDefinition => ({
  render: (example, context) =>
    view({
      isOpenFor: (menuId, defaultOpen) =>
        context.menuIsOpenFor(example, menuId, defaultOpen),
      openSubmenuValuesFor: (menuId, defaultValues) =>
        context.menuOpenSubmenuValuesFor(example, menuId, defaultValues),
      onOpenChange: (menuId, change) =>
        context.onMenuOpenChange(example, menuId, change),
    }),
})

const contextMenuExample = (
  view: ContextMenuExampleView,
): LiveExampleDefinition => ({
  render: (example, context) =>
    view({
      contextPointFor: menuId => context.menuContextPointFor(example, menuId),
      isOpenFor: (menuId, defaultOpen) =>
        context.menuIsOpenFor(example, menuId, defaultOpen),
      openSubmenuValuesFor: (menuId, defaultValues) =>
        context.menuOpenSubmenuValuesFor(example, menuId, defaultValues),
      onContextPointChange: (menuId, point) =>
        context.onMenuContextPointChange(example, menuId, point),
      onOpenChange: (menuId, change) =>
        context.onMenuOpenChange(example, menuId, change),
    }),
})

const menubarExample = (view: MenubarExampleView): LiveExampleDefinition => ({
  render: (example, context) =>
    view({
      openMenuValueFor: (menubarId, defaultValue) =>
        context.menuValueFor(example, menubarId, defaultValue),
      openSubmenuValuesFor: (menubarId, menuValue, defaultValues) =>
        context.menuOpenSubmenuValuesFor(
          example,
          `${menubarId}:${menuValue}`,
          defaultValues,
        ),
      onMenuOpenChange: (menubarId, change) =>
        context.onMenuOpenChange(
          example,
          `${menubarId}:${change.menuValue}`,
          change,
        ),
      onOpenMenuValueChange: (menubarId, change) =>
        context.onMenuValueChange(example, menubarId, change),
    }),
})

const navigationMenuExample = (
  view: NavigationMenuExampleView,
): LiveExampleDefinition => ({
  render: (example, context) =>
    view({
      valueFor: (menuId, defaultValue) =>
        context.menuValueFor(example, menuId, defaultValue),
      onValueChange: (menuId, change) =>
        context.onMenuValueChange(example, menuId, change),
    }),
})

const alertDialogExample = (
  view: AlertDialogExampleView,
): LiveExampleDefinition => ({
  render: (example, context) => view(overlayController(example, context)),
})

const dialogExample = (view: DialogExampleView): LiveExampleDefinition => ({
  render: (example, context) => view(overlayController(example, context)),
})

const drawerExample = (view: DrawerExampleView): LiveExampleDefinition => ({
  render: (example, context) => view(overlayController(example, context)),
})

const hoverCardExample = (
  view: HoverCardExampleView,
): LiveExampleDefinition => ({
  render: (example, context) => view(overlayController(example, context)),
})

const popoverExample = (view: PopoverExampleView): LiveExampleDefinition => ({
  render: (example, context) => view(overlayController(example, context)),
})

const sheetExample = (view: SheetExampleView): LiveExampleDefinition => ({
  render: (example, context) => view(overlayController(example, context)),
})

const tooltipExample = (view: TooltipExampleView): LiveExampleDefinition => ({
  render: (example, context) => view(overlayController(example, context)),
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

const accordionExample = (
  view: AccordionExampleView,
): LiveExampleDefinition => ({
  render: (example, context) =>
    view({
      valueFor: (accordionId, defaultValues) =>
        context.accordionValuesFor(example, accordionId, defaultValues),
      onValueChange: (accordionId, change) =>
        context.onAccordionValueChange(example, accordionId, change),
    }),
})

const collapsibleExample = (
  view: CollapsibleExampleView,
): LiveExampleDefinition => ({
  render: (example, context) =>
    view({
      openFor: (collapsibleId, defaultOpen) =>
        context.collapsibleIsOpenFor(example, collapsibleId, defaultOpen),
      onOpenChange: (collapsibleId, change) =>
        context.onCollapsibleOpenChange(example, collapsibleId, change),
    }),
})

const tabsExample = (view: TabsExampleView): LiveExampleDefinition => ({
  render: (example, context) =>
    view({
      valueFor: (tabsId, defaultValue) =>
        context.tabsValueFor(example, tabsId, defaultValue),
      onValueChange: (tabsId, change) =>
        context.onTabsValueChange(example, tabsId, change),
    }),
})

const toggleExample = (view: ToggleExampleView): LiveExampleDefinition => ({
  render: (example, context) =>
    view({
      isPressedFor: (controlId, defaultIsPressed) =>
        context.toggleIsPressedFor(example, controlId, defaultIsPressed),
      onPressedChange: (controlId, change) =>
        context.onTogglePressedChange(example, controlId, change),
    }),
})

const toggleGroupExample = (
  view: ToggleGroupExampleView,
): LiveExampleDefinition => ({
  render: (example, context) =>
    view({
      valueFor: (groupId, defaultValues) =>
        context.toggleGroupValuesFor(example, groupId, defaultValues),
      onValueChange: (groupId, change) =>
        context.onToggleGroupValueChange(example, groupId, change),
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
  [liveExampleKey('shadcn/accordion', 'AccordionBasic')]:
    accordionExample(AccordionBasic),
  [liveExampleKey('shadcn/accordion', 'AccordionCard')]:
    accordionExample(AccordionCard),
  [liveExampleKey('shadcn/accordion', 'AccordionDisabled')]:
    accordionExample(AccordionDisabled),
  [liveExampleKey('shadcn/accordion', 'AccordionMultiple')]:
    accordionExample(AccordionMultiple),
  [liveExampleKey('shadcn/accordion', 'AccordionRtl')]:
    accordionExample(AccordionRtl),
  [liveExampleKey('shadcn/alert', 'AlertActionExample')]:
    staticExample(AlertActionExample),
  [liveExampleKey('shadcn/alert', 'AlertBasic')]: staticExample(AlertBasic),
  [liveExampleKey('shadcn/alert', 'AlertColors')]: staticExample(AlertColors),
  [liveExampleKey('shadcn/alert', 'AlertDemo')]: staticExample(AlertDemo),
  [liveExampleKey('shadcn/alert', 'AlertDestructive')]:
    staticExample(AlertDestructive),
  [liveExampleKey('shadcn/alert', 'AlertRtl')]: staticExample(AlertRtl),
  [liveExampleKey('shadcn/alert-dialog', 'AlertDialogBasic')]:
    alertDialogExample(AlertDialogBasic),
  [liveExampleKey('shadcn/alert-dialog', 'AlertDialogDemo')]:
    alertDialogExample(AlertDialogDemo),
  [liveExampleKey('shadcn/alert-dialog', 'AlertDialogDestructive')]:
    alertDialogExample(AlertDialogDestructive),
  [liveExampleKey('shadcn/alert-dialog', 'AlertDialogWithMedia')]:
    alertDialogExample(AlertDialogWithMedia),
  [liveExampleKey('shadcn/alert-dialog', 'AlertDialogRtl')]:
    alertDialogExample(AlertDialogRtl),
  [liveExampleKey('shadcn/alert-dialog', 'AlertDialogSmall')]:
    alertDialogExample(AlertDialogSmall),
  [liveExampleKey('shadcn/alert-dialog', 'AlertDialogSmallWithMedia')]:
    alertDialogExample(AlertDialogSmallWithMedia),
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
  [liveExampleKey('shadcn/attachment', 'AttachmentTriggerDemo')]: staticExample(
    AttachmentTriggerDemo,
  ),
  [liveExampleKey('shadcn/badge', 'BadgeColors')]: staticExample(BadgeColors),
  [liveExampleKey('shadcn/badge', 'BadgeDemo')]: staticExample(BadgeDemo),
  [liveExampleKey('shadcn/badge', 'BadgeIcon')]: staticExample(BadgeIcon),
  [liveExampleKey('shadcn/badge', 'BadgeLink')]: staticExample(BadgeLink),
  [liveExampleKey('shadcn/badge', 'BadgeRtl')]: staticExample(BadgeRtl),
  [liveExampleKey('shadcn/badge', 'BadgeSpinner')]: staticExample(BadgeSpinner),
  [liveExampleKey('shadcn/badge', 'BadgeVariants')]:
    staticExample(BadgeVariants),
  [liveExampleKey('shadcn/breadcrumb', 'BreadcrumbBasic')]:
    staticExample(BreadcrumbBasic),
  [liveExampleKey('shadcn/breadcrumb', 'BreadcrumbDemo')]:
    staticExample(BreadcrumbDemo),
  [liveExampleKey('shadcn/breadcrumb', 'BreadcrumbDropdown')]:
    staticExample(BreadcrumbDropdown),
  [liveExampleKey('shadcn/breadcrumb', 'BreadcrumbEllipsisDemo')]:
    staticExample(BreadcrumbEllipsisDemo),
  [liveExampleKey('shadcn/breadcrumb', 'BreadcrumbLinkDemo')]:
    staticExample(BreadcrumbLinkDemo),
  [liveExampleKey('shadcn/breadcrumb', 'BreadcrumbRtl')]:
    staticExample(BreadcrumbRtl),
  [liveExampleKey('shadcn/breadcrumb', 'BreadcrumbSeparatorDemo')]:
    staticExample(BreadcrumbSeparatorDemo),
  [liveExampleKey('shadcn/card', 'CardDemo')]: staticExample(CardDemo),
  [liveExampleKey('shadcn/card', 'CardEdgeToEdge')]:
    staticExample(CardEdgeToEdge),
  [liveExampleKey('shadcn/card', 'CardImage')]: staticExample(CardImage),
  [liveExampleKey('shadcn/card', 'CardRtl')]: staticExample(CardRtl),
  [liveExampleKey('shadcn/card', 'CardSmall')]: staticExample(CardSmall),
  [liveExampleKey('shadcn/card', 'CardSpacing')]: staticExample(CardSpacing),
  [liveExampleKey('shadcn/aspect-ratio', 'AspectRatioDemo')]:
    staticExample(AspectRatioDemo),
  [liveExampleKey('shadcn/aspect-ratio', 'AspectRatioPortrait')]:
    staticExample(AspectRatioPortrait),
  [liveExampleKey('shadcn/aspect-ratio', 'AspectRatioRtl')]:
    staticExample(AspectRatioRtl),
  [liveExampleKey('shadcn/aspect-ratio', 'AspectRatioSquare')]:
    staticExample(AspectRatioSquare),
  [liveExampleKey('shadcn/avatar', 'AvatarBadgeIconExample')]: staticExample(
    AvatarBadgeIconExample,
  ),
  [liveExampleKey('shadcn/avatar', 'AvatarWithBadge')]:
    staticExample(AvatarWithBadge),
  [liveExampleKey('shadcn/avatar', 'AvatarBasic')]: staticExample(AvatarBasic),
  [liveExampleKey('shadcn/avatar', 'AvatarDemo')]: staticExample(AvatarDemo),
  [liveExampleKey('shadcn/avatar', 'AvatarDropdown')]:
    staticExample(AvatarDropdown),
  [liveExampleKey('shadcn/avatar', 'AvatarGroupCountIconExample')]:
    staticExample(AvatarGroupCountIconExample),
  [liveExampleKey('shadcn/avatar', 'AvatarGroupCountExample')]: staticExample(
    AvatarGroupCountExample,
  ),
  [liveExampleKey('shadcn/avatar', 'AvatarGroupExample')]:
    staticExample(AvatarGroupExample),
  [liveExampleKey('shadcn/avatar', 'AvatarRtl')]: staticExample(AvatarRtl),
  [liveExampleKey('shadcn/avatar', 'AvatarSizeExample')]:
    staticExample(AvatarSizeExample),
  [liveExampleKey('shadcn/direction', 'DirectionDemo')]:
    staticExample(DirectionDemo),
  [liveExampleKey('shadcn/direction', 'DirectionRtlCard')]:
    staticExample(DirectionRtlCard),
  [liveExampleKey('shadcn/dialog', 'DialogCloseButton')]:
    dialogExample(DialogCloseButton),
  [liveExampleKey('shadcn/dialog', 'DialogDemo')]: dialogExample(DialogDemo),
  [liveExampleKey('shadcn/dialog', 'DialogNoCloseButton')]:
    dialogExample(DialogNoCloseButton),
  [liveExampleKey('shadcn/dialog', 'DialogRtl')]: dialogExample(DialogRtl),
  [liveExampleKey('shadcn/dialog', 'DialogScrollableContent')]: dialogExample(
    DialogScrollableContent,
  ),
  [liveExampleKey('shadcn/dialog', 'DialogStickyFooter')]:
    dialogExample(DialogStickyFooter),
  [liveExampleKey('shadcn/drawer', 'DrawerDemo')]: drawerExample(DrawerDemo),
  [liveExampleKey('shadcn/drawer', 'DrawerRtl')]: drawerExample(DrawerRtl),
  [liveExampleKey('shadcn/drawer', 'DrawerScrollableContent')]: drawerExample(
    DrawerScrollableContent,
  ),
  [liveExampleKey('shadcn/drawer', 'DrawerWithSides')]:
    drawerExample(DrawerWithSides),
  [liveExampleKey('shadcn/dropdown-menu', 'DropdownMenuAvatar')]:
    dropdownMenuExample(DropdownMenuAvatar),
  [liveExampleKey('shadcn/dropdown-menu', 'DropdownMenuBasic')]:
    dropdownMenuExample(DropdownMenuBasic),
  [liveExampleKey('shadcn/dropdown-menu', 'DropdownMenuCheckboxes')]:
    dropdownMenuExample(DropdownMenuCheckboxes),
  [liveExampleKey('shadcn/dropdown-menu', 'DropdownMenuCheckboxesIcons')]:
    dropdownMenuExample(DropdownMenuCheckboxesIcons),
  [liveExampleKey('shadcn/dropdown-menu', 'DropdownMenuComplex')]:
    dropdownMenuExample(DropdownMenuComplex),
  [liveExampleKey('shadcn/dropdown-menu', 'DropdownMenuDemo')]:
    dropdownMenuExample(DropdownMenuDemo),
  [liveExampleKey('shadcn/dropdown-menu', 'DropdownMenuDestructive')]:
    dropdownMenuExample(DropdownMenuDestructive),
  [liveExampleKey('shadcn/dropdown-menu', 'DropdownMenuIcons')]:
    dropdownMenuExample(DropdownMenuIcons),
  [liveExampleKey('shadcn/dropdown-menu', 'DropdownMenuRadioGroup')]:
    dropdownMenuExample(DropdownMenuRadioGroup),
  [liveExampleKey('shadcn/dropdown-menu', 'DropdownMenuRadioIcons')]:
    dropdownMenuExample(DropdownMenuRadioIcons),
  [liveExampleKey('shadcn/dropdown-menu', 'DropdownMenuRtl')]:
    dropdownMenuExample(DropdownMenuRtl),
  [liveExampleKey('shadcn/dropdown-menu', 'DropdownMenuShortcuts')]:
    dropdownMenuExample(DropdownMenuShortcuts),
  [liveExampleKey('shadcn/dropdown-menu', 'DropdownMenuSubmenu')]:
    dropdownMenuExample(DropdownMenuSubmenu),
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
  [liveExampleKey('shadcn/menubar', 'MenubarCheckbox')]:
    menubarExample(MenubarCheckbox),
  [liveExampleKey('shadcn/menubar', 'MenubarDemo')]:
    menubarExample(MenubarDemo),
  [liveExampleKey('shadcn/menubar', 'MenubarIcons')]:
    menubarExample(MenubarIcons),
  [liveExampleKey('shadcn/menubar', 'MenubarRadio')]:
    menubarExample(MenubarRadio),
  [liveExampleKey('shadcn/menubar', 'MenubarRtl')]: menubarExample(MenubarRtl),
  [liveExampleKey('shadcn/menubar', 'MenubarSubmenu')]:
    menubarExample(MenubarSubmenu),
  [liveExampleKey('shadcn/navigation-menu', 'NavigationMenuDemo')]:
    navigationMenuExample(NavigationMenuDemo),
  [liveExampleKey('shadcn/navigation-menu', 'NavigationMenuRtl')]:
    navigationMenuExample(NavigationMenuRtl),
  [liveExampleKey('shadcn/sonner', 'SonnerDemo')]:
    sonnerExample(ShadcnSonnerDemo),
  [liveExampleKey('shadcn/sonner', 'SonnerDescription')]: sonnerExample(
    ShadcnSonnerDescription,
  ),
  [liveExampleKey('shadcn/sonner', 'SonnerPosition')]:
    sonnerExample(ShadcnSonnerPosition),
  [liveExampleKey('shadcn/sonner', 'SonnerTypes')]:
    sonnerExample(ShadcnSonnerTypes),
  [liveExampleKey('shadcn/toast', 'ToastDemo')]:
    shadcnToastExample(ShadcnToastDemo),
  [liveExampleKey('shadcn/toast', 'ToastSimple')]:
    shadcnToastExample(ShadcnToastSimple),
  [liveExampleKey('shadcn/toast', 'ToastWithTitle')]:
    shadcnToastExample(ShadcnToastWithTitle),
  [liveExampleKey('shadcn/toast', 'ToastWithAction')]: shadcnToastExample(
    ShadcnToastWithAction,
  ),
  [liveExampleKey('shadcn/toast', 'ToastDestructive')]: shadcnToastExample(
    ShadcnToastDestructive,
  ),
  [liveExampleKey('shadcn/toast', 'ToastStacked')]:
    shadcnToastExample(ShadcnToastStacked),
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
  [liveExampleKey('shadcn/context-menu', 'ContextMenuBasic')]:
    contextMenuExample(ContextMenuBasic),
  [liveExampleKey('shadcn/context-menu', 'ContextMenuCheckboxes')]:
    contextMenuExample(ContextMenuCheckboxes),
  [liveExampleKey('shadcn/context-menu', 'ContextMenuDemo')]:
    contextMenuExample(ContextMenuDemo),
  [liveExampleKey('shadcn/context-menu', 'ContextMenuDestructive')]:
    contextMenuExample(ContextMenuDestructive),
  [liveExampleKey('shadcn/context-menu', 'ContextMenuGroups')]:
    contextMenuExample(ContextMenuGroups),
  [liveExampleKey('shadcn/context-menu', 'ContextMenuIcons')]:
    contextMenuExample(ContextMenuIcons),
  [liveExampleKey('shadcn/context-menu', 'ContextMenuRadio')]:
    contextMenuExample(ContextMenuRadio),
  [liveExampleKey('shadcn/context-menu', 'ContextMenuRtl')]:
    contextMenuExample(ContextMenuRtl),
  [liveExampleKey('shadcn/context-menu', 'ContextMenuShortcuts')]:
    contextMenuExample(ContextMenuShortcuts),
  [liveExampleKey('shadcn/context-menu', 'ContextMenuSides')]:
    contextMenuExample(ContextMenuSides),
  [liveExampleKey('shadcn/context-menu', 'ContextMenuSubmenu')]:
    contextMenuExample(ContextMenuSubmenu),
  [liveExampleKey('shadcn/collapsible', 'CollapsibleBasic')]:
    collapsibleExample(CollapsibleBasic),
  [liveExampleKey('shadcn/collapsible', 'CollapsibleDemo')]:
    collapsibleExample(CollapsibleDemo),
  [liveExampleKey('shadcn/collapsible', 'CollapsibleFileTree')]:
    collapsibleExample(CollapsibleFileTree),
  [liveExampleKey('shadcn/collapsible', 'CollapsibleRtl')]:
    collapsibleExample(CollapsibleRtl),
  [liveExampleKey('shadcn/collapsible', 'CollapsibleSettings')]:
    collapsibleExample(CollapsibleSettings),
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
  [liveExampleKey('shadcn/kbd', 'KbdButton')]: compactExample(KbdButton),
  [liveExampleKey('shadcn/kbd', 'KbdDemo')]: compactExample(KbdDemo),
  [liveExampleKey('shadcn/kbd', 'KbdGroupExample')]:
    compactExample(KbdGroupExample),
  [liveExampleKey('shadcn/kbd', 'KbdInputGroup')]:
    compactExample(KbdInputGroup),
  [liveExampleKey('shadcn/kbd', 'KbdRtl')]: compactExample(KbdRtl),
  [liveExampleKey('shadcn/kbd', 'KbdTooltip')]: compactExample(KbdTooltip),
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
  [liveExampleKey('shadcn/input', 'InputBasic')]: staticExample(InputBasic),
  [liveExampleKey('shadcn/input', 'InputDemo')]: staticExample(InputDemo),
  [liveExampleKey('shadcn/input', 'InputDisabled')]:
    staticExample(InputDisabled),
  [liveExampleKey('shadcn/input', 'InputFile')]: staticExample(InputFile),
  [liveExampleKey('shadcn/input', 'InputInvalid')]: staticExample(InputInvalid),
  [liveExampleKey('shadcn/input', 'InputRequired')]:
    staticExample(InputRequired),
  [liveExampleKey('shadcn/textarea', 'TextareaButton')]:
    staticExample(TextareaButton),
  [liveExampleKey('shadcn/textarea', 'TextareaDemo')]:
    staticExample(TextareaDemo),
  [liveExampleKey('shadcn/textarea', 'TextareaDisabled')]:
    staticExample(TextareaDisabled),
  [liveExampleKey('shadcn/textarea', 'TextareaField')]:
    staticExample(TextareaField),
  [liveExampleKey('shadcn/textarea', 'TextareaInvalid')]:
    staticExample(TextareaInvalid),
  [liveExampleKey('shadcn/textarea', 'TextareaRtl')]:
    staticExample(TextareaRtl),
  [liveExampleKey('shadcn/tooltip', 'TooltipDemo')]:
    tooltipExample(TooltipDemo),
  [liveExampleKey('shadcn/tooltip', 'TooltipDisabled')]:
    tooltipExample(TooltipDisabled),
  [liveExampleKey('shadcn/tooltip', 'TooltipKeyboard')]:
    tooltipExample(TooltipKeyboard),
  [liveExampleKey('shadcn/tooltip', 'TooltipRtl')]: tooltipExample(TooltipRtl),
  [liveExampleKey('shadcn/tooltip', 'TooltipSides')]:
    tooltipExample(TooltipSides),
  [liveExampleKey('shadcn/checkbox', 'CheckboxBasic')]: checkboxPreview([
    { id: 'terms-checkbox-basic', label: 'Accept terms and conditions' },
  ]),
  [liveExampleKey('shadcn/checkbox', 'CheckboxDemo')]: checkboxPreview([
    { id: 'terms-checkbox', label: 'Accept terms and conditions' },
    {
      id: 'terms-checkbox-2',
      label: 'Accept terms and conditions',
      defaultCheckedState: 'checked',
    },
    {
      id: 'toggle-checkbox',
      label: 'Enable notifications',
      isDisabled: true,
    },
    { id: 'toggle-checkbox-2', label: 'Enable notifications' },
  ]),
  [liveExampleKey('shadcn/checkbox', 'CheckboxDescription')]: checkboxPreview([
    {
      id: 'terms-checkbox-desc',
      label: 'Accept terms and conditions',
      defaultCheckedState: 'checked',
    },
  ]),
  [liveExampleKey('shadcn/checkbox', 'CheckboxDisabled')]: checkboxPreview([
    {
      id: 'toggle-checkbox-disabled',
      label: 'Enable notifications',
      isDisabled: true,
    },
  ]),
  [liveExampleKey('shadcn/checkbox', 'CheckboxGroup')]: checkboxPreview([
    {
      id: 'finder-pref-hard-disks',
      label: 'Hard disks',
      defaultCheckedState: 'checked',
    },
    {
      id: 'finder-pref-external-disks',
      label: 'External disks',
      defaultCheckedState: 'checked',
    },
    { id: 'finder-pref-cds-dvds', label: 'CDs, DVDs, and iPods' },
    { id: 'finder-pref-connected-servers', label: 'Connected servers' },
  ]),
  [liveExampleKey('shadcn/checkbox', 'CheckboxInvalid')]: checkboxPreview([
    {
      id: 'terms-checkbox-invalid',
      label: 'Accept terms and conditions',
      isInvalid: true,
    },
  ]),
  [liveExampleKey('shadcn/checkbox', 'CheckboxRtl')]: checkboxPreview([
    { id: 'terms-checkbox-rtl', label: 'قبول الشروط والأحكام', dir: 'rtl' },
    {
      id: 'terms-checkbox-2-rtl',
      label: 'قبول الشروط والأحكام',
      defaultCheckedState: 'checked',
      dir: 'rtl',
    },
  ]),
  [liveExampleKey('shadcn/checkbox', 'CheckboxInTable')]: checkboxPreview([
    {
      id: 'select-all-checkbox',
      label: 'Select all rows',
      defaultCheckedState: 'indeterminate',
    },
    {
      id: 'row-1-checkbox',
      label: 'Sarah Chen',
      defaultCheckedState: 'checked',
    },
    { id: 'row-2-checkbox', label: 'Marcus Rodriguez' },
    { id: 'row-3-checkbox', label: 'Priya Patel' },
    { id: 'row-4-checkbox', label: 'David Kim' },
  ]),
  [liveExampleKey('shadcn/switch', 'SwitchChoiceCard')]: switchPreview([
    { id: 'switch-share', label: 'Share across devices' },
    {
      id: 'switch-notifications',
      label: 'Enable notifications',
      defaultIsChecked: true,
    },
  ]),
  [liveExampleKey('shadcn/switch', 'SwitchDemo')]: switchPreview([
    { id: 'airplane-mode', label: 'Airplane Mode' },
  ]),
  [liveExampleKey('shadcn/switch', 'SwitchDescription')]: switchPreview([
    { id: 'switch-focus-mode', label: 'Share across devices' },
  ]),
  [liveExampleKey('shadcn/switch', 'SwitchDisabled')]: switchPreview([
    { id: 'switch-disabled-unchecked', label: 'Disabled', isDisabled: true },
  ]),
  [liveExampleKey('shadcn/switch', 'SwitchInvalid')]: switchPreview([
    {
      id: 'switch-terms',
      label: 'Accept terms and conditions',
      isInvalid: true,
    },
  ]),
  [liveExampleKey('shadcn/switch', 'SwitchRtl')]: switchPreview([
    { id: 'switch-focus-mode-rtl', label: 'المشاركة عبر الأجهزة', dir: 'rtl' },
  ]),
  [liveExampleKey('shadcn/switch', 'SwitchSizes')]: switchPreview([
    { id: 'switch-size-sm', label: 'Small', size: 'sm' },
    { id: 'switch-size-default', label: 'Default', size: 'default' },
  ]),
  [liveExampleKey('shadcn/native-select', 'NativeSelectDemo')]:
    staticExample(NativeSelectDemo),
  [liveExampleKey('shadcn/native-select', 'NativeSelectDisabled')]:
    staticExample(NativeSelectDisabled),
  [liveExampleKey('shadcn/native-select', 'NativeSelectGroups')]:
    staticExample(NativeSelectGroups),
  [liveExampleKey('shadcn/native-select', 'NativeSelectInvalid')]:
    staticExample(NativeSelectInvalid),
  [liveExampleKey('shadcn/native-select', 'NativeSelectRtl')]:
    staticExample(NativeSelectRtl),
  [liveExampleKey('shadcn/input-otp', 'InputOTPAlphanumeric')]: otpExample({
    id: 'input-otp-alphanumeric-live',
    validationType: 'alphanumeric',
    split: true,
  }),
  [liveExampleKey('shadcn/input-otp', 'InputOTPControlled')]: otpExample({
    id: 'input-otp-controlled-live',
  }),
  [liveExampleKey('shadcn/input-otp', 'InputOTPDemo')]: otpExample({
    id: 'input-otp-demo-live',
    defaultValue: '123456',
  }),
  [liveExampleKey('shadcn/input-otp', 'InputOTPDisabled')]: otpExample({
    id: 'input-otp-disabled-live',
    defaultValue: '123456',
    isDisabled: true,
    split: true,
  }),
  [liveExampleKey('shadcn/input-otp', 'InputOTPForm')]: otpExample({
    id: 'input-otp-form-live',
    split: true,
  }),
  [liveExampleKey('shadcn/input-otp', 'InputOTPFourDigits')]: otpExample({
    id: 'input-otp-four-digits-live',
    length: 4,
    validationType: 'numeric',
  }),
  [liveExampleKey('shadcn/input-otp', 'InputOTPInvalid')]: otpExample({
    id: 'input-otp-invalid-live',
    defaultValue: '000000',
    isInvalid: true,
    split: true,
  }),
  [liveExampleKey('shadcn/input-otp', 'InputOTPPattern')]: otpExample({
    id: 'input-otp-pattern-live',
    validationType: 'numeric',
  }),
  [liveExampleKey('shadcn/input-otp', 'InputOTPRtl')]: otpExample({
    id: 'input-otp-rtl-live',
    defaultValue: '123456',
    dir: 'rtl',
  }),
  [liveExampleKey('shadcn/input-otp', 'InputOTPSeparatorExample')]: otpExample({
    id: 'input-otp-separator-live',
    split: true,
  }),
  [liveExampleKey('shadcn/field', 'FieldCheckbox')]:
    staticExample(FieldCheckbox),
  [liveExampleKey('shadcn/field', 'FieldInput')]: staticExample(FieldInput),
  [liveExampleKey('shadcn/field', 'FieldResponsive')]:
    staticExample(FieldResponsive),
  [liveExampleKey('shadcn/field', 'FieldRtl')]: staticExample(FieldRtl),
  [liveExampleKey('shadcn/field', 'FieldTextarea')]:
    staticExample(FieldTextarea),
  [liveExampleKey('shadcn/hover-card', 'HoverCardDemo')]:
    hoverCardExample(HoverCardDemo),
  [liveExampleKey('shadcn/hover-card', 'HoverCardRtl')]:
    hoverCardExample(HoverCardRtl),
  [liveExampleKey('shadcn/hover-card', 'HoverCardSides')]:
    hoverCardExample(HoverCardSides),
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
  [liveExampleKey('shadcn/label', 'LabelDemo')]: staticExample(LabelDemo),
  [liveExampleKey('shadcn/label', 'LabelRtl')]: staticExample(LabelRtl),
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
  [liveExampleKey('shadcn/tabs', 'TabsDemo')]: tabsExample(TabsDemo),
  [liveExampleKey('shadcn/tabs', 'TabsDisabled')]: tabsExample(TabsDisabled),
  [liveExampleKey('shadcn/tabs', 'TabsIcons')]: tabsExample(TabsIcons),
  [liveExampleKey('shadcn/tabs', 'TabsLine')]: tabsExample(TabsLine),
  [liveExampleKey('shadcn/tabs', 'TabsRtl')]: tabsExample(TabsRtl),
  [liveExampleKey('shadcn/tabs', 'TabsVertical')]: tabsExample(TabsVertical),
  [liveExampleKey('shadcn/toggle', 'ToggleDemo')]: toggleExample(ToggleDemo),
  [liveExampleKey('shadcn/toggle', 'ToggleDisabled')]:
    toggleExample(ToggleDisabled),
  [liveExampleKey('shadcn/toggle', 'ToggleOutline')]:
    toggleExample(ToggleOutline),
  [liveExampleKey('shadcn/toggle', 'ToggleRtl')]: toggleExample(ToggleRtl),
  [liveExampleKey('shadcn/toggle', 'ToggleSizes')]: toggleExample(ToggleSizes),
  [liveExampleKey('shadcn/toggle', 'ToggleText')]: toggleExample(ToggleText),
  [liveExampleKey('shadcn/toggle-group', 'ToggleGroupDemo')]:
    toggleGroupExample(ToggleGroupDemo),
  [liveExampleKey('shadcn/toggle-group', 'ToggleGroupDisabled')]:
    toggleGroupExample(ToggleGroupDisabled),
  [liveExampleKey('shadcn/toggle-group', 'ToggleGroupFontWeightSelector')]:
    toggleGroupExample(ToggleGroupFontWeightSelector),
  [liveExampleKey('shadcn/toggle-group', 'ToggleGroupOutline')]:
    toggleGroupExample(ToggleGroupOutline),
  [liveExampleKey('shadcn/toggle-group', 'ToggleGroupRtl')]:
    toggleGroupExample(ToggleGroupRtl),
  [liveExampleKey('shadcn/toggle-group', 'ToggleGroupSizes')]:
    toggleGroupExample(ToggleGroupSizes),
  [liveExampleKey('shadcn/toggle-group', 'ToggleGroupSpacing')]:
    toggleGroupExample(ToggleGroupSpacing),
  [liveExampleKey('shadcn/toggle-group', 'ToggleGroupVertical')]:
    toggleGroupExample(ToggleGroupVertical),
  [liveExampleKey('shadcn/pagination', 'PaginationDemo')]:
    staticExample(PaginationDemo),
  [liveExampleKey('shadcn/pagination', 'PaginationIconsOnly')]:
    staticExample(PaginationIconsOnly),
  [liveExampleKey('shadcn/pagination', 'PaginationRtl')]:
    staticExample(PaginationRtl),
  [liveExampleKey('shadcn/pagination', 'PaginationSimple')]:
    staticExample(PaginationSimple),
  [liveExampleKey('shadcn/popover', 'PopoverAlignments')]:
    popoverExample(PopoverAlignments),
  [liveExampleKey('shadcn/popover', 'PopoverBasic')]:
    popoverExample(PopoverBasic),
  [liveExampleKey('shadcn/popover', 'PopoverDemo')]:
    popoverExample(PopoverDemo),
  [liveExampleKey('shadcn/popover', 'PopoverForm')]:
    popoverExample(PopoverForm),
  [liveExampleKey('shadcn/popover', 'PopoverRtl')]: popoverExample(PopoverRtl),
  [liveExampleKey('shadcn/progress', 'ProgressControlled')]:
    staticExample(ProgressControlled),
  [liveExampleKey('shadcn/progress', 'ProgressDemo')]:
    staticExample(ProgressDemo),
  [liveExampleKey('shadcn/progress', 'ProgressWithLabel')]:
    staticExample(ProgressWithLabel),
  [liveExampleKey('shadcn/progress', 'ProgressRtl')]:
    staticExample(ProgressRtl),
  [liveExampleKey('shadcn/separator', 'SeparatorDemo')]:
    staticExample(SeparatorDemo),
  [liveExampleKey('shadcn/separator', 'SeparatorList')]:
    staticExample(SeparatorList),
  [liveExampleKey('shadcn/separator', 'SeparatorMenu')]:
    staticExample(SeparatorMenu),
  [liveExampleKey('shadcn/separator', 'SeparatorRtl')]:
    staticExample(SeparatorRtl),
  [liveExampleKey('shadcn/separator', 'SeparatorVertical')]:
    staticExample(SeparatorVertical),
  [liveExampleKey('shadcn/sheet', 'SheetDemo')]: sheetExample(SheetDemo),
  [liveExampleKey('shadcn/sheet', 'SheetNoCloseButton')]:
    sheetExample(SheetNoCloseButton),
  [liveExampleKey('shadcn/sheet', 'SheetRtl')]: sheetExample(SheetRtl),
  [liveExampleKey('shadcn/sheet', 'SheetSide')]: sheetExample(SheetSide),
  [liveExampleKey('shadcn/skeleton', 'SkeletonAvatar')]:
    staticExample(SkeletonAvatar),
  [liveExampleKey('shadcn/skeleton', 'SkeletonCard')]:
    staticExample(SkeletonCard),
  [liveExampleKey('shadcn/skeleton', 'SkeletonDemo')]:
    staticExample(SkeletonDemo),
  [liveExampleKey('shadcn/skeleton', 'SkeletonForm')]:
    staticExample(SkeletonForm),
  [liveExampleKey('shadcn/skeleton', 'SkeletonRtl')]:
    staticExample(SkeletonRtl),
  [liveExampleKey('shadcn/skeleton', 'SkeletonTable')]:
    staticExample(SkeletonTable),
  [liveExampleKey('shadcn/skeleton', 'SkeletonText')]:
    staticExample(SkeletonText),
  [liveExampleKey('shadcn/resizable', 'ResizableDemo')]:
    resizableExample(ResizableDemo),
  [liveExampleKey('shadcn/resizable', 'ResizableHandleDemo')]:
    resizableExample(ResizableHandleDemo),
  [liveExampleKey('shadcn/resizable', 'ResizableVertical')]:
    resizableExample(ResizableVertical),
  [liveExampleKey('shadcn/resizable', 'ResizableRtl')]:
    resizableExample(ResizableRtl),
  [liveExampleKey('shadcn/scroll-area', 'ScrollAreaDemo')]:
    staticExample(ScrollAreaDemo),
  [liveExampleKey('shadcn/scroll-area', 'ScrollAreaHorizontalDemo')]:
    staticExample(ScrollAreaHorizontalDemo),
  [liveExampleKey('shadcn/scroll-area', 'ScrollAreaRtl')]:
    staticExample(ScrollAreaRtl),
  [liveExampleKey('shadcn/select', 'SelectAlignItem')]: groupedSelectExample({
    id: 'select-align-item-live',
    items: selectFruitItems,
    placeholder: 'Select a fruit',
    defaultValue: 'banana',
  }),
  [liveExampleKey('shadcn/select', 'SelectDemo')]: groupedSelectExample({
    id: 'select-demo-live',
    items: selectFruitItems,
    placeholder: 'Select a fruit',
    groups: [{ label: 'Fruits', items: selectFruitItems }],
  }),
  [liveExampleKey('shadcn/select', 'SelectDisabled')]: groupedSelectExample({
    id: 'select-disabled-live',
    items: selectFruitItems.map(item =>
      item.value === 'grapes' ? { ...item, isDisabled: true } : item,
    ),
    placeholder: 'Select a fruit',
    isDisabled: true,
  }),
  [liveExampleKey('shadcn/select', 'SelectGroups')]: groupedSelectExample({
    id: 'select-groups-live',
    items: [...selectFruitItems, ...selectVegetableItems],
    placeholder: 'Select a fruit',
    groups: [
      { label: 'Fruits', items: selectFruitItems },
      { label: 'Vegetables', items: selectVegetableItems },
    ],
  }),
  [liveExampleKey('shadcn/select', 'SelectInvalid')]: groupedSelectExample({
    id: 'select-invalid-live',
    items: selectFruitItems.slice(0, 3),
    placeholder: 'Select a fruit',
    isInvalid: true,
  }),
  [liveExampleKey('shadcn/select', 'SelectRtl')]: groupedSelectExample({
    id: 'select-rtl-live',
    items: [
      { label: 'تفاح', value: 'apple' },
      { label: 'موز', value: 'banana' },
      { label: 'توت أزرق', value: 'blueberry' },
      { label: 'عنب', value: 'grapes' },
    ],
    placeholder: 'اختر فاكهة',
    dir: 'rtl',
  }),
  [liveExampleKey('shadcn/select', 'SelectScrollable')]: groupedSelectExample({
    id: 'select-scrollable-live',
    items: selectTimezoneGroups.flatMap(group => group.items),
    placeholder: 'Select a timezone',
    triggerClassName: 'w-full max-w-64',
    groups: selectTimezoneGroups,
  }),
  [liveExampleKey('shadcn/slider', 'SliderControlled')]: sliderExample({
    id: 'slider-controlled-live',
    defaultValues: [0.3, 0.7],
    min: 0,
    max: 1,
    step: 0.1,
    label: 'Temperature',
  }),
  [liveExampleKey('shadcn/slider', 'SliderDemo')]: sliderExample({
    id: 'slider-demo-live',
    defaultValues: [75],
    max: 100,
    step: 1,
  }),
  [liveExampleKey('shadcn/slider', 'SliderDisabled')]: sliderExample({
    id: 'slider-disabled-live',
    defaultValues: [50],
    max: 100,
    step: 1,
    isDisabled: true,
  }),
  [liveExampleKey('shadcn/slider', 'SliderMultiple')]: sliderExample({
    id: 'slider-multiple-live',
    defaultValues: [10, 20, 70],
    max: 100,
    step: 10,
  }),
  [liveExampleKey('shadcn/slider', 'SliderRange')]: sliderExample({
    id: 'slider-range-live',
    defaultValues: [25, 50],
    max: 100,
    step: 5,
  }),
  [liveExampleKey('shadcn/slider', 'SliderRtl')]: sliderExample({
    id: 'slider-rtl-live',
    defaultValues: [75],
    max: 100,
    step: 1,
    dir: 'rtl',
  }),
  [liveExampleKey('shadcn/slider', 'SliderVertical')]: sliderExample({
    id: 'slider-vertical-live',
    defaultValues: [50],
    max: 100,
    step: 1,
    orientation: 'vertical',
    className: 'h-40',
  }),
  [liveExampleKey('shadcn/combobox', 'ComboboxAutoHighlight')]:
    groupedComboboxExample({
      id: 'combobox-auto-highlight-live',
      items: comboboxFrameworks,
      placeholder: 'Select a framework',
      highlightedValue: 'next',
      autoHighlight: true,
    }),
  [liveExampleKey('shadcn/combobox', 'ComboboxBasic')]: groupedComboboxExample({
    id: 'combobox-basic-live',
    items: comboboxFrameworks,
    placeholder: 'Select a framework',
  }),
  [liveExampleKey('shadcn/combobox', 'ComboboxWithClear')]:
    groupedComboboxExample({
      id: 'combobox-clear-live',
      items: comboboxFrameworks,
      placeholder: 'Select a framework',
      defaultValue: 'next',
      showClear: true,
    }),
  [liveExampleKey('shadcn/combobox', 'ComboboxWithCustomItems')]:
    groupedComboboxExample({
      id: 'combobox-custom-live',
      items: comboboxCountries,
      placeholder: 'Search countries...',
      defaultInputValue: 'a',
      emptyText: 'No countries found.',
    }),
  [liveExampleKey('shadcn/combobox', 'ComboboxDisabled')]:
    groupedComboboxExample({
      id: 'combobox-disabled-live',
      items: comboboxFrameworks.map(item =>
        item.value === 'astro' ? { ...item, isDisabled: true } : item,
      ),
      placeholder: 'Select a framework',
      isDisabled: true,
    }),
  [liveExampleKey('shadcn/combobox', 'ComboboxWithGroupsAndSeparator')]:
    groupedComboboxExample({
      id: 'combobox-groups-live',
      items: comboboxTimezoneGroups.flatMap(group => group.items),
      placeholder: 'Select a timezone',
      emptyText: 'No timezones found.',
      groups: comboboxTimezoneGroups,
    }),
  [liveExampleKey('shadcn/combobox', 'ComboxboxInputGroup')]:
    groupedComboboxExample({
      id: 'combobox-input-group-live',
      items: comboboxTimezoneGroups.flatMap(group => group.items),
      placeholder: 'Select a timezone',
      contentClassName: 'w-60 max-h-64',
      inputGroupClassName: 'w-auto',
      emptyText: 'No timezones found.',
      groups: comboboxTimezoneGroups,
    }),
  [liveExampleKey('shadcn/combobox', 'ComboboxInvalid')]:
    groupedComboboxExample({
      id: 'combobox-invalid-live',
      items: comboboxFrameworks,
      placeholder: 'Select a framework',
      isInvalid: true,
    }),
  [liveExampleKey('shadcn/combobox', 'ComboboxMultiple')]:
    groupedComboboxExample({
      id: 'combobox-multiple-live',
      items: comboboxFrameworks,
      placeholder: 'Add framework',
      selectionMode: 'multiple',
      defaultValues: ['next'],
      highlightedValue: 'sveltekit',
      autoHighlight: true,
      anchorToChips: true,
      chipsClassName: 'w-full max-w-xs',
    }),
  [liveExampleKey('shadcn/combobox', 'ComboboxPopup')]: groupedComboboxExample({
    id: 'combobox-popup-live',
    items: comboboxCountries,
    placeholder: 'Search',
    defaultValue: 'argentina',
    showClear: true,
  }),
  [liveExampleKey('shadcn/combobox', 'ComboboxRtl')]: groupedComboboxExample({
    id: 'combobox-rtl-live',
    items: comboboxCategories,
    placeholder: 'أضف فئات',
    selectionMode: 'multiple',
    defaultValues: ['technology'],
    highlightedValue: 'design',
    anchorToChips: true,
    dir: 'rtl',
    emptyText: 'لم يتم العثور على فئات.',
  }),
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
