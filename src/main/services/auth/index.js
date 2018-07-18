import fs from 'fs'
import path from 'path'
import { google } from 'googleapis'
const OAuth2 = google.auth.OAuth2

const SCOPES = ['https://www.googleapis.com/auth/youtube.readonly']
const TOKEN_DIR = `${process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE}/.credentials/`
const TOKEN_PATH = `${TOKEN_DIR}react-player.json`
const LOCAL = path.resolve('.', 'client_secret.json')

export let token = JSON.parse(fs.readFileSync(LOCAL, 'utf8'))
const clientSecret = token.installed.client_secret
const clientId = token.installed.client_id
const redirectUrl = token.installed.redirect_uris[0]
const oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl)

// const authorize = (callback) => {
//   fs.readFile(TOKEN_PATH, (err, resp) => {
//     if (err) {
//       return getNewToken(oauth2Client, callback)
//     }
//     oauth2Client.TOKEN = JSON.parse(resp)
//     callback(oauth2Client)
//   })
// }

export const genAuthUrl = () => {
  if (!token) {
    throw new Error('local file not found')
  }
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  })
}

export const store = resp => {
  oauth2Client.credentials = resp
  token = resp
  return storeToken(token)
}

// function getNewToken (oauth2Client, callback) {
//   const authUrl = oauth2Client.generateAuthUrl({
//     access_type: 'offline',
//     scope: SCOPES
//   })
//   console.log('Authorize this app by visiting this url: ', authUrl)
//   var rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
//   })
//   rl.question('Enter the code from that page here: ', function(code) {
//     rl.close()
//     oauth2Client.getToken(code, function(err, token) {
//       if (err) {
//         console.log('Error while trying to retrieve access token', err)
//         return
//       }
//       callback(oauth2Client)
//     })
//   })
// }

const storeToken = token => {
  if (!fs.existsSync(TOKEN_DIR)) {
    fs.mkdirSync(TOKEN_DIR)
  }
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(token), 'utf8')
}

// /**
//  * Lists the names and IDs of up to 10 files.
//  *
//  * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
//  */
// function getChannel(auth) {
//   var service = google.youtube('v3')
//   service.channels.list({
//     auth: auth,
//     part: 'snippet,contentDetails,statistics',
//     forUsername: 'GoogleDevelopers'
//   }, function(err, response) {
//     if (err) {
//       console.log('The API returned an error: ' + err)
//       return
//     }
//     var channels = response.data.items
//     if (channels.length == 0) {
//       console.log('No channel found.')
//     } else {
//       console.log('This channel\'s ID is %s. Its title is \'%s\', and ' +
//                   'it has %s views.',
//                   channels[0].id,
//                   channels[0].snippet.title,
//                   channels[0].statistics.viewCount)
//     }
//   })
// }
