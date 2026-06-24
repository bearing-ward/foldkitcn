import { checkRegistry } from './registry-common'

const result = checkRegistry()

console.log(`Validated ${result.manifests.length} source manifest(s).`)
