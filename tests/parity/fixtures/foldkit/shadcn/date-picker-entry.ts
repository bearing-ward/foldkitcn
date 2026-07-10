import { Runtime } from 'foldkit'

import { captureOriginSnapshot } from '../../origin/shadcn/snapshot'
import { Message, Model, init, update, view } from './date-picker-main'

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
    id: 'date-picker-demo',
    title: 'Date Picker demo',
    originFilePath: 'repos/ui/apps/v4/examples/base/date-picker-demo.tsx',
  },
  captureSnapshot: () => {
    const fixtureElement = document.querySelector('[data-foldkit-fixture-root]')
    const targetElement = fixtureElement?.firstElementChild

    if (targetElement === undefined || targetElement === null) {
      throw new Error('No rendered element found for date-picker-demo.')
    }

    return captureOriginSnapshot(targetElement, {
      caseId: 'date-picker-demo',
      originFilePath: 'repos/ui/apps/v4/examples/base/date-picker-demo.tsx',
    })
  },
}
