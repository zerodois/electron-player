import { downloadList } from '../../services/player'
import R from 'ramda'
import { genIterator, map } from '../../../share'

const queue = (dispatch, iterable) => {
  return R.pipe(
    map(setDownloaded(dispatch, -1)),
    map(downloadList),
    map(setDownloaded(dispatch, 1))
  )(iterable)
}

const setDownloaded = (dispatch, downloaded) => (item, index) => {
  if (item.downloaded > 0) {
    return item
  }
  item = { ...item, downloaded }
  dispatch(item, index)
  return item
}

const state = {
  list: []
}

const getters = {
  get: state => state.list
}

const actions = {
  /**
   * @param {{ commit }} store
   * @param {Array} payload
   */
  setDownloads: async ({ commit, getters }, { action, items }) => {
    commit('SET_DOWNLOADS', items)
    let it = queue(action, genIterator(items, true)())
    for await (let item of it) {
      if (!getters.get.length) {
        return
      }
      console.log('downloaded', item)
      commit('SET_DOWNLOADS', getters.get.slice(1, getters.get.length))
    }
  },
  setDownloadItem: ({ getters, commit }, { item, index }) => {
    let list = getters.get.map(it => ({ ...it }))
    Object.assign(list[index], item)
    commit('SET_DOWNLOADS', list)
  }
}

const mutations = {
  SET_DOWNLOADS: (state, list) => Object.assign(state, { list })
}

export default {
  state,
  getters,
  actions,
  mutations
}
