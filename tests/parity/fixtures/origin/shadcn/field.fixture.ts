import type { FixtureCase, FixtureSnapshot } from '../../../fixture'
import { snapshotElement } from '../../dom'

const inputBaseClassName =
  'h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40'
const fieldSetBaseClassName =
  'flex flex-col gap-4 has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3 w-full max-w-xs'
const fieldLegendBaseClassName =
  'mb-1.5 font-medium data-[variant=label]:text-sm data-[variant=legend]:text-base'
const fieldGroupBaseClassName =
  'group/field-group @container/field-group flex w-full flex-col gap-5 data-[slot=checkbox-group]:gap-3 *:data-[slot=field-group]:gap-4'
const fieldBaseClassName =
  'group/field flex w-full gap-2 data-[invalid=true]:text-destructive flex-col *:w-full [&>.sr-only]:w-auto'
const fieldContentBaseClassName =
  'group/field-content flex flex-1 flex-col gap-0.5 leading-snug'
const fieldLabelBaseClassName =
  'items-center text-sm font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50 has-data-checked:border-primary/30 has-data-checked:bg-primary/5 has-[>[data-slot=field]]:rounded-lg has-[>[data-slot=field]]:border *:data-[slot=field]:p-2.5 dark:has-data-checked:border-primary/20 dark:has-data-checked:bg-primary/10 has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col'
const fieldDescriptionBaseClassName =
  'text-left text-sm leading-normal font-normal text-muted-foreground group-has-data-horizontal/field:text-balance [[data-variant=legend]+&]:-mt-1.5 last:mt-0 nth-last-2:-mt-1 [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary'
const fieldSeparatorBaseClassName =
  'relative -my-2 h-5 text-sm group-data-[variant=outline]/field-group:-mb-2'
const separatorBaseClassName =
  'shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch absolute inset-0 top-1/2'
const fieldSeparatorContentBaseClassName =
  'relative mx-auto block w-fit bg-background px-2 text-muted-foreground'
const fieldErrorBaseClassName = 'text-sm font-normal text-destructive'

const setAttrs = (
  element: HTMLElement,
  attributes: Readonly<Record<string, string>>,
): HTMLElement => {
  Object.entries(attributes).map(([name, value]) =>
    element.setAttribute(name, value),
  )

  return element
}

const input = (id: string): HTMLInputElement => {
  const element = document.createElement('input')
  element.id = id
  element.placeholder = 'Max Leiter'
  element.dataset.slot = 'input'
  element.setAttribute('class', inputBaseClassName)

  return element
}

const label = (forId: string, text: string): HTMLLabelElement => {
  const element = document.createElement('label')
  element.dataset.slot = 'field-label'
  element.setAttribute('class', fieldLabelBaseClassName)
  element.setAttribute('for', forId)
  element.textContent = text

  return element
}

const description = (text: string): HTMLParagraphElement => {
  const element = document.createElement('p')
  element.dataset.slot = 'field-description'
  element.setAttribute('class', fieldDescriptionBaseClassName)
  element.textContent = text

  return element
}

const field = (id: string, invalid = false): HTMLDivElement => {
  const element = document.createElement('div')
  setAttrs(element, {
    id,
    role: 'group',
    'data-slot': 'field',
    'data-orientation': 'vertical',
    class: fieldBaseClassName,
  })
  if (invalid) {
    element.dataset.invalid = ''
  }

  return element
}

const renderOriginField = (): FixtureSnapshot => {
  const fieldset = document.createElement('fieldset')
  const legend = document.createElement('legend')
  const topDescription = description('Fill in your profile information.')
  const group = document.createElement('div')
  const nameField = field('name-field')
  const nameContent = document.createElement('div')
  const emailField = field('email-field', true)
  const error = document.createElement('div')
  const separator = document.createElement('div')
  const separatorLine = document.createElement('div')
  const separatorContent = document.createElement('span')

  fieldset.dataset.slot = 'field-set'
  fieldset.setAttribute('class', fieldSetBaseClassName)

  legend.dataset.slot = 'field-legend'
  legend.setAttribute('class', fieldLegendBaseClassName)
  legend.dataset.variant = 'legend'
  legend.textContent = 'Profile'

  group.dataset.slot = 'field-group'
  group.setAttribute('class', fieldGroupBaseClassName)

  nameContent.dataset.slot = 'field-content'
  nameContent.setAttribute('class', fieldContentBaseClassName)
  nameContent.append(input('name'), description('Choose a unique username.'))
  nameField.append(label('name', 'Name'), nameContent)

  error.dataset.slot = 'field-error'
  error.setAttribute('class', fieldErrorBaseClassName)
  error.setAttribute('role', 'alert')
  error.textContent = 'Email is required'
  emailField.append(label('email', 'Email'), input('email'), error)

  separator.dataset.slot = 'field-separator'
  separator.setAttribute('class', fieldSeparatorBaseClassName)
  separator.dataset.content = 'true'
  separatorLine.setAttribute('role', 'separator')
  separatorLine.setAttribute('aria-orientation', 'horizontal')
  separatorLine.dataset.slot = 'separator'
  separatorLine.dataset.orientation = 'horizontal'
  separatorLine.setAttribute('class', separatorBaseClassName)
  separatorContent.dataset.slot = 'field-separator-content'
  separatorContent.setAttribute('class', fieldSeparatorContentBaseClassName)
  separatorContent.textContent = 'Optional'
  separator.append(separatorLine, separatorContent)

  group.append(nameField, emailField)
  fieldset.append(legend, topDescription, group, separator)

  document.body.append(fieldset)
  const snapshot = snapshotElement(fieldset, {})
  fieldset.remove()

  return snapshot
}

export const cases: ReadonlyArray<FixtureCase> = [
  {
    id: 'field-composition',
    snapshot: renderOriginField(),
  },
]
