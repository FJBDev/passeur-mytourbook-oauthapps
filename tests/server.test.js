//import { app } from '../server.js';
const app = require('../server');
const supertest = require('supertest');
const requestWithSupertest = supertest(app);

describe('OpenWeatherMap Weather Retrieval', () => {

  it('GET /openweathermap should return 200', async () => {
    const res = await requestWithSupertest.get('/openweathermap/timemachine?units=metric&lat=40.263996&lon=-105.58854099999999&dt=1674755775');
    expect(res.statusCode).toEqual(200);
  });

});

describe('WeatherApi Weather Retrieval', () => {

  it('GET /weatherapi should return 200', async () => {
    const res = await requestWithSupertest.get('/weatherapi?lat=40.552118&lon=-105.135277&unixdt=1650464290&unixend_dt=1650570290&lang=fr');
    expect(res.statusCode).toEqual(200);
  });

});

/* describe('OpenWeatherMap Weather Retrieval', function () {

  test("Should return 200", async () => {

    //expect.hasAssertions();

    const stravaToken = await server.retrieveStravaToken("", "", "");

    expect(stravaToken).toEqual("");
  })

  // This is the name of the test
    it('should understand basic mathematical principles', function (done) {
 
     expect(1 == 1).toBe(true);
     expect(1 == 2).not.toBe(true);
     // We want this test to pass.
     if (5 == 5) {
       // If the behavior is as expected, call done with no argument.
       done();
     } else {
       // Otherwise, call done with an error.
       done(new Error("Not sure what's happened."));
     }
 
   }); 

}); */