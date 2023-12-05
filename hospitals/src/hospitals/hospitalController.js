const hospitalService = require("./hospitalService");

const responseHeaders = {
  "Access-Control-Allow-Origin": "*", // 모든 도메인에서의 요청 허용
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PATCH,DELETE", // 허용할 HTTP 메소드
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, Content-Length, X-Requested-With", // 허용할 헤더
};

// 외부 API 호출로 데이터 입력
const getHospitals = async (event) => {
  try {
    const shelters = await hospitalService.getHospitals();
    return {
      statusCode: 200,
      headers: responseHeaders, // CORS 헤더 추가
      body: JSON.stringify({
        isSuccess: true,
        responseCode: 1000,
        responseMessage: "요청에 성공하였습니다.",
        shelters,
      }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};

const getHospitalsNearby = async (event, userData) => {
  try {
    // userId는 이벤트 쿼리 스트링 또는 본문에서 추출
    const shelters = await hospitalService.getHospitalsNearby(userData.id);
    return {
      statusCode: 200,
      headers: responseHeaders, // CORS 헤더 추가
      body: JSON.stringify({
        isSuccess: true,
        responseCode: 1000,
        responseMessage: "요청에 성공하였습니다.",
        shelters,
      }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};

module.exports = {
  getHospitals,
  getHospitalsNearby,
};
