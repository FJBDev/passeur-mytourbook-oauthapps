var PORT = process.env.PORT || 5000;
var express = require('express');
var app = express();
const bodyParser = require('body-parser')
app.use(bodyParser.json());// for parsing application/json
const { AuthorizationCode } = require('simple-oauth2');

const stravaClient = new AuthorizationCode({
  client: {
    id: process.env.STRAVA_CLIENT_ID,
    secret: process.env.STRAVA_CLIENT_SECRET
  },
  auth: {
    tokenHost: 'https://www.strava.com/api/v3',
    tokenPath: '/oauth/token'
  },
  options: {
    authorizationMethod: 'body',
  },
});

const suuntoCallbackUrl = 'http://localhost:4919';
const suuntoClient = new AuthorizationCode({
  client: {
    id: process.env.SUUNTO_CLIENT_ID,
    secret: process.env.SUUNTO_CLIENT_SECRET
  },
  auth: {
    tokenHost: 'https://cloudapi-oauth.suunto.com/oauth',
    tokenPath: '/token'
  }
});

app.post("/strava/token", async (request, response) => {
  const { code, refresh_token, grant_type } = request.body;

  const tokenResponse = await retrieveStravaToken(grant_type, code, refresh_token);

  if (tokenResponse == null) {
    response.status(400).send();
    return;
  }

  let tokenCopy = JSON.parse(JSON.stringify(tokenResponse));
  tokenCopy.expires_at = tokenResponse.token.expires_at.getTime().toString();

  response.status(201).send(tokenCopy);
})

app.post("/suunto/token", async (request, response) => {
  const { code, refresh_token, grant_type } = request.body;

  const tokenResponse = await retrieveSuuntoToken(grant_type, code, refresh_token);

  if (tokenResponse == null) {
    response.status(400).send();
    return;
  }

  let tokenCopy = JSON.parse(JSON.stringify(tokenResponse));
  tokenCopy.expires_at = tokenResponse.token.expires_at.getTime().toString();

  response.status(201).send(tokenCopy);
})

app.listen(PORT, () => {
  console.log(`Currently listening to any requests from MyTourbook`);
})

async function retrieveStravaToken(grantType, code, refreshToken) {
  options = {
    code: code,
    refresh_token: refreshToken,
    grant_type: grantType
  };

  try {

    const tokenResponse = await stravaClient.getToken(options);

    return tokenResponse;
  } catch (error) {
    console.error('Access Token Error', error.message);
  }
}

async function retrieveSuuntoToken(grantType, code, refreshToken) {
  options = {
    code: code,
    refresh_token: refreshToken,
    grant_type: grantType,
    redirect_uri: suuntoCallbackUrl
  };

  try {

    const tokenResponse = await suuntoClient.getToken(options);

    return tokenResponse;
  } catch (error) {
    console.error('Access Token Error', error.message);
  }
}

app.get('/', async (request, response) => {
  response.redirect('http://mytourbook.sourceforge.net/mytourbook/');
})
