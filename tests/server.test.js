import { app } from '../server.js'
const supertest = require('supertest');
const requestWithSupertest = supertest(app);

describe('User Endpoints', () => {

  it('GET /user should show all users', async () => {
    const res = await requestWithSupertest.get();//'weatherapi?lat=40.263996&lon=-105.58854099999999&dt=2023-01-24&lang=fr');
    expect(res.status).toEqual(200);
    //expect(res.type).toEqual(expect.stringContaining('json'));
    //expect(res.body).toHaveProperty('users')
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