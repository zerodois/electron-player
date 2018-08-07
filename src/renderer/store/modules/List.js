// import Vue from 'vue'

const state = {
  list: []
}

const mutations = {
  SET_LIST: (state, list) => Object.assign(state, { list }),
  MERGE_LIST: (state, list) => Object.assign(state, { list: [...state.list, ...list] }),
  SET_ITEM: (state, { index, item }) => Object.assign(state.list[index], item)
}

const actions = {
  setList: async ({ commit }, list) => {
    commit('SET_LIST', list)
  },
  mergeList: async ({ commit }, list) => {
    commit('MERGE_LIST', list)
  },
  setItem: async ({ commit }, payload) => {
    commit('SET_ITEM', payload)
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
