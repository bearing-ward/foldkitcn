import {
  buildRegistryIndex,
  readRegistryIndex,
  writeJson,
} from './registry-common'

const outputPath = 'registry/index.json'
const index = buildRegistryIndex({
  previousIndex: readRegistryIndex(outputPath),
})

writeJson(outputPath, index)

console.log(`Built ${outputPath} with ${index.items.length} item(s).`)
