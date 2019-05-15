import { google } from 'googleapis'
import { oauth2Client } from '../auth'
import { get as find } from '../../services/songs'
import { promisify } from 'bluebird-lst'

export const get = async (query) => {
  const auth = oauth2Client(query.token)
  let service = google.youtube('v3')
  let config = {
    auth,
    part: 'id',
    maxResults: 10,
    type: 'video'
  }
  Object.assign(config, query)
  let fn = promisify(service.search.list).bind(service)
  let { data } = await fn(config)
  const ids = data.items.map(item => item.id.videoId).join(',')
  const response = await videos({ auth, id: ids })
  data.items = response.items
  return data
}

export const videos = async (q) => {
  const auth = oauth2Client(q.token)
  let service = google.youtube('v3')
  let config = {
    auth,
    part: 'snippet,contentDetails',
    maxResults: 10
  }
  let fn = promisify(service.videos.list).bind(service)
  let response = await fn({ ...config, ...q })
  let songs = (await find({}, { id: 1 })).map(it => it.id.videoId)
  response.data.items = response.data.items.map(item => {
    item.downloaded = songs.indexOf(item.id.videoId) > -1 ? 1 : 0
    return item
  })
  return response.data
}

export const playlists = async (q) => {
  const auth = oauth2Client(q.token)
  let service = google.youtube('v3')
  let config = {
    auth,
    part: 'snippet,status',
    maxResults: 10
  }
  let fn = promisify(service.playlists.list).bind(service)
  let response = await fn({ ...config, ...q })
  return response.data
}

export const put = ({ playlistId, videoId, token }) => {
  const auth = oauth2Client(token)
  let service = google.youtube('v3')
  let config = {
    auth,
    part: 'snippet',
    resource: {
      snippet: {
        playlistId,
        resourceId: {
          kind: 'youtube#video',
          videoId
        }
      }
    }
  }
  let fn = promisify(service.playlistItems.insert).bind(service)
  return fn(config)
    .then(r => r.data)
}

export const remove = ({ id, token }) => {
  const auth = oauth2Client(token)
  let service = google.youtube('v3')
  let config = {
    auth,
    id
  }
  let fn = promisify(service.playlistItems.delete).bind(service)
  return fn(config)
    .then(r => r.data)
    .then(d => {
      console.log('REPOSTA --------->', JSON.stringify(d, null, 2))
      return d
    })
}

export const playlistItems = async (q) => {
  const auth = oauth2Client(q.token)
  let service = google.youtube('v3')
  let config = {
    auth,
    part: 'snippet,contentDetails',
    maxResults: 50
  }
  let fn = promisify(service.playlistItems.list).bind(service)
  let response = await fn({ ...config, ...q })
  let songs = (await find({}, { id: 1 })).map(it => it.id.videoId)
  response.data.items = response.data.items.map(item => {
    item.downloaded = songs.indexOf(item.id.videoId) > -1 ? 1 : 0
    return item
  })
  return response.data
}
