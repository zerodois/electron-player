const state = {
  config: {
    coverExpanded: true,
    volume: 1
  }
}

const getters = {
  get: state => state.config
}

const actions = {
  setCoverExpanded: ({ commit }, payload) => commit('SET_COVER_EXPANDED', payload),
  setVolume: ({ commit }, payload) => commit('SET_VOLUME', payload)
}

const mutations = {
  SET_COVER_EXPANDED: (state, coverExpanded) => Object.assign(state.config, { coverExpanded }),
  SET_VOLUME: (state, volume) => Object.assign(state.config, { volume })
}

export default {
  state,
  getters,
  actions,
  mutations
}
