import { google } from 'googleapis'
import { oauth2Client } from '../auth'

export const get = (query) => {
  oauth2Client.credentials = query.token
  var service = google.youtube('v3')
  let config = {
    auth: oauth2Client,
    part: 'snippet',
    maxResults: 10,
    type: ''
  }
  Object.assign(config, query)
  return new Promise((resolve, reject) => {
    service.search.list(config, (err, response) => {
      if (err) {
        return reject(err)
      }
      response.data.items = response.data.items.map(item => {
        item.downloaded = false
        return item
      })
      // console.log('RESPOSTA', JSON.stringify(response.data))
      resolve(response.data.items)
    })
  })
}
