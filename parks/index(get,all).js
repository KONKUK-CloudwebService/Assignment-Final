const { initializeConnection, getConnection }  = require("./appDataSource.js");
const ParkService = require("./model/parks/service/index.js");

module.exports.handler = async (event) => {
  
  let result;
  try {
    const parkService = new ParkService();
    try {
      result = await parkService.findAllPark();
      console.log(result);
    } catch(err) {
      throw(err);
    }
  } catch (error) {
    console.error(`Error executing database query: ${error}`);
    // 오류 처리
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  } finally {
    mongoose.connection.close(); // 연결 닫기
  }
  const response = {
    headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  },
    statusCode: 200,
    body: JSON.stringify(result),
  };
    return response;
};
