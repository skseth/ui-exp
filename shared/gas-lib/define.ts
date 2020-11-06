/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FactoryFunction = (require: null, exports: any, ...mods: any) => void

type Module = {
  name: string
  deps: string[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  factory: FactoryFunction
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  exports?: any
}

const modules: { [key: string]: Module } = {}
const module_ddeps: { [key: string]: string[] } = {}

function areDepsReady(name: string) {
  const { deps } = modules[name]

  for (let i = 2; i < deps.length; i++) {
    const dep_module = modules[deps[i]]
    if (dep_module && dep_module.exports) {
      continue
    }
    return false
  }

  return true
}

function getDepArray(name: string) {
  const { deps } = modules[name]
  const deparray = []

  for (let i = 2; i < deps.length; i++) {
    const dep_module = modules[deps[i]]
    deparray.push(dep_module.exports)
  }

  return deparray
}

function processModule(name: string) {
  const { factory, exports } = modules[name]
  if (exports) return

  if (!areDepsReady(name)) {
    return
  }
  modules[name].exports = {}
  const deparray = getDepArray(name)
  factory(null, modules[name].exports, ...deparray)

  console.log(`Defining ${name}`)

  if (module_ddeps[name]) {
    module_ddeps[name].forEach((ddepName) => processModule(ddepName))
  }
}

function define(name: string, deps: string[], factory: FactoryFunction) {
  const module = { name, deps, factory }
  modules[name] = module

  for (let i = 2; i < deps.length; i++) {
    const mod_name = deps[i]
    if (module_ddeps[mod_name]) {
      module_ddeps[mod_name].push(name)
    } else {
      module_ddeps[mod_name] = [name]
    }
  }
  processModule(name)
}
