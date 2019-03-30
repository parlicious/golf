const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const errors = {
    tooFewOfTier: (tier) => `Too few picks for tier ${tier}`,
    tooManyOfTier: (tier) => `Too many picks for tier ${tier}`,
    missingRequired: (val) => `Missing required value: ${val}`
};

const DATA_BUCKET = 'parlicious-data';

const generateErrorResponse = (errors) => {
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

const requiredPlayerPickValues = [
    'guid',
    'tournament',
    'year',
    'name',
    'editKey',
    'picks'
];

const validateRequiredFields = (pickRequest, requiredFields) => {
    return requiredFields
        .filter((field) => !pickRequest[field])
        .map(errors.missingRequired)
};

const validatePicksMeetTierRequirements = (picksRequest, tierRequirements) => {
    if (picksRequest.hasOwnProperty("picks")) {
        const tierCount = picks.reduce((acc, val) => {
            if (acc.hasOwnProperty(val.tier)) {
                acc[val.tier]++;
            } else {
                acc[val.tier] = 1;
            }
        }, {});

        return Object.keys(tierRequirements)
            .map((k) => {
                return [k, tierRequirements[k] - tierCount[k]]
            })
            .filter(n => n[1])
            .map(n => n[1] > 0 ? errors.tooFewOfTier(n[0]) : errors.tooManyOfTier(n[0]))
    } else {
        return ['No picks sent'];
    }
};

const validatePicksRequest = (pickRequest, tierRequirements) => {
    const missingRequiredFields = validateRequiredFields(pickRequest, requiredPlayerPickValues);
    const tierRequirementsNotMet = validatePicksMeetTierRequirements(pickRequest, tierRequirements);
    return missingRequiredFields.concat(tierRequirementsNotMet);
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


exports.handler = async (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    const body = JSON.parse(event.body);
    const missingFields = validateRequiredFields(body, requiredPlayerPickValues);

    // validate request

    if (missingFields.length !== 0) {
        return generateErrorResponse(missingFields)
    }

    // check for existing pick w/ this email
    const existingPicks = await listExistingIndividualPicks(body.tournament, body.year);
    const existingPickKey = existingPicks.find(e => e.email === body.email).key;

    // validate edit key
    if (existingPickKey) {
        const existingPick = await getPick(existingPickKey);
        return {
            statusCode: '200',
            body: JSON.stringify(existingPick),
            headers: {
                'Content-Type': 'application/json',
            }
        }
    } else {
        return {
            statusCode: '200',
            body: JSON.stringify(existingPicks),
            headers: {
                'Content-Type': 'application/json',
            }
        }
    }

    // switch (event.httpMethod) {
    //     case 'DELETE':
    //         console.log('Delete');
    //         done(false, JSON.parse(event.body));
    //         break;
    //     case 'GET':
    //         console.log('Get');
    //         done(false, JSON.parse(event.body));
    //         break;
    //     case 'POST':
    //         console.log('Post');
    //         done(false, JSON.parse(event.body));
    //         break;
    //     case 'PUT':
    //         console.log('Put');
    //         done(false, JSON.parse(event.body));
    //         break;
    //     default:
    //         done(new Error(`Unsupported method "${event.httpMethod}"`));
    // }
};
