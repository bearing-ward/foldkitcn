import {
  buildComponentDocsArtifacts,
  buildRegistryIndex,
  buildPublicRegistryArtifacts,
  githubRegistryAddressForItemId,
  readRegistryIndex,
  writeGitHubRegistryCatalog,
  writePublicRegistryArtifacts,
  writeComponentDocsArtifacts,
  writeJson,
} from './registry-common'

const outputPath = 'registry/index.json'
const previousIndex = readRegistryIndex(outputPath)
const buildOptions = previousIndex === undefined ? {} : { previousIndex }
const index = buildRegistryIndex(buildOptions)
const publicRegistryArtifacts = buildPublicRegistryArtifacts(index)
const githubRegistryArtifacts = buildPublicRegistryArtifacts(
  index,
  githubRegistryAddressForItemId,
)

writeJson(outputPath, index)
writeComponentDocsArtifacts(buildComponentDocsArtifacts(index))
writePublicRegistryArtifacts(publicRegistryArtifacts)
writeGitHubRegistryCatalog(githubRegistryArtifacts)

console.log(`Built ${outputPath} with ${index.items.length} item(s).`)
console.log(
  `Built registry/docs/index.json with ${index.items.length} route(s).`,
)
console.log(
  `Built public/r/registry.json with ${publicRegistryArtifacts.items.length} item(s).`,
)
console.log(
  `Built registry.json with ${githubRegistryArtifacts.items.length} item(s).`,
)
