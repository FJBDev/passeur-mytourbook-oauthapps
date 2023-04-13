const axios = require('axios');
const { suuntoBaseUrl } = require('./suunto-constants');

function initializeUpload(request, response) {

    const { authorization } = request.headers;

    var config = {
        method: 'post',
        url: suuntoBaseUrl + 'upload/',
        headers: {
            'Authorization': authorization,
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': process.env.SUUNTO_SUBSCRIPTION_KEY
        },
        data: request.body
    };

    axios(config)
        .then(function (result) {
            response.status(result.status).send(result.data);
        })
        .catch(function (error) {
            if (error.response) {
                response.status(error.response.status).send(error.response.data.message);
            } else {
                response.status(400).send(error.message);
            }
        });
}

function getUploadStatus(request, response) {

    const { authorization } = request.headers;

    var url = suuntoBaseUrl + 'upload/';

    if (request.query.id) {
        url += request.query.id;
    }

    var config = {
        method: 'get',
        url: url,
        headers: {
            'Authorization': authorization,
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': process.env.SUUNTO_SUBSCRIPTION_KEY
        },
        data: request.body
    };

    axios(config)
        .then(function (result) {
            response.status(result.status).send(result.data);
        })
        .catch(function (error) {
            if (error.response) {
                response.status(error.response.status).send(error.response.data.message);
            } else {
                response.status(400).send(error.message);
            }
        });
}

module.exports = initializeUpload;
module.exports = getUploadStatus;
