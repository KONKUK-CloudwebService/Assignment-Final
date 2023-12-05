const { initializeConnection, getConnection }  = require("./appDataSource.js");
const ParkService = require("./model/parks/service/index.js");
module.exports.handler = async (event) => {
  
  let result;
 try {
      let name, parks_image, latitude, longitude;
      try {
          ({ name, parks_image, latitude, longitude } = JSON.parse(event.body));
      } catch (error) {
          console.error(`Error parsing JSON: ${error}`);
          return {
              statusCode: 400,
              body: JSON.stringify({ error: 'Invalid JSON format' }),
          };
      }
      const parkService = new ParkService();
      try {
        result = await parkService.savePark(name,parks_image,latitude,longitude);
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
