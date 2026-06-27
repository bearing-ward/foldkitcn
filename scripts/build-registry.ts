import {
  buildComponentDocsArtifacts,
  buildRegistryIndex,
  readRegistryIndex,
  writeComponentDocsArtifacts,
  writeJson,
} from './registry-common'

const outputPath = 'registry/index.json'
const index = buildRegistryIndex({
  previousIndex: readRegistryIndex(outputPath),
})

writeJson(outputPath, index)
writeComponentDocsArtifacts(buildComponentDocsArtifacts(index))

console.log(`Built ${outputPath} with ${index.items.length} item(s).`)
console.log(
  `Built registry/docs/index.json with ${index.items.length} route(s).`,
)
