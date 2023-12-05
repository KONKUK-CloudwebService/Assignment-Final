const { initializeConnection, getConnection }  = require("./appDataSource.js");
const RegistrationsService = require("./model/registrations/RegistrationsService.js");
module.exports.handler = async (event) => {
  
  let result;
 try {
      const registrationsService = new RegistrationsService();
      try {
        result = await registrationsService.findAllRegistrations();
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
