import { Runtime } from 'foldkit'

import { captureOriginSnapshot } from '../../origin/shadcn/snapshot'
import { Message, Model, init, update, view } from './data-table-main'

const application = Runtime.makeApplication({
  Model,
  init,
  update,
  view,
  container: document.querySelector('#root'),
  devTools: { Message },
})

Runtime.run(application)

window.__SHADCN_FOLDKIT_FIXTURE__ = {
  selectedCase: {
    id: 'data-table-demo',
    title: 'Data Table demo',
    originFilePath: 'repos/ui/apps/v4/examples/base/data-table-demo.tsx',
  },
  captureSnapshot: () => {
    const fixtureElement = document.querySelector('[data-foldkit-fixture-root]')
    const targetElement = fixtureElement?.firstElementChild

    if (targetElement === undefined || targetElement === null) {
      throw new Error('No rendered element found for data-table-demo.')
    }

    return captureOriginSnapshot(targetElement, {
      caseId: 'data-table-demo',
      originFilePath: 'repos/ui/apps/v4/examples/base/data-table-demo.tsx',
    })
  },
}
