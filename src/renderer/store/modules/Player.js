const state = {
  song: null,
  index: -1,
  queue: [],
  running: false,
  shuffle: false,
  repeat: 0
}

const mutations = {
  SET_SHUFFLE: (state, shuffle) => Object.assign(state, { shuffle }),
  SET_REPEAT: (state, repeat) => Object.assign(state, { repeat }),
  SET_SONG: (state, song) => Object.assign(state, { song }),
  SET_QUEUE: (state, queue) => Object.assign(state, { queue }),
  SET_RUNNING: (state, running) => Object.assign(state, { running })
}

const actions = {
  setShuffle: async ({ commit }, song) => {
    commit('SET_SHUFFLE', song)
  },
  setRepeat: async ({ commit }, song) => {
    commit('SET_REPEAT', song)
  },
  setSong: async ({ commit }, song) => {
    commit('SET_SONG', song)
  },
  setQueue: async ({ commit }, queue) => {
    commit('SET_QUEUE', queue)
  },
  setRunning: async ({ commit }, running) => {
    commit('SET_RUNNING', running)
  }
}

const getters = {
  get: state => state.song,
  getShuffle: state => state.shuffle,
  getRepeat: state => state.repeat,
  getRunning: state => state.running,
  getQueue: state => state.queue,
  getIndex: state => {
    return state.queue.findIndex(it => it.id.videoId === state.song.id.videoId)
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
