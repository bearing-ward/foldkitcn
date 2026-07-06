import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import type { ComboboxItemDescriptor } from './index'
import {
  checkIcon,
  chevronDownIcon,
  displayValue,
  view as Combobox,
  xIcon,
} from './index'

const frameworks: ReadonlyArray<ComboboxItemDescriptor> = [
  { label: 'Next.js', value: 'next' },
  { label: 'SvelteKit', value: 'sveltekit' },
  { label: 'Nuxt.js', value: 'nuxt' },
  { label: 'Remix', value: 'remix' },
  { label: 'Astro', value: 'astro' },
]

const timezoneGroups: ReadonlyArray<
  Readonly<{
    label: string
    items: ReadonlyArray<ComboboxItemDescriptor>
  }>
> = [
  {
    label: 'Americas',
    items: [
      { label: '(GMT-5) New York', value: 'new-york' },
      { label: '(GMT-8) Los Angeles', value: 'los-angeles' },
      { label: '(GMT-6) Chicago', value: 'chicago' },
      { label: '(GMT-5) Toronto', value: 'toronto' },
      { label: '(GMT-8) Vancouver', value: 'vancouver' },
      { label: '(GMT-3) Sao Paulo', value: 'sao-paulo' },
    ],
  },
  {
    label: 'Europe',
    items: [
      { label: '(GMT+0) London', value: 'london' },
      { label: '(GMT+1) Paris', value: 'paris' },
      { label: '(GMT+1) Berlin', value: 'berlin' },
      { label: '(GMT+1) Rome', value: 'rome' },
      { label: '(GMT+1) Madrid', value: 'madrid' },
      { label: '(GMT+1) Amsterdam', value: 'amsterdam' },
    ],
  },
  {
    label: 'Asia/Pacific',
    items: [
      { label: '(GMT+9) Tokyo', value: 'tokyo' },
      { label: '(GMT+8) Shanghai', value: 'shanghai' },
      { label: '(GMT+8) Singapore', value: 'singapore' },
      { label: '(GMT+4) Dubai', value: 'dubai' },
      { label: '(GMT+11) Sydney', value: 'sydney' },
      { label: '(GMT+9) Seoul', value: 'seoul' },
    ],
  },
]

const countries: ReadonlyArray<ComboboxItemDescriptor> = [
  {
    label: 'Argentina',
    value: 'argentina',
    textValue: 'Argentina South America ar',
  },
  { label: 'Australia', value: 'australia', textValue: 'Australia Oceania au' },
  { label: 'Brazil', value: 'brazil', textValue: 'Brazil South America br' },
  { label: 'Canada', value: 'canada', textValue: 'Canada North America ca' },
  { label: 'China', value: 'china', textValue: 'China Asia cn' },
  { label: 'France', value: 'france', textValue: 'France Europe fr' },
  { label: 'Japan', value: 'japan', textValue: 'Japan Asia jp' },
  { label: 'Kenya', value: 'kenya', textValue: 'Kenya Africa ke' },
  { label: 'Mexico', value: 'mexico', textValue: 'Mexico North America mx' },
  {
    label: 'United States',
    value: 'united-states',
    textValue: 'United States North America us',
  },
]

const arabicCategories: ReadonlyArray<ComboboxItemDescriptor> = [
  { label: 'التكنولوجيا', value: 'technology' },
  { label: 'التصميم', value: 'design' },
  { label: 'الأعمال', value: 'business' },
  { label: 'التسويق', value: 'marketing' },
  { label: 'التعليم', value: 'education' },
  { label: 'الصحة', value: 'health' },
]

const allTimezones = (): ReadonlyArray<ComboboxItemDescriptor> =>
  timezoneGroups.flatMap(group => group.items)

const comboboxShell = (
  config: Readonly<{
    id: string
    inputValue?: string
    items: ReadonlyArray<ComboboxItemDescriptor>
    placeholder: string
    value?: string
    values?: ReadonlyArray<string>
    highlightedValue?: string
    disabled?: boolean
    invalid?: boolean
    autoHighlight?: boolean
    selectionMode?: 'single' | 'multiple'
    showClear?: boolean
    triggerClassName?: string
    contentClassName?: string
    inputGroupClassName?: string
    chipsClassName?: string
    anchorToChips?: boolean
    dir?: string
    emptyText?: string
    groups?: ReadonlyArray<
      Readonly<{
        label?: string
        items: ReadonlyArray<ComboboxItemDescriptor>
      }>
    >
  }>,
): Html => {
  const h = html<never>()
  const groups = config.groups ?? [{ items: config.items }]

  return Combobox<never>({
    id: config.id,
    open: true,
    inputValue: config.inputValue ?? '',
    items: config.items,
    placeholder: config.placeholder,
    ...(config.value === undefined ? {} : { value: config.value }),
    ...(config.values === undefined ? {} : { values: config.values }),
    ...(config.highlightedValue === undefined
      ? {}
      : { highlightedValue: config.highlightedValue }),
    ...(config.selectionMode === undefined
      ? {}
      : { selectionMode: config.selectionMode }),
    ...(config.disabled === undefined ? {} : { isDisabled: config.disabled }),
    ...(config.invalid === undefined ? {} : { isInvalid: config.invalid }),
    ...(config.autoHighlight === undefined
      ? {}
      : { autoHighlight: config.autoHighlight }),
    ...(config.showClear === undefined ? {} : { showClear: config.showClear }),
    ...(config.triggerClassName === undefined
      ? {}
      : { triggerClassName: config.triggerClassName }),
    ...(config.contentClassName === undefined
      ? {}
      : { contentClassName: config.contentClassName }),
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
    toView: attributes =>
      h.div(
        [...attributes.root],
        [
          ...(config.selectionMode === 'multiple'
            ? [
                h.div(
                  [...attributes.chips],
                  [
                    ...attributes.chipItems.map(chip =>
                      h.div(
                        [...chip.root],
                        [
                          chip.item.label,
                          h.button([...chip.remove], [xIcon([])]),
                        ],
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
                        h.button(
                          [...attributes.trigger],
                          [chevronDownIcon([])],
                        ),
                        ...(config.showClear === true
                          ? [h.button([...attributes.clear], [xIcon([])])]
                          : []),
                      ],
                    ),
                  ],
                ),
              ]),
          h.div(
            [...attributes.portal],
            [
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
                                      item.value === itemAttributes.item.value,
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
                                        [checkIcon([])],
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
            ],
          ),
          ...attributes.hiddenInputs.map(hiddenInput =>
            h.input([...hiddenInput]),
          ),
        ],
      ),
  })
}

export const ComboboxBasic = (): Html =>
  comboboxShell({
    id: 'combobox-basic',
    items: frameworks,
    placeholder: 'Select a framework',
  })

export const ComboboxWithClear = (): Html =>
  comboboxShell({
    id: 'combobox-clear',
    items: frameworks,
    placeholder: 'Select a framework',
    value: 'next',
    showClear: true,
  })

export const ComboboxWithGroupsAndSeparator = (): Html =>
  comboboxShell({
    id: 'combobox-groups',
    items: allTimezones(),
    placeholder: 'Select a timezone',
    emptyText: 'No timezones found.',
    groups: timezoneGroups,
  })

export const ComboxboxInputGroup = (): Html => {
  const h = html<never>()

  return h.div(
    [],
    [
      comboboxShell({
        id: 'combobox-input-group',
        items: allTimezones(),
        placeholder: 'Select a timezone',
        contentClassName: 'w-60',
        emptyText: 'No timezones found.',
        inputGroupClassName: 'w-auto',
        groups: timezoneGroups,
      }),
    ],
  )
}

export const ComboboxMultiple = (): Html =>
  comboboxShell({
    id: 'combobox-multiple',
    items: frameworks,
    placeholder: 'Add framework',
    selectionMode: 'multiple',
    values: ['next'],
    highlightedValue: 'sveltekit',
    autoHighlight: true,
    anchorToChips: true,
    chipsClassName: 'w-full max-w-xs',
  })

export const ComboboxDisabled = (): Html =>
  comboboxShell({
    id: 'combobox-disabled',
    items: frameworks.map(item =>
      item.value === 'astro' ? { ...item, isDisabled: true } : item,
    ),
    placeholder: 'Select a framework',
    disabled: true,
  })

export const ComboboxInvalid = (): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('w-full max-w-xs'), h.DataAttribute('invalid', '')],
    [
      h.label([h.Class('text-sm font-medium')], ['Framework']),
      comboboxShell({
        id: 'combobox-invalid',
        items: frameworks,
        placeholder: 'Select a framework',
        invalid: true,
      }),
      h.p(
        [h.Class('text-sm text-destructive')],
        ['Please select a framework.'],
      ),
    ],
  )
}

export const ComboboxPopup = (): Html => {
  const h = html<never>()

  return Combobox<never>({
    id: 'combobox-popup',
    open: true,
    inputValue: '',
    items: countries,
    value: 'argentina',
    placeholder: 'Search',
    triggerClassName: 'w-64 justify-between font-normal',
    toView: attributes =>
      h.div(
        [...attributes.root],
        [
          h.button(
            [...attributes.trigger],
            [
              h.span(
                [...attributes.value],
                [
                  displayValue({
                    items: countries,
                    placeholder: 'Select country',
                    value: 'argentina',
                  }),
                ],
              ),
              chevronDownIcon([]),
            ],
          ),
          h.div(
            [...attributes.portal],
            [
              h.div([...attributes.backdrop.root], []),
              h.div(
                [...attributes.positioner.root],
                [
                  h.div(
                    [...attributes.popup.root],
                    [
                      h.div(
                        [...attributes.inputGroup],
                        [h.input([...attributes.input])],
                      ),
                      h.div([...attributes.empty], []),
                      h.div(
                        [...attributes.list.root],
                        attributes.items.map(itemAttributes =>
                          h.div(
                            [...itemAttributes.root],
                            [
                              h.span(
                                [...itemAttributes.text],
                                [itemAttributes.item.label],
                              ),
                              h.span(
                                [...itemAttributes.indicator],
                                [checkIcon([])],
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
  })
}

export const ComboboxAutoHighlight = (): Html =>
  comboboxShell({
    id: 'combobox-auto-highlight',
    items: frameworks,
    placeholder: 'Select a framework',
    highlightedValue: 'next',
    autoHighlight: true,
  })

export const ComboboxWithCustomItems = (): Html =>
  comboboxShell({
    id: 'combobox-custom',
    items: countries,
    placeholder: 'Search countries...',
    inputValue: 'a',
    emptyText: 'No countries found.',
  })

export const ComboboxRtl = (): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('mx-auto w-full max-w-xs'), h.Dir('rtl')],
    [
      h.label([h.Class('text-sm font-medium')], ['الفئات']),
      comboboxShell({
        id: 'combobox-rtl',
        items: arabicCategories,
        placeholder: 'أضف فئات',
        selectionMode: 'multiple',
        values: ['technology'],
        highlightedValue: 'design',
        anchorToChips: true,
        dir: 'rtl',
        emptyText: 'لم يتم العثور على فئات.',
      }),
    ],
  )
}
