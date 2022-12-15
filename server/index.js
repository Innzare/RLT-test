const express = require('express');
const qs = require('qs');
const axios = require('axios');

const app = express();
const port = 3000;

const WEATHER_API = 'https://api.openweathermap.org/data/2.5/onecall';
const CITIES_API = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
const WEATHER_KEY = '4f973ea0001b6c8ce19c094023bd13f4';

app.get('/', (request, response) => {
  response.set('Access-Control-Allow-Origin', '*');

  let query = request.query;
  query.appid = WEATHER_KEY;

  const queryString = qs.stringify(query);

  axios.get(`${WEATHER_API}?${queryString}`).then((weather) => {
    response.send(weather.data);
  });
});

app.listen(port, () => {
  console.log('Listening');
});
