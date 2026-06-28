import { Array, String, pipe } from 'effect'

import type { PublicComponent } from '../data'
import { namespaceLabel } from '../data'

const MAX_COMPONENT_SEARCH_RESULTS = 12

const normalizeSearchText = (value: string): string =>
  String.trim(value).toLowerCase()

export const componentSearchBadges = (
  component: PublicComponent,
): ReadonlyArray<string> => [
  component.entry.item.lifecycle.availability,
  component.entry.item.lifecycle.implementationStatus,
  component.entry.item.lifecycle.parityStatus,
  component.entry.item.lifecycle.driftStatus,
  component.entry.item.lifecycle.docsStatus,
]

const componentSearchFields = (
  component: PublicComponent,
): ReadonlyArray<string> => [
  component.entry.item.name,
  component.entry.item.id,
  component.entry.item.namespace,
  namespaceLabel(component.entry.item.namespace),
  component.entry.item.description,
  ...componentSearchBadges(component),
]

const matchesComponentSearch = (
  query: string,
  component: PublicComponent,
): boolean => {
  const normalizedQuery = normalizeSearchText(query)

  if (String.isEmpty(normalizedQuery)) {
    return false
  }

  return Array.some(componentSearchFields(component), field =>
    normalizeSearchText(field).includes(normalizedQuery),
  )
}

export const searchPublicComponents = (
  components: ReadonlyArray<PublicComponent>,
  query: string,
): ReadonlyArray<PublicComponent> => {
  const normalizedQuery = normalizeSearchText(query)

  if (String.isEmpty(normalizedQuery)) {
    return []
  }

  return pipe(
    components,
    Array.filter(component =>
      matchesComponentSearch(normalizedQuery, component),
    ),
    Array.take(MAX_COMPONENT_SEARCH_RESULTS),
  )
}
