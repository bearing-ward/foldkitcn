import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'

type HtmlFactory = ReturnType<typeof html<never>>

const h1View = (h: HtmlFactory): Html =>
  h.h1(
    [
      h.Class(
        'scroll-m-20 text-4xl font-extrabold tracking-tight text-balance',
      ),
    ],
    ['Taxing Laughter: The Joke Tax Chronicles'],
  )

const h2View = (h: HtmlFactory): Html =>
  h.h2(
    [
      h.Class(
        'mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
      ),
    ],
    ['The People of the Kingdom'],
  )

const h3View = (h: HtmlFactory): Html =>
  h.h3(
    [h.Class('mt-8 scroll-m-20 text-2xl font-semibold tracking-tight')],
    ['The Joke Tax'],
  )

const h4View = (h: HtmlFactory): Html =>
  h.h4(
    [h.Class('mt-8 scroll-m-20 text-xl font-semibold tracking-tight')],
    ['People stopped telling jokes'],
  )

const paragraphView = (h: HtmlFactory): Html =>
  h.p(
    [h.Class('leading-7 [&:not(:first-child)]:mt-6')],
    [
      'The king thought laughter was too valuable to be free, so he taxed every punchline in the realm.',
    ],
  )

const blockquoteView = (h: HtmlFactory): Html =>
  h.blockquote(
    [h.Class('mt-6 border-l-2 pl-6 italic')],
    [
      'After all, he said, everyone enjoys a joke more when it arrives with paperwork.',
    ],
  )

const tableView = (h: HtmlFactory): Html =>
  h.div(
    [h.Class('my-6 w-full overflow-y-auto')],
    [
      h.table(
        [h.Class('w-full')],
        [
          h.thead(
            [],
            [
              h.tr(
                [h.Class('m-0 border-t p-0 even:bg-muted')],
                [
                  h.th(
                    [
                      h.Attribute('scope', 'col'),
                      h.Class(
                        'border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right',
                      ),
                    ],
                    ['Type'],
                  ),
                  h.th(
                    [
                      h.Attribute('scope', 'col'),
                      h.Class(
                        'border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right',
                      ),
                    ],
                    ['Tax'],
                  ),
                ],
              ),
            ],
          ),
          h.tbody(
            [],
            [
              h.tr(
                [h.Class('m-0 border-t p-0 even:bg-muted')],
                [
                  h.td(
                    [
                      h.Class(
                        'border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right',
                      ),
                    ],
                    ['Puns'],
                  ),
                  h.td(
                    [
                      h.Class(
                        'border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right',
                      ),
                    ],
                    ['One groan'],
                  ),
                ],
              ),
              h.tr(
                [h.Class('m-0 border-t p-0 even:bg-muted')],
                [
                  h.td(
                    [
                      h.Class(
                        'border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right',
                      ),
                    ],
                    ['Knock-knock jokes'],
                  ),
                  h.td(
                    [
                      h.Class(
                        'border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right',
                      ),
                    ],
                    ['Two knocks'],
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    ],
  )

const listView = (h: HtmlFactory): Html =>
  h.ul(
    [h.Class('my-6 ml-6 list-disc [&>li]:mt-2')],
    [
      h.li([], ['The court jester kept detailed receipts.']),
      h.li([], ['The townspeople shared quiet smiles instead.']),
      h.li([], ['The audit office ran out of forms by noon.']),
    ],
  )

export const TypographyDemo = (): Html => {
  const h = html<never>()

  return h.article(
    [h.Class('max-w-3xl')],
    [
      h1View(h),
      paragraphView(h),
      h2View(h),
      paragraphView(h),
      h3View(h),
      blockquoteView(h),
      h4View(h),
      listView(h),
      tableView(h),
    ],
  )
}

export const TypographyH1 = (): Html => {
  const h = html<never>()

  return h1View(h)
}

export const TypographyH2 = (): Html => {
  const h = html<never>()

  return h2View(h)
}

export const TypographyH3 = (): Html => {
  const h = html<never>()

  return h3View(h)
}

export const TypographyH4 = (): Html => {
  const h = html<never>()

  return h4View(h)
}

export const TypographyP = (): Html => {
  const h = html<never>()

  return paragraphView(h)
}

export const TypographyBlockquote = (): Html => {
  const h = html<never>()

  return blockquoteView(h)
}

export const TypographyTable = (): Html => {
  const h = html<never>()

  return tableView(h)
}

export const TypographyList = (): Html => {
  const h = html<never>()

  return listView(h)
}

export const TypographyInlineCode = (): Html => {
  const h = html<never>()

  return h.p(
    [h.Class('leading-7')],
    [
      'Use ',
      h.code(
        [
          h.Class(
            'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
          ),
        ],
        ['h.code'],
      ),
      ' for inline code.',
    ],
  )
}

export const TypographyLead = (): Html => {
  const h = html<never>()

  return h.p(
    [h.Class('text-xl text-muted-foreground')],
    [
      'A modal dialog that interrupts the user with important content and expects a response.',
    ],
  )
}

export const TypographyLarge = (): Html => {
  const h = html<never>()

  return h.div([h.Class('text-lg font-semibold')], ['Are you absolutely sure?'])
}

export const TypographySmall = (): Html => {
  const h = html<never>()

  return h.small(
    [h.Class('text-sm leading-none font-medium')],
    ['Email address'],
  )
}

export const TypographyMuted = (): Html => {
  const h = html<never>()

  return h.p(
    [h.Class('text-sm text-muted-foreground')],
    ['Enter your email address.'],
  )
}

export const TypographyRtl = (): Html => {
  const h = html<never>()

  return h.div(
    [h.Dir('rtl'), h.Class('space-y-4 text-right')],
    [
      h.h3(
        [h.Class('scroll-m-20 text-2xl font-semibold tracking-tight')],
        ['دليل الضحك المنظم'],
      ),
      h.p(
        [h.Class('leading-7')],
        [
          'هذا المثال يستخدم نصا عربيا ثابتا لعرض اتجاه القراءة من اليمين إلى اليسار.',
        ],
      ),
    ],
  )
}
