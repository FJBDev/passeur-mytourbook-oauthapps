function define(name, value) {
    Object.defineProperty(exports, name, {
        value: value,
        enumerable: true
    });
}

define("suuntoBaseV2", 'https://cloudapi.suunto.com/v2/');
define("suuntoBaseV3", 'https://cloudapi.suunto.com/v3/');


//TODO FB 

// Segregate the strava endpoints

// Unit tests for the workout import (using mock?)