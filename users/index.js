const dataSource = require("./models/appDataSource");
const userController = require("./src/users/userController");

// Lambda 핸들러
exports.handler = async (event, context) => {
  // 데이터 소스 초기화
  if (!dataSource.isInitialized) {
    try {
      await dataSource.initialize();
      console.log("Data Source has been initialized!");
    } catch (error) {
      console.error(`Initialize Error: ${error}`);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Internal server error" }),
      };
    }
  }

  if (event.path === "/users/signup" && event.httpMethod === "POST") {
    return userController.signUp(event);
  } else if (event.path === "/users/signin" && event.httpMethod === "POST") {
    return userController.signIn(event);
  } else {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: "Not Found" }),
    };
  }
};
