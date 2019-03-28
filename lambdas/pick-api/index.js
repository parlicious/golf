const AWS = require('aws-sdk');
const s3 = new AWS.S3();
/**

 */
exports.handler = (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    const done = (err, res) => callback(null, {
        statusCode: err ? '400' : '200',
        body: err ? err.message : JSON.stringify(res),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    switch (event.httpMethod) {
        case 'DELETE':
            console.log('Delete');
            done(false, JSON.parse(event.body));
            break;
        case 'GET':
            console.log('Get');
            done(false, JSON.parse(event.body));
            break;
        case 'POST':
            console.log('Post');
            done(false, JSON.parse(event.body));
            break;
        case 'PUT':
            console.log('Put');
            done(false, JSON.parse(event.body));
            break;
        default:
            done(new Error(`Unsupported method "${event.httpMethod}"`));
    }
};
