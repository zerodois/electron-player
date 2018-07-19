import { search } from '../../services/youtube'
import { to } from '../../utils'
import store from '../index'

const state = {
  q: ''
}

const mutations = {
  SET_SEARCH: (state, payload) => Object.assign(state, payload)
}

const actions = {
  do: async ({ commit }, payload) => {
    commit('SET_SEARCH', payload)
    let q = { maxResults: 10, ...payload, token: store.getters['User/getToken'] }
    let [err, r] = await to(search(q))
    if (err) {
      return commit('List/SET_LIST', [], { root: true })
    }
    commit('List/SET_LIST', r, { root: true })
  }
}

const getters = {
  get: state => state
}

export default {
  state,
  mutations,
  actions,
  getters
}
