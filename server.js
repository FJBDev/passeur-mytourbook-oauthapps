var PORT = process.env.PORT || 5000;
var express = require('express');
var axios = require('axios');
var qs = require('qs');
var app = express();
const bodyParser = require('body-parser')
app.use(bodyParser.json({ limit: '50mb', extended: true }));// for parsing application/json
const { AuthorizationCode } = require('simple-oauth2');

const stravaClient = new AuthorizationCode({
  client: {
    id: process.env.STRAVA_CLIENT_ID,
    secret: process.env.STRAVA_CLIENT_SECRET
  },
  auth: {
    tokenHost: 'https://www.strava.com/api/v3'
  },
  options: {
    authorizationMethod: 'body'
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

  const suuntoCallbackUrl = 'http://localhost:4919';

  var data = qs.stringify({
    'grant_type': grant_type,
    'code': code,
    'redirect_uri': suuntoCallbackUrl,
    'refresh_token': refresh_token
  });

  var clientId = process.env.SUUNTO_CLIENT_ID;
  var clientSecret = process.env.SUUNTO_CLIENT_SECRET;
  var authorizationHeader = 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64');
  var config = {
    method: 'post',
    url: 'https://cloudapi-oauth.suunto.com/oauth/token',
    headers: {
      'Authorization': authorizationHeader,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: data,
  };

  axios(config)
    .then(function (result) {
      response.status(201).send(result.data);
    })
    .catch(function (error) {
      console.log(error);
      response.status(400).send();
    });
})

const suuntoBaseUrl = 'https://cloudapi.suunto.com/v2';

app.post("/suunto/route/import", async (request, response) => {

  const { authorization } = request.headers;

  var config = {
    method: 'post',
    url: suuntoBaseUrl + '/route/import',
    headers: {
      'Authorization': authorization,
      'Content-Type': 'application/gpx+xml',
      'Ocp-Apim-Subscription-Key': process.env.SUUNTO_SUBSCRIPTION_KEY
    },
    data: Buffer.from(request.body.gpxRoute, "base64").toString()
  };

  axios(config)
    .then(function (result) {
      response.status(201).send(result.data);
    })
    .catch(function (error) {
      if (error.response) {
        response.status(error.response.status).send(error.message);
      } else {
        response.status(400).send(error.message);
      }
    });
})

app.get("/suunto/workouts", async (request, response) => {

  const { authorization } = request.headers;

  var config = {
    method: 'get',
    url: suuntoBaseUrl + '/workouts?limit=10000filter-by-modification-time=false',
    headers: {
      'Authorization': authorization,
      'Ocp-Apim-Subscription-Key': process.env.SUUNTO_SUBSCRIPTION_KEY
    }
  };

  axios(config)
    .then(function (result) {
      response.status(200).send(result.data);
    })
    .catch(function (error) {
      if (error.response) {
        response.status(error.response.status).send(error.message);
      } else {
        response.status(400).send(error.message);
      }
    });
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

app.get('/', async (request, response) => {
  response.redirect('http://mytourbook.sourceforge.net/mytourbook/');
})
