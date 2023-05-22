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

    expect.hasAssertions();

    var yesterdayDate = getYesterdaysDate();
    var dt = Math.floor(yesterdayDate.getTime() / 1000);

    const res = await requestWithSupertest.get('/openweathermap/timemachine?units=metric&lat=40.26&lon=-105.58&dt=' + dt);

    expect(res.status).toEqual(200);
  });

});

// describe('OpenWeatherMap Air Quality Retrieval', () => {

//   test('GET /openweathermap should return 200', async () => {

//     expect.hasAssertions();

//     var yesterdayDate = getYesterdaysDate();
//     var start = Math.floor(yesterdayDate.getTime() / 1000);
//     var end = start + 3600;

//     const res = await requestWithSupertest.get('/openweathermap/air_pollution?lat=40.26&lon=-105.58&start=' + start +
//       '&end=' + end);

//     expect(res.status).toEqual(200);
//   });

// });

describe('WeatherApi Weather Retrieval', () => {

  test('GET /weatherapi should return 200', async () => {

    expect.hasAssertions();

    var yesterdayDate = getYesterdaysDate();
    var dt = yesterdayDate.toISOString().split('T')[0];

    const res = await requestWithSupertest.get('/weatherapi?lat=40.26&lon=-105.58&dt=' + dt);

    expect(res.status).toEqual(200);
  });

});
