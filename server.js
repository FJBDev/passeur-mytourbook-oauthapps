var PORT = process.env.PORT || 5000;
var express = require('express');
var app = express();
const bodyParser = require('body-parser')
app.use(bodyParser.json());// for parsing application/json
const { AuthorizationCode } = require('simple-oauth2');

const callbackUrl = 'https://passeur-mytourbook-strava.herokuapp.com';
const myTourbookCallbackUrl = 'http://mytourbook.sourceforge.net/mytourbook';

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

app.post("/refreshToken", (request, response) => {
  const { refresh_token } = request.body;

  retrieveToken('refresh_token', '', refresh_token)
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
    scope: 'activity:write'
  });

  res.redirect(authorizationUri);
})

// Callback service parsing the authorization token and asking for the access token
app.get('/', async (request, response) => {

  var requestQuery = request.query;
  const { error, code } = requestQuery;
  var isDenied = error == "access_denied";
  if (isDenied) {
    response.query = requestQuery;
    response.redirect(myTourbookCallbackUrl);
    return;
  }

  options = {
    code,
    grant_type: 'authorization_code'
  };

  try {
    retrieveToken('authorization_code', code, '').then(tokenResponse => {
      console.log(tokenResponse);
      const accessToken = tokenResponse.token.access_token;
      const refreshToken = tokenResponse.token.refresh_token;
      const expires_at = tokenResponse.token.expires_at.getTime();
      const athleteId = tokenResponse.token.athlete.id;
      const athleteFullName = tokenResponse.token.athlete.firstname + ' ' + tokenResponse.token.athlete.lastname;

      response.redirect(myTourbookCallbackUrl +
        '#access_token=' + accessToken +
        '&refresh_token=' + refreshToken +
        '&expires_at=' + expires_at +
        '&athleteId=' + athleteId +
        '&athleteFullName=' + athleteFullName);
    });

  } catch (error) {
    console.error('Access Token Error', error.message);
  }
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
