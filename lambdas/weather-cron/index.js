const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const axios = require('axios');

const DATA_BUCKET = process.env.DATA_BUCKET_NAME || 'parlicious-data-public';
const TOURNAMENTS_JSON_KEY = 'tournaments.json';
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const WEATHER_API_URL = (lat, lon) => `https://api.darksky.net/forecast/${WEATHER_API_KEY}/${lat},${lon}`;

const getActiveTournaments = async () => {

    const searchParams = {
        Bucket: DATA_BUCKET,
        Key: TOURNAMENTS_JSON_KEY
    };

    const data = await s3.getObject(searchParams).promise();
    return JSON.parse(data.Body).find(t => t.active);
};

const transformWeatherResponse = (apiResponse) => {
    return apiResponse.currently;
};

const getWeather = async (lat, lon) => {
    try{
        const weatherResponse = await axios(WEATHER_API_URL(lat, lon));
        return transformWeatherResponse(weatherResponse.data);
    } catch(e){
        console.log(e);
    }
};

const saveWeather = async (tournament, year, weather) => {
    const params = {
        Bucket: DATA_BUCKET,
        Key: `weather/${tournament}-${year}.json`,
        Body: JSON.stringify(weather),
        ACL: 'public-read'
    };

    return s3.putObject(params).promise();
};

exports.handler = async () => {
    const activeTournament = await getActiveTournaments();
    const weather = await(getWeather(activeTournament.coords.lat, activeTournament.coords.lon));
    await saveWeather(activeTournament.title, activeTournament.year, weather);

    return true;
};

// uncomment for local testing
// exports.handler().then(x => console.log(x));
