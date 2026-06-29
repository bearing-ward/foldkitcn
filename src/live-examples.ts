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
import type { ExampleDocsArtifact } from './registry/schema'
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
}>

type RadioGroupExampleView = <Message = never>(
  controller?: RadioGroupExampleController<Message>,
) => Html

type InputExampleView = <Message = never>(
  controller?: InputExampleController<Message>,
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
