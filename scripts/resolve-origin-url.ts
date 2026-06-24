import { resolveOriginUrl } from './origin-common'

const docsUrl = process.argv.at(2)

if (docsUrl === undefined) {
  throw new Error('Usage: bun run scripts/resolve-origin-url.ts <origin-url>')
}

const resolution = resolveOriginUrl(docsUrl)

console.log(JSON.stringify(resolution, null, 2))
