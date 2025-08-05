const axios = require('axios');
var constants = require("./suunto-constants");

function listWorkouts(request, response) {

    const { authorization } = request.headers;

    var url = constants.SUUNTO_BASE_V3 + '/workouts?limit=10000&filter-by-modification-time=false';
    if (request.query.since) {
        url += '&since=' + xss(request.query.since);
    }
    if (request.query.until) {
        url += '&until=' + xss(request.query.until);
    }
    var config = {
        method: 'get',
        url: url,
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
}

function exportWorkoutFit(request, response) {

    const { authorization } = request.headers;

    var url = constants.SUUNTO_BASE_V3 + '/workout/' + xss(request.query.workoutKey) + '/fit';

    var config = {
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
}

module.exports = { listWorkouts, exportWorkoutFit };
