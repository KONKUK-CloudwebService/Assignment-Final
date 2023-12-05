const jwt = require("jsonwebtoken");

const dataSource = require("./models/appDataSource");
const hospitalController = require("./src/hospitals/hospitalController");
const hospitalService = require("./src/hospitals/hospitalService");

// JWT
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.SECRET_KEY);
  } catch (error) {
    throw new Error("Invalid Token");
  }
};

const authenticateUser = async (event) => {
  const token = event.headers.Authorization || event.headers.authorization;
  if (!token) throw new Error("No token provided");

  const decoded = verifyToken(token);
  const userData = await hospitalService.findUserIdByEmail(decoded.userId);
  if (!userData) throw new Error("User not found");

  return userData;
};

const validateUserId = (event, userData) => {
  const pathParameters = event.pathParameters;
  if (pathParameters.userId !== userData.id) {
    throw new Error("Invalid user ID");
  }
};

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

  if (event.path === "/hospitals" && event.httpMethod === "GET") {
    return hospitalController.getHospitals(event);
  } else if (event.path === "/hospitals/nearby" && event.httpMethod === "GET") {
    const userData = await authenticateUser(event);
    validateUserId(event, userData);
    return hospitalController.getHospitalsNearby(event, userData);
  }

  // 일치하는 경로 없음
  return {
    statusCode: 404,
    body: JSON.stringify({ error: "Not Found" }),
  };
};
