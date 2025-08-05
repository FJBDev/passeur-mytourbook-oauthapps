const axios = require('axios');
var constants = require("./suunto-constants");

function initializeUpload(request, response) {

    const { authorization } = request.headers;

    var config = {
        method: 'post',
        url: constants.SUUNTO_BASE_V2 + '/upload/',
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

    var url = constants.SUUNTO_BASE_V2 + '/upload/';
    if (request.params.Id) {
        url += request.params.Id;
    }

    var config = {
        method: 'get',
        url: url,
        headers: {
            'Authorization': authorization,
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': process.env.SUUNTO_SUBSCRIPTION_KEY
        }
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

module.exports = { initializeUpload, getUploadStatus };
