const { initializeConnection, getConnection }  = require("./appDataSource.js");
const ParkService = require("./model/parks/service/index.js");
module.exports.handler = async (event) => {
  
  let result;
  
 try {
    // queryStringParameters가 있는지 확인
      const { name } = event.pathParameters;
      const parkService = new ParkService();
      try {
        result = await parkService.findParkByName(name);
        console.log(result);
      } catch (err) {
        console.error(`Error executing database query: ${err}`);
        throw err;
      }
  } catch (error) {
    console.error(`Error in Lambda handler: ${error}`);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  } finally {
    mongoose.connection.close(); // MongoDB 연결 닫기
  }
  const response = {
    statusCode: 200,
    body: JSON.stringify(result),
  };
  return response;
};
