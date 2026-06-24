import * as React from 'react'

export type Language = 'en' | 'ar' | 'he'
export type Direction = 'ltr' | 'rtl'

export type Translations<
  T extends Record<string, string> = Record<string, string>,
> = Record<
  Language,
  {
    readonly dir: Direction
    readonly locale?: string
    readonly values: T
  }
>

export interface LanguageSelectorProps {
  readonly value: Language
  readonly onValueChange: (value: Language) => void
}

export const languageOptions: ReadonlyArray<{
  readonly value: Language
  readonly label: string
}> = [
  { value: 'en', label: 'English' },
  { value: 'ar', label: 'Arabic (العربية)' },
  { value: 'he', label: 'Hebrew (עברית)' },
]

export const LanguageProvider = ({
  children,
}: {
  readonly children: React.ReactNode
}) => <>{children}</>

export const useLanguageContext = () => null

export const useTranslation = <T extends Record<string, string>>(
  translations: Translations<T>,
  defaultLanguage: Language = 'ar',
) => {
  const translation = translations[defaultLanguage]

  return {
    language: defaultLanguage,
    setLanguage: (language: Language) => language,
    dir: translation.dir,
    locale: translation.locale,
    t: translation.values,
  }
}

export const LanguageSelector = ({
  value,
}: LanguageSelectorProps & {
  readonly className?: string
  readonly languages?: ReadonlyArray<Language>
}) => <span data-name="language-selector">{value}</span>
