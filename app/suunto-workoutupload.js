const axios = require('axios');

function initializeUpload(request, response) {

    const { authorization } = request.headers;

    var config = {
        method: 'post',
        url: 'https://cloudapi.suunto.com/v2/upload/',
        headers: {
            'Authorization': authorization,
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': process.env.SUUNTO_SUBSCRIPTION_KEY
        }
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
}

module.exports = initializeUpload;
