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
        },
        data: request.body
    };

    axios(config)
        .then(function (result) {
            response.status(error.response.status).send(result.data);
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
