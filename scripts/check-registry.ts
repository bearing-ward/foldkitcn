import { checkRegistry, checkRegistryIndexCurrent } from './registry-common'

const result = checkRegistry()
const outputPath = 'registry/index.json'

checkRegistryIndexCurrent(outputPath)

console.log(`Validated ${result.manifests.length} source manifest(s).`)
console.log(`Verified ${outputPath} is current.`)
