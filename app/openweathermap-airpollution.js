const axios = require('axios');

function airPollution(request, response) {

    const openWeatherMapBaseUrl = 'https://api.openweathermap.org/data/2.5/air_pollution/history';
    var url = openWeatherMapBaseUrl + '?appid=' + process.env.OPENWEATHERMAP_KEY;

    if (request.query.lat) {
        url += '&lat=' + request.query.lat;
    }
    if (request.query.lon) {
        url += '&lon=' + request.query.lon;
    }
    if (request.query.start) {
        url += '&start=' + request.query.start;
    }
    if (request.query.end) {
        url += '&end=' + request.query.end;
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

module.exports = airPollution;
