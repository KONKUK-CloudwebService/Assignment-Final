const jwt = require("jsonwebtoken");

const dataSource = require("./models/appDataSource");
const shelterController = require("./src/shelters/shelterController");

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

  try {
    switch (event.path) {
      case "/shelters/imports":
        if (event.httpMethod === "GET") {
          return shelterController.getShelters(event);
        }
        break;
      case "/shelters/nearby":
        if (event.httpMethod === "GET") {
          const userData = await authenticateUser(event);
          validateUserId(event, userData);
          return shelterController.getSheltersNearby(event, userData);
        }
        break;
      case "/shelters":
        if (event.httpMethod === "POST") {
          return shelterController.createShelter(event);
        } else if (event.httpMethod === "GET") {
          return shelterController.getAllShelters(event);
        }
        break;
      case "/shelters/{id}":
        if (event.httpMethod === "PUT") {
          return shelterController.updateShelter(event);
        } else if (event.httpMethod === "DELETE") {
          return shelterController.deleteShelter(event);
        }
        break;
    }

    return { statusCode: 404, body: JSON.stringify({ error: "Not Found" }) };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
