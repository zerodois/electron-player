const state = {
  playlists: []
}

const actions = {
  setPlaylists: ({ commit }, payload) => commit('SET_PLAYLISTS', payload),
  updateList: ({ commit, getters }, playlist) => {
    let index = getters.get.findIndex(item => item.id === playlist.id)
    commit('UPDATE_PLAYLISTS', { index, playlist })
  }
}

const getters = {
  get: state => state.playlists
}

const mutations = {
  SET_PLAYLISTS: (state, playlists) => Object.assign(state, { playlists }),
  UPDATE_PLAYLISTS: (state, { index, playlist }) => Object.assign(state.playlists[index], playlist)
}

export default {
  actions,
  getters,
  mutations,
  state
}
