const baseResponseStatus = require("./baseResponseStatus");
const CustomException = require("./handler/customException");

// 순환 참조를 제거하는 함수
function getCircularReplacer() {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        // 순환 참조가 발견되면 대체 값(예: undefined)을 반환합니다.
        return;
      }
      seen.add(value);
    }
    return value;
  };
}

const baseResponse = (dataOrError, res) => {
  if (dataOrError instanceof CustomException) {
    return res.status(200).json({
      isSuccess: dataOrError.isSuccess,
      responseCode: dataOrError.responseCode,
      responseMessage: dataOrError.responseMessage,
    });
  }

  // 데이터 반환 처리
  if (dataOrError) {
    const responseData = JSON.parse(
      JSON.stringify(dataOrError, getCircularReplacer())
    );
    return res.status(200).json({
      isSuccess: baseResponseStatus.SUCCESS.isSuccess,
      responseCode: baseResponseStatus.SUCCESS.responseCode,
      responseMessage: baseResponseStatus.SUCCESS.responseMessage,
      data: responseData,
    });
  }

  // 그 외의 에러 처리
  return res.status(500).json({
    responseCode: 5000,
    message: "서버 내부 오류",
  });
};

module.exports = baseResponse;
