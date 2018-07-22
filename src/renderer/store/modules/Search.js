import { search } from '../../services/youtube'
import { to } from '../../utils'
import store from '../index'

const state = {
  q: '',
  nextPage: ''
}

const mutations = {
  SET_SEARCH: (state, payload) => Object.assign(state, payload),
  SET_NEXT_PAGE_TOKEN: (state, nextPage) => Object.assign(state, { nextPage })
}

const actions = {
  do: async ({ commit }, payload) => {
    commit('SET_SEARCH', payload)
    let { append } = payload
    delete payload.append
    let q = { ...payload, token: store.getters['User/getToken'] }
    let [err, r] = await to(search(q))
    if (err) {
      commit('SET_NEXT_PAGE_TOKEN', '')
      return commit('List/SET_LIST', [], { root: true })
    }
    commit('SET_NEXT_PAGE_TOKEN', r.nextPageToken)
    commit(`List/${append ? 'MERGE_LIST' : 'SET_LIST'}`, r.items, { root: true })
  },
  nextPage: async ({ dispatch, state }, payload) => {
    dispatch('do', { pageToken: state.nextPage, append: true })
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
