const state = {
  token: null
}

const getters = {
  getToken: state => state.token
}

const actions = {
  setToken: ({ commit }, payload) => commit('SET_TOKEN', payload)
}

const mutations = {
  SET_TOKEN: (state, token) => Object.assign(state, { token })
}

export default {
  state,
  getters,
  actions,
  mutations
}
