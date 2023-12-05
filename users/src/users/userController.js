const userService = require("../users/userService");
const { KEY_ERROR, NONE_POST } = require("../../utils/baseResponseStatus");
const CustomException = require("../../utils/handler/customException");

const responseHeaders = {
  "Access-Control-Allow-Origin": "*", // 모든 도메인에서의 요청 허용
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PATCH,DELETE", // 허용할 HTTP 메소드
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, Content-Length, X-Requested-With", // 허용할 헤더
};

const signUp = async (event) => {
  try {
    const { name, email, profileImage, password, latitude, longitude } =
      JSON.parse(event.body);

    if (
      !name ||
      !email ||
      !password ||
      !profileImage ||
      !latitude ||
      !longitude
    ) {
      throw new CustomException(KEY_ERROR);
    }

    const userId = await userService.signUp(
      name,
      email,
      profileImage,
      password,
      latitude,
      longitude
    );
    console.log(userId);

    return {
      statusCode: 200,
      headers: responseHeaders, // CORS 헤더 추가
      body: JSON.stringify({
        isSuccess: true,
        responseCode: 1000,
        responseMessage: "요청에 성공하였습니다.",
        data: { userId },
      }),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

const signIn = async (event) => {
  try {
    const { email, password } = JSON.parse(event.body);

    if (!email || !password) {
      throw new CustomException(KEY_ERROR);
    }

    const token = await userService.signIn(email, password);
    return {
      statusCode: 200,
      body: JSON.stringify({
        isSuccess: true,
        responseCode: 1000,
        responseMessage: "요청에 성공하였습니다.",
        data: { accessToken: token },
      }),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

module.exports = {
  signUp,
  signIn,
};
