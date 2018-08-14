const state = {
  playlists: []
}

const actions = {
  setPlaylists: ({ commit }, payload) => commit('SET_PLAYLISTS', payload),
  updateList: ({ commit, getters }, playlist) => {
    let index = getters.get.findIndex(item => item.id === playlist.id)
    commit('UPDATE_PLAYLISTS', { index, playlist })
  },
  updateItem: ({ commit, getters }, { index, item, id }) => {
    let playlist = getters.get.findIndex(item => item.id === id)
    commit('UPDATE_ITEM', { index, item, playlist })
  }
}

const getters = {
  get: state => state.playlists
}

const mutations = {
  SET_PLAYLISTS: (state, playlists) => Object.assign(state, { playlists }),
  UPDATE_PLAYLISTS: (state, { index, playlist }) => Object.assign(state.playlists[index], playlist),
  UPDATE_ITEM: (state, { index, playlist, item }) => Object.assign(state.playlists[playlist].videos[index], item)
}

export default {
  actions,
  getters,
  mutations,
  state
}
