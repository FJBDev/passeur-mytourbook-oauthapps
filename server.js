var PORT = process.env.PORT || 5000;
var express = require('express');
var app = express();
const bodyParser = require('body-parser')
app.use(bodyParser.json());// for parsing application/json
const { AuthorizationCode } = require('simple-oauth2');

const callbackUrl = 'http://mytourbook.sourceforge.net';

const client = new AuthorizationCode({
  client: {
    id: process.env.STRAVA_CLIENT_ID,
    secret: process.env.STRAVA_CLIENT_SECRET
  },
  auth: {
    tokenHost: 'https://www.strava.com/api/v3',
    authorizeHost: 'https://www.strava.com/oauth',
    tokenPath: '/oauth/token',
    authorizePath: '/oauth/authorize',
  },
  options: {
    authorizationMethod: 'body',
  },
});

app.post("/token", (request, response) => {
  const { code, refresh_token, grant_type } = request.body;

  retrieveToken(grant_type, code, refresh_token)
    .then(tokenResponse => {
      let tokenCopy = JSON.parse(JSON.stringify(tokenResponse));
      tokenCopy.expires_at = tokenResponse.token.expires_at.getTime().toString();
      response.status(201).send(tokenCopy);
    });
})

// Initial page redirecting to Strava
app.get("/authorize", async (req, res) => {

  const authorizationUri = client.authorizeURL({
    redirect_uri: callbackUrl,
    response_type: 'code',
    scope: 'read,activity:write'
  });

  res.redirect(authorizationUri);
})

app.listen(PORT, () => {
  console.log(`Currently listening to any requests from MyTourbook`);
})


async function retrieveToken(grantType, code, refreshToken) {
  options = {
    code: code,
    refresh_token: refreshToken,
    grant_type: grantType
  };

  try {
    const tokenResponse = await client.getToken(options);

    return tokenResponse;
  } catch (error) {
    console.error('Access Token Error', error.message);
  }
}
