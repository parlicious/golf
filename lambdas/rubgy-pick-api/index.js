const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const lambda = new AWS.Lambda();

const standardHeaders = {
    'Content-Type': 'application/json',
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS, DELETE",
    "Access-Control-Allow-Headers": "Content-Type, Accept, Origin, Referer, User-Agent",
    "Access-Control-Expose-Headers:": "*",
    "Access-Control-Max-Age": 86400,
};

const errors = {
    tooFewOfTier: (tier) => `Too few picks for tier ${tier}`,
    tooManyOfTier: (tier) => `Too many picks for tier ${tier}`,
    missingRequired: (val) => `Missing required value: ${val}`
};

const DATA_BUCKET = process.env.DATA_BUCKET_NAME || 'parlicious-data-public';
const TOURNAMENTS_KEY = 'tournaments.json';
const AGGREGATION_LAMBDA = 'picks-aggregator';

const multipleErrors = (errors) => {
    const responseBody = {
        message: `There was ${errors.length === 1 ? 'an error' : 'some errors'} with your request`,
        errors: errors
    };
    return {
        statusCode: '400',
        body: JSON.stringify(responseBody),
        headers: {
            'Content-Type': 'application/json',
        }
    }
};

const fail = (message, statusCode = '400') => {
    const responseBody = {
        message
    };

    return {
        statusCode: statusCode,
        body: JSON.stringify(responseBody),
        headers: {
            ...standardHeaders,
        }
    }
};

const success = (responseBody) => {
    return {
        statusCode: '200',
        body: JSON.stringify(responseBody),
        headers: {
            ...standardHeaders,
        }
    }
};


const requiredPlayerPickValues = [
    'name',
    'editKey',
    'picks',
    'email'
];

const requiredPlayerPickQueryValues = [
    'tournament',
    'year',
    'email',
];

const validateRequiredFields = (pickRequest, requiredFields) => {
    return requiredFields
        .filter((field) => !pickRequest[field])
        .map(errors.missingRequired)
};

const shouldAcceptPicks = () => {
    return 1568976300000 - Date.now() > 0;
};

const getTierRequirements = async (tournament, year) => {
    const key = `picks/${tournament}/${year}/tournament_info.json`;

    const params = {
        Bucket: DATA_BUCKET,
        Key: key
    };

    let data;
    try {
        data = await s3.getObject(params).promise();
        return JSON.parse(data.Body).picks_per_tier;
    } catch (e) {
        console.log(e);
    }
};

const listExistingIndividualPicks = async (tournament, year) => {
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

    return data.Contents
        .map(o => [o.Key, o.Key])
        .map(s => [s[0].split('/'), s[1]])
        .map(a => [a[0][a[0].length - 1], a[1]])
        .filter(s => s[0])
        .map(s => {
            return {key: s[1], email: s[0]}
        });
};

const getPick = async (key) => {
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

const savePicks = async (key, picks) => {

    const params = {
        Bucket: DATA_BUCKET,
        Key: key,
        Body: JSON.stringify(picks)
    };

    await s3.putObject(params).promise();
};

const saveNewPicks = async (picks) => {
    const key = `picks/${picks.tournament}/${picks.year}/individual/${picks.email}`;
    await savePicks(key, picks)
};

const triggerAggregation = async () => {
    try {
        await lambda.invoke({
            FunctionName: AGGREGATION_LAMBDA,
            Payload: ""
        }).promise()
    } catch (e) {
        console.log('triggering aggregation failed')
    }
};

const handleGet = async (event) => {
    const body = event.queryStringParameters;
    const missingFields = validateRequiredFields(body, requiredPlayerPickQueryValues);

    // validate request
    if (missingFields.length !== 0) {
        return multipleErrors(missingFields)
    }

    // check for existing pick w/ this email
    const existingPicks = await listExistingIndividualPicks(body.tournament, body.year);
    const picksFound = existingPicks.find(e => e.email === body.email);

    if (picksFound) {
        const existingPickKey = picksFound.key;
        const existingPick = await getPick(existingPickKey);
        existingPick.editKey = '****masked****';
        return success(existingPick);
    } else {
        return fail('No picks found for this email', '404');
    }
};

function getRugbyPickErrors(picks) {
    return null;
}

const handlePost = async (event) => {
    const body = JSON.parse(event.body);
    const missingFields = validateRequiredFields(body, requiredPlayerPickValues);

    // validate request
    if (missingFields.length !== 0) {
        return multipleErrors(missingFields)
    }

    // validate tournament is still accepting picks
    if(getRugbyPickErrors(body.picks)){
        fail('Errors with your picks', '400');
    }

    if (!shouldAcceptPicks()) {
        return fail('Picks are no longer accepted for this tournament', '403');
    }

    // check for existing pick w/ this email
    const existingPicks = await listExistingIndividualPicks('rugby-world-cup', '2019');
    const picksFound = existingPicks.find(e => e.email === body.email);

    if (picksFound) {
        const existingPickKey = picksFound.key;
        const existingPick = await getPick(existingPickKey);

        // validate edit key
        if (body.editKey === existingPick.editKey) {
            try {
                // update existing picks
                await savePicks(existingPickKey, body)
                await triggerAggregation();
            } catch (e) {
                console.log(e);
                return fail('Unable to update picks');
            }
        } else {
            return fail('EditKey is incorrect', '403');
        }
        return success(existingPick);
    } else {

        // save new picks
        await saveNewPicks(body);
        await triggerAggregation();
        return success(body);
    }
};

const handleOptions = async (event) => {
    return success({});
};


exports.handler = async (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    switch (event.httpMethod) {
        case 'POST':
            return handlePost(event);
        case 'GET':
            return handleGet(event);
        case 'OPTIONS':
            return handleOptions(event);
        default:
            return fail('Method Not Allowed', '405')
    }
};
