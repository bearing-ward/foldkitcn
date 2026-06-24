import { buildRegistryIndex, writeJson } from './registry-common'

const index = buildRegistryIndex()
const outputPath = 'registry/index.json'

writeJson(outputPath, index)

console.log(`Built ${outputPath} with ${index.items.length} item(s).`)
