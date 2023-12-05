const { initializeConnection, getConnection }  = require("./appDataSource.js");
const RecommenderService = require("./model/recommender/RecommenderService.js");
module.exports.handler = async (event) => {
  
  let result;
 try {
      const recommenderService = new RecommenderService();
      const latitude = event.queryStringParameters.latitude;
      const longitude = event.queryStringParameters.longitude;
      try {
        result = await recommenderService.provideNormal([longitude,latitude]);
      } catch (err) {
        console.error(err);
        throw err;
      }
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server Error' }),
    };
  } finally {
    //mongoose.connection.close(); // MongoDB 연결 닫기
  }
  const response = {
    statusCode: 200,
    body: JSON.stringify(result),
  };
  return response;
};
