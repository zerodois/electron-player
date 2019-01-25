const state = {
  config: {
    coverExpanded: true
  }
}

const getters = {
  get: state => state.config
}

const actions = {
  setCoverExpanded: ({ commit }, payload) => commit('SET_COVER_EXPANDED', payload)
}

const mutations = {
  SET_COVER_EXPANDED: (state, coverExpanded) => Object.assign(state.config, { coverExpanded })
}

export default {
  state,
  getters,
  actions,
  mutations
}
