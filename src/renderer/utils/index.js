import Vue from 'vue'

export const to = promise => promise.then(data => [null, data]).catch(e => [e, null])
export const EventEmitter = new Vue()
