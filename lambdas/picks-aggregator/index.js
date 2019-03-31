/*
Listens for events on the picks s3 bucket, and updates the aggregate picks
object with all of the individual picks in a tournament
 */


exports.handler = async (event) => {

    // determine tournament

    // get all individual picks for that tournament

    // create picks.json

    // save it
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
    return response;
};
