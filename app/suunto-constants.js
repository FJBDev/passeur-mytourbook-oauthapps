function define(name, value) {
    Object.defineProperty(exports, name, {
        value: value,
        enumerable: true
    });
}

define("suuntoBaseUrl", 'https://cloudapi.suunto.com/');
define("suuntoBaseV2", 'v2/');
define("suuntoBaseV3", 'v3/');


//TODO FB
// Segregate the strava endpoints

// Unit tests for the workout import (using mock?)