const { initializeConnection, getConnection }  = require("./appDataSource.js");
const ParkService = require("./model/parks/service/index.js");
module.exports.handler = async (event) => {
  
  let result;
 try {
      const { id } = event.pathParameters;
      const tmp = {id : id};
      const data = Object.assign({},tmp,JSON.parse(event.body));
      console.error(data);
      const parkService = new ParkService();
      try {
        result = await parkService.updatePark(data);
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
