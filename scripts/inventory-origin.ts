import { inventoryOrigin } from './origin-common'

const [localRepoPath, ...paths] = process.argv.slice(2)

if (localRepoPath === undefined) {
  throw new Error(
    'Usage: bun run scripts/inventory-origin.ts <local-repo-path> [...paths]',
  )
}

const inventory = inventoryOrigin(localRepoPath, paths)

console.log(JSON.stringify(inventory, null, 2))
