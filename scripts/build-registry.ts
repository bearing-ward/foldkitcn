import {
  buildComponentDocsArtifacts,
  buildRegistryIndex,
  buildPublicRegistryArtifacts,
  readRegistryIndex,
  writePublicRegistryArtifacts,
  writeComponentDocsArtifacts,
  writeJson,
} from './registry-common'

const outputPath = 'registry/index.json'
const index = buildRegistryIndex({
  previousIndex: readRegistryIndex(outputPath),
})
const publicRegistryArtifacts = buildPublicRegistryArtifacts(index)

writeJson(outputPath, index)
writeComponentDocsArtifacts(buildComponentDocsArtifacts(index))
writePublicRegistryArtifacts(publicRegistryArtifacts)

console.log(`Built ${outputPath} with ${index.items.length} item(s).`)
console.log(
  `Built registry/docs/index.json with ${index.items.length} route(s).`,
)
console.log(
  `Built public/r/registry.json with ${publicRegistryArtifacts.items.length} item(s).`,
)
