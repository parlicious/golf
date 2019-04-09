/*
Listens for events on the picks s3 bucket, and updates the aggregate picks
object with all of the individual picks in a tournament
 */

const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const crypto = require('crypto');

const DATA_BUCKET = process.env.DATA_BUCKET_NAME || 'parlicious-data';
const TOURNAMENTS_JSON_KEY = 'tournaments.json';

const getActiveTournaments = async () => {

    const searchParams = {
        Bucket: DATA_BUCKET,
        Key: TOURNAMENTS_JSON_KEY
    };

    const data = await s3.getObject(searchParams).promise();
    return JSON.parse(data.Body).find(t => t.active);
};

const getPick = async (key) => {
    console.log(key);
    const params = {
        Bucket: DATA_BUCKET,
        Key: key
    };

    let data;
    try {
        data = await s3.getObject(params).promise();
    } catch (e) {
        console.log(e);
    }

    return JSON.parse(data.Body);
};

const getAllIndividualPicks = async (tournament, year) => {
    const prefix = `picks/${tournament}/${year}/individual`;

    const searchParams = {
        Bucket: DATA_BUCKET,
        Prefix: prefix
    };


    let data;
    try {
        data = await s3.listObjectsV2(searchParams).promise();
    } catch (e) {
        console.log(e);
    }

    return Promise.all(data.Contents
        .map(d => d.Key)
        .filter(k => !k.endsWith('/'))
        .map(getPick));
};

const hashPicks = (picks) => {
    return crypto.createHash('sha256')
        .update(JSON.stringify(picks))
        .digest('hex');
};

const saveAggregatePicks = async (tournament, year, picksObj) => {
    const params = {
        Bucket: DATA_BUCKET,
        Key: `picks/${tournament}/${year}/picks.json`,
        Body: JSON.stringify(picksObj),
        ACL: 'public-read'
    };

    await s3.putObject(params).promise();
};

exports.handler = async () => {

    // TODO: determine tournament (will do them all for now)

    // get all individual picks for that tournament
    const activeTournament = await getActiveTournaments();
    const individualPicks = (await getAllIndividualPicks(activeTournament.title, activeTournament.year))
        .map((p) => {
            p.editKey = '';
            return p;
        });

    const picks = {
        "hash": hashPicks(individualPicks),
        "timestamp": Date.now(),
        "pool_participants": individualPicks
    };

    // save it
    await saveAggregatePicks(activeTournament.title, activeTournament.year, picks);

    return true;
};
