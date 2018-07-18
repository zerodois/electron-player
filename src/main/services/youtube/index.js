import { google } from 'googleapis'
import { token } from '../auth'

const OAuth2 = google.auth.OAuth2
OAuth2.TOKEN = token

export const get = q => {
  var service = google.youtube('v3')
  service.channels.list({
    auth: OAuth2,
    part: 'snippet,contentDetails,statistics',
    forUsername: 'GoogleDevelopers'
  }, (err, response) => {
    if (err) {
      console.log('The API returned an error: ' + err)
      return
    }
    var channels = response.data.items
    if (channels.length === 0) {
      console.log('No channel found.')
    } else {
      console.log('This channel\'s ID is %s. Its title is \'%s\', and it has %s views.',
        channels[0].id,
        channels[0].snippet.title,
        channels[0].statistics.viewCount)
    }
  })
}
