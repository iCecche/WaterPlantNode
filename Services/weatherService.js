const axios = require("axios");
const moment = require('moment-timezone');

class WeatherService {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.latitude = 43.751028;
        this.longitude = 11.172644;
        this.cachedWeather = {value : 0, timestamp: null}
    }

    async fetchWeather() {

        if (moment.now() - this.cachedWeather.timestamp <  30 * 60 * 1000) {
            return this.cachedWeather.value;
        }

        try {
            const url = `https://api.tomorrow.io/v4/weather/forecast`;
            const params = {
                location: `${this.latitude},${this.longitude}`,
                units: 'metric',
                timesteps: '1h',
                apikey: this.apiKey
            };

            const data = await axios.get(url, {params}).then((response) => response.data);
            const forecast = data.timelines.hourly.slice(3, 15);
            const weatherObject = forecast.find(h => h.values.precipitationProbability > 0);

            if (weatherObject != undefined) {

                this.cachedWeather.value = weatherObject.values.precipitationProbability;
                this.cachedWeather.timestamp = moment.now();

                return this.cachedWeather.value;
            }

            return 0;
        } catch (error) {
            console.error('Error fetching weather data:', error);
            return 0;
        }
    }
}

module.exports = WeatherService;