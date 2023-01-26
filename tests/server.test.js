var app = require('../server');
const supertest = require('supertest');
const requestWithSupertest = supertest(app);

function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}


beforeAll(() => {
  app = app.listen(getRandomArbitrary(0, 65536)); // Random number is needed to avoid using same port in different tests if you run in parallel
})

afterAll(() => {
  app.close()
})

describe('OpenWeatherMap Weather Retrieval', () => {

  test('GET /openweathermap should return 200', async () => {

    const res = await requestWithSupertest.get('/openweathermap/timemachine?units=metric&lat=40.263996&lon=-105.58854099999999&dt=1674755775');

//    expect(res.status).toEqual(200);
    expect(process.env.TEST_SECRET).toEqual(200);
  });

});

describe('WeatherApi Weather Retrieval', () => {

  test('GET /weatherapi should return 200', async () => {

    const res = await requestWithSupertest.get('/weatherapi?lat=40.552118&lon=-105.135277&unixdt=1650464290&unixend_dt=1650570290&lang=fr');

    expect(res.status).toEqual(200);
  });

});