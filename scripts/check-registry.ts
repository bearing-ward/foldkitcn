import { checkRegistry, checkRegistryIndexCurrent } from './registry-common'
import { checkOriginComponentProgressChecklistCurrent } from './registry-component-progress-common'

const result = checkRegistry()
const outputPath = 'registry/index.json'

checkRegistryIndexCurrent(outputPath)
checkOriginComponentProgressChecklistCurrent()

console.log(`Validated ${result.manifests.length} source manifest(s).`)
console.log(`Verified ${outputPath} is current.`)
console.log('Verified registry.json is current.')
console.log('Verified docs/component-conversion-checklist.md is current.')
