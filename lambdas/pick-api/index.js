const AWS = require('aws-sdk');
const s3 = new AWS.S3();


exports.handler = async (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    const body = JSON.parse(event.body);
    const tournament = body['tournament'];
    const year = body['year'];
    const prefix = `picks/${tournament}/${year}/individual`;

    const searchParams = {
        Bucket: 'parlicious-data',
        Prefix: prefix
    };


    let data;
    try {
        data = await s3.listObjectsV2(searchParams).promise();
    } catch (e) {
        console.log(e);
    }

    data.Contents.forEach((o) => {
        console.log(o);
    });

    return {
        statusCode: '200',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
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
