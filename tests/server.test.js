var app = require('../server');
const supertest = require('supertest');
const requestWithSupertest = supertest(app);

function getRandomArbitrary(min, max) {

  return Math.floor(Math.random() * (max - min) + min);
}

function getYesterdaysDate() {

  var yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);

  return yesterdayDate
}

beforeAll(() => {
  app = app.listen(getRandomArbitrary(0, 65536)); // Random number is needed to avoid using same port in different tests if you run in parallel
})

afterAll(() => {
  app.close()
})

describe('OpenWeatherMap Weather Retrieval', () => {

  test('GET /openweathermap should return 200', async () => {

    var yesterdayDate = getYesterdaysDate();
    var dt = Math.floor(yesterdayDate.getTime() / 1000);

    const res = await requestWithSupertest.get('/openweathermap/timemachine?units=metric&lat=40.263996&lon=-105.58854099999999&dt=' + dt);

    expect(res.status).toEqual(200);
  });

});

describe('WeatherApi Weather Retrieval', () => {

  test('GET /weatherapi should return 200', async () => {

    var yesterdayDate = getYesterdaysDate();
    var dt = yesterdayDate.toISOString().split('T')[0];

    const res = await requestWithSupertest.get('/weatherapi?lat=40.263996&lon=-105.58854099999999&dt=' + dt + '&lang=fr');

    expect(res.status).toEqual(200);
  });

});