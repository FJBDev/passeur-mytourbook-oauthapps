const axios = require('axios');
const xss = require('xss');

function timeMachine(request, response) {

    if (!request.query.units || xss(request.query.units) !== 'metric') {
        response.status(400).send("Error");
        return;
    }
    const openWeatherMapBaseUrl = 'https://api.openweathermap.org/data/2.5/onecall/timemachine';
    var url = openWeatherMapBaseUrl + '?units=metric&appid=' + process.env.OPENWEATHERMAP_KEY;

    if (request.query.lat) {
        url += '&lat=' + xss(request.query.lat);
    }
    if (request.query.lon) {
        url += '&lon=' + xss(request.query.lon);
    }
    if (request.query.dt) {
        url += '&dt=' + xss(request.query.dt);
    }
    if (request.query.lang) {
        url += '&lang=' + xss(request.query.lang);
    }

    var config = {
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
}

module.exports = timeMachine;

