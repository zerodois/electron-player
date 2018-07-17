import { search } from '../../services/youtube'
import { to } from '../../utils'

const state = {
  results: []
}

const mutations = {
  SET_RESULTS: (state, results) => Object.assign(state, { results })
}

const actions = {
  search: async ({ commit }, text) => {
    let q = { text }
    let [err, results] = await to(search(q))
    if (err) {
      results = []
      console.error(err)
    }
    commit('SET_RESULTS', results)
  }
}

const getters = {
  get: state => state.results
}

export default {
  state,
  mutations,
  actions,
  getters
}
