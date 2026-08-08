let PORT = process.env.PORT || 5000;
let express = require('express');
let axios = require('axios');
let qs = require('qs');
const xss = require('xss');
let app = express();
const bodyParser = require('body-parser')
app.use(bodyParser.json({ limit: '50mb', extended: true }));// for parsing application/json
const { AuthorizationCode } = require('simple-oauth2');

const openWeatherMap3 = require('./app/openweathermap3.js');
const openWeatherMapAirPollution = require('./app/openweathermap-airpollution.js');

const { initializeUpload, getUploadStatus } = require('./app/suunto-workout-upload.js');
const { listWorkouts, exportWorkoutFit } = require('./app/suunto-workout-retrieval.js');

app.listen(PORT, () => {
  console.log(`Currently listening to any requests from MyTourbook`);
})

app.get('/', async (request, response) => {
  response.redirect('http://mytourbook.sourceforge.net/mytourbook/');
})

app.post("/suunto/token", async (request, response) => {

  const { code, refresh_token, grant_type } = request.body;

  const suuntoCallbackUrl = 'http://localhost:4919';

  let data = qs.stringify({
    'grant_type': grant_type,
    'code': code,
    'redirect_uri': suuntoCallbackUrl,
    'refresh_token': refresh_token
  });

  let clientId = process.env.SUUNTO_CLIENT_ID;
  let clientSecret = process.env.SUUNTO_CLIENT_SECRET;
  let authorizationHeader = `Basic ${Buffer.from(clientId + ':' + clientSecret).toString('base64')}`;
  let config = {
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
      if (error.response) {
        response.status(error.response.status).send(error.message);
      } else {
        response.status(400).send(error.message);
      }
    });
})

const suuntoBaseUrl = 'https://cloudapi.suunto.com/v2';
app.post("/suunto/route/import", async (request, response) => {

  const { authorization } = request.headers;

  let config = {
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

//TODO FB To deprecate 2 versions after MT 25.8
app.get("/suunto/workout/exportFit", async (request, response) => {

  const { authorization } = request.headers;

  let url = `${suuntoBaseUrl}/workout/exportFit/${xss(request.query.workoutKey)}`;

  let config = {
    method: 'get',
    url: url,
    headers: {
      'Authorization': authorization,
      'Ocp-Apim-Subscription-Key': process.env.SUUNTO_SUBSCRIPTION_KEY
    },
    responseType: 'arraybuffer',
    responseEncoding: 'binary'
  };

  const contentDisposition = 'content-disposition';
  axios(config)
    .then(function (result) {
      response.setHeader(contentDisposition, result.headers[contentDisposition]);

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

app.use("/openweathermap/3.0/timemachine", async (request, response) => openWeatherMap3(request, response, true));
app.use("/openweathermap/3.0/current", async (request, response) => openWeatherMap3(request, response, false));
app.use("/openweathermap/air_pollution", async (request, response) => openWeatherMapAirPollution(request, response));

app.post("/suunto/workout/upload", async (request, response) => initializeUpload(request, response));
app.get("/suunto/workout/upload/:Id", async (request, response) => getUploadStatus(request, response));
app.get("/suunto/workouts", async (request, response) => listWorkouts(request, response));
app.get("/suunto/workouts/:Id/fit", async (request, response) => exportWorkoutFit(request, response));

app.get("/weatherapi", async (request, response) => {

  const weatherApiBaseUrl = 'http://api.weatherapi.com/v1/history.json';
  let url = `${weatherApiBaseUrl}?key=${process.env.WEATHERAPI_KEY}`;

  if (request.query.lat) {
    url += `&q=${xss(request.query.lat)}`;
  }
  if (request.query.lon) {
    url += `,${xss(request.query.lon)}`;
  }
  if (request.query.dt) {
    url += `'&dt=${xss(request.query.dt)}`;
  }
  if (request.query.end_dt) {
    url += `&end_dt=${xss(request.query.end_dt)}`;
  }
  if (request.query.lang) {
    url += `&lang=${xss(request.query.lang)}`;
  }

  let config = {
    method: 'get',
    url: url
  };

  axios(config)
    .then(function (result) {
      response.status(200).send(result.data);
    })
    .catch(function (error) {
      if (error.response) {
        response.status(error.response.status).send(error.response.data);
      } else {
        response.status(400).send(error.message);
      }
    });
})

module.exports = app;