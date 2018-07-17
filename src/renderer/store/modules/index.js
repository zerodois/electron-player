/**
 * The file enables `@/store/index.js` to import all vuex modules
 * in a one-shot manner. There should not be any reason to edit this file.
 */

const files = require.context('.', false, /\.js$/)
const modules = {}

files.keys().forEach(key => {
  if (key === './index.js') return
  let mod = files(key).default
  mod.namespaced = true
  modules[key.replace(/(\.\/|\.js)/g, '')] = mod
})

export default modules
