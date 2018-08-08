const state = {
  playlists: []
}

const actions = {
  setPlaylists: ({ commit }, payload) => commit('SET_PLAYLISTS', payload)
}

const getters = {
  get: state => state.playlists
}

const mutations = {
  SET_PLAYLISTS: (state, playlists) => Object.assign(state, { playlists })
}

export default {
  actions,
  getters,
  mutations,
  state
}
