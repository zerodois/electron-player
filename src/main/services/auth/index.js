import { google } from 'googleapis'

const token = require('./client_secret.json')
const OAuth2 = google.auth.OAuth2

const SCOPES = ['https://www.googleapis.com/auth/youtube']
const clientSecret = token.installed.client_secret
const clientId = token.installed.client_id
const redirectUrl = token.installed.redirect_uris[0]

const client = new OAuth2(clientId, clientSecret, redirectUrl)
export const oauth2Client = (token) => {
  if (!Object.keys(client.credentials).length) {
    client.setCredentials(token)
  }
  return client
}

export const genAuthUrl = () => {
  client.credentials = {}
  return client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  })
}

export const revoke = () => {
  return client.revokeCredentials()
}

export const decode = async (code) => {
  const { tokens } = await client.getToken(code)
  client.setCredentials(tokens)
  return tokens
}

client.on('tokens', (tokens) => {
  if (tokens.refresh_token) {
    client.setCredentials({
      refresh_token: `STORED_REFRESH_TOKEN`
    })
    console.log(tokens.refresh_token)
  }
  console.log('OK ::::::', tokens)
})
