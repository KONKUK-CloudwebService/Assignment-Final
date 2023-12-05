const { initializeConnection, getConnection }  = require("./appDataSource.js");
const RegistrationsService = require("./model/registrations/RegistrationsService.js");
module.exports.handler = async (event) => {
  
  let result;
  let data;
 try {
      let city, district, animal_count, latitude, longitude;
      try {
          ({ city, district, animal_count, latitude, longitude } = JSON.parse(event.body));
          data = { city, district, animal_count, latitude, longitude };
      } catch (error) {
          console.error(`Error parsing JSON: ${error}`);
          // 에러 처리 또는 반환 로직 추가
          return {
              statusCode: 400,
              body: JSON.stringify({ error: 'Invalid JSON format' }),
          };
      }
      const registrationsService = new RegistrationsService();
      try {
        result = await registrationsService.saveRegistrations(data);
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
