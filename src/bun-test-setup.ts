import { Window } from 'happy-dom'

const defineGlobal = (name: string, value: unknown): void => {
  Object.defineProperty(globalThis, name, {
    value,
    writable: true,
    configurable: true,
  })
}

if (globalThis.window === undefined || globalThis.document === undefined) {
  const window = new Window()

  defineGlobal('window', window)
  defineGlobal('document', window.document)
  defineGlobal('navigator', window.navigator)
  defineGlobal('HTMLElement', window.HTMLElement)
  defineGlobal('Element', window.Element)
  defineGlobal('Node', window.Node)
  defineGlobal('Event', window.Event)
  defineGlobal('MouseEvent', window.MouseEvent)
  defineGlobal('KeyboardEvent', window.KeyboardEvent)
  defineGlobal('PointerEvent', window.PointerEvent)
  defineGlobal('CSS', window.CSS)
  defineGlobal(
    'requestAnimationFrame',
    window.requestAnimationFrame.bind(window),
  )
  defineGlobal('cancelAnimationFrame', window.cancelAnimationFrame.bind(window))
}
