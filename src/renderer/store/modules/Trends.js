// import Vue from 'vue'

const state = {
  list: []
}

const mutations = {
  SET_LIST: (state, list) => Object.assign(state, { list })
}

const actions = {
  setList: async ({ commit }, list) => {
    commit('SET_LIST', list)
  }
}

const getters = {
  get: state => state.list
}

export default {
  state,
  mutations,
  actions,
  getters
}
