import { test, expect } from '@playwright/test';

test("GET, /api/forecast", async ({ request }) => { 
    //create the constant variable to store the url and the response of the api call.
    const apiURL = 'https://api.open-meteo.com/v1';
    const response = await request.get(`${apiURL}/forecast?latitude=14.4445&longitude=120.9939&current_weather=true`);

    //check if the response status is 200.
    expect(response.status()).toBe(200);
    console.log("API call successful, status code: ", response.status());
    
    //check the content of the response body.
    const responseBody = await response.json();
    //console.log("Response body: ", responseBody);
    //console log to debug the response body and check if it contains the expected properties.

    //check the timezone in the response body. 
    expect(responseBody.timezone).toBe("GMT");
    console.log("Timezone is correct: ", responseBody.timezone);

    //check the latitude and longitude in the response body.
    expect(responseBody.latitude).toBe(14.375);
    expect(responseBody.longitude).toBe(121);
    console.log(`Latitude and Longitude are correct: ${responseBody.latitude}, ${responseBody.longitude}`);



});



