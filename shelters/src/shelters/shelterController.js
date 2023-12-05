const sheltersService = require("./shelterService");

const responseHeaders = {
  "Access-Control-Allow-Origin": "*", // 모든 도메인에서의 요청 허용
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PATCH,DELETE", // 허용할 HTTP 메소드
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, Content-Length, X-Requested-With", // 허용할 헤더
};

// 공공데이터 API 호출로 데이터 입력
const getShelters = async (event) => {
  try {
    const shelters = await sheltersService.getShelters();
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

// 근처 동물보호소 5개 호출
const getSheltersNearby = async (event) => {
  try {
    const userId = event.pathParameters.id; // 사용자 ID를 가져옴
    const shelters = await sheltersService.getSheltersNearby(userId);
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

// 관리자 동물보호소 생성
const createShelter = async (event) => {
  try {
    const shelterData = JSON.parse(event.body); // 요청 본문에서 shelter 데이터 파싱
    const newShelter = await sheltersService.createShelter(shelterData);
    return {
      statusCode: 200,
      headers: responseHeaders, // CORS 헤더 추가
      body: JSON.stringify({
        isSuccess: true,
        responseCode: 1000,
        responseMessage: "요청에 성공하였습니다.",
        shelter: newShelter.shelter_name,
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

// 동물보호소 리스트 조회
const getAllShelters = async (event) => {
  try {
    const page = parseInt(event.queryStringParameters.page, 10) || 0;
    const limit = parseInt(event.queryStringParameters.limit, 10) || 8;
    const offset = page * limit;

    const shelters = await sheltersService.getAllShelters(offset, limit);
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

// 동물보호소 정보 업데이트
const updateShelter = async (event) => {
  try {
    const shelterId = event.pathParameters.id; // shelter ID를 가져옴
    const shelterData = JSON.parse(event.body); // 요청 본문에서 shelter 데이터 파싱

    const updatedShelter = await sheltersService.updateShelter(
      shelterId,
      shelterData.shelter_name,
      shelterData.address,
      shelterData.phone_number
    );

    return {
      statusCode: 200,
      headers: responseHeaders, // CORS 헤더 추가
      body: JSON.stringify({
        isSuccess: true,
        responseCode: 1000,
        responseMessage: "요청에 성공하였습니다.",
        shelter: updatedShelter,
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

// 동물보호소 정보 삭제
const deleteShelter = async (event) => {
  try {
    const shelterId = event.pathParameters.id; // shelter ID를 가져옴
    await sheltersService.deleteShelter(shelterId);
    return {
      statusCode: 200,
      headers: responseHeaders, // CORS 헤더 추가
      body: JSON.stringify({
        isSuccess: true,
        responseCode: 1000,
        responseMessage: "요청에 성공하였습니다.",
        message: "Shelter deleted successfully",
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
  getShelters,
  getSheltersNearby,
  createShelter,
  getAllShelters,
  updateShelter,
  deleteShelter,
};
