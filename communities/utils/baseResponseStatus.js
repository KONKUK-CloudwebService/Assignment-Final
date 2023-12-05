const baseResponseStatus = {
  SUCCESS: {
    key: "SUCCESS",
    isSuccess: true,
    responseCode: 1000,
    responseMessage: "요청에 성공하였습니다.",
  },

  /**
   * 2000 : Request 오류
   */

  INVALID_REQUEST: {
    key: "INVALID_REQUEST",
    isSuccess: false,
    responseCode: 2000,
    responseMessage: "잘못된 요청이 존재합니다.",
  },

  KEY_ERROR: {
    key: "KEY_ERROR",
    isSuccess: false,
    responseCode: 2001,
    responseMessage: "KEY_ERROR가 존재합니다.",
  },

  //   UserException
  INVALID_EMAIL_OR_PASSWORD: {
    key: "INVALID_EMAIL_OR_PASSWORD",
    isSuccess: false,
    responseCode: 2010,
    responseMessage: "이메일 혹은 비밀번호가 잘못되었습니다.",
  },
  DUPLICATED_EMAIL: {
    key: "DUPLICATED_EMAIL",
    isSuccess: false,
    responseCode: 2011,
    responseMessage: "중복된 이메일입니다.",
  },
  INVALID_USER: {
    key: "INVALID_USER",
    isSuccess: false,
    responseCode: 2012,
    responseMessage: "유효한 유저가 아닙니다.",
  },

  // JwtException
  NO_AUTHORIZATION_IN_HEADER: {
    key: "NO_AUTHORIZATION_IN_HEADER",
    isSuccess: false,
    responseCode: 2030,
    responseMessage: "Authorization 헤더가 없습니다.",
  },

  INVALID_TOKEN_TYPE: {
    key: "INVALID_TOKEN_TYPE",
    isSuccess: false,
    responseCode: 2031,
    responseMessage: "잘못된 토큰 타입입니다.",
  },

  //   DataException
  NONE_EXIST_DATA: {
    key: "NONE_EXIST_DATA",
    isSuccess: false,
    responseCode: 2070,
    responseMessage: "해당되는 데이터가 없습니다.",
  },

  /**
   * 4000 : Database, Server 오류
   */
  DATABASE_ERROR: {
    key: "DATABASE_ERROR",
    isSuccess: false,
    responseCode: 4000,
    responseMessage: "데이터베이스 연결에 실패하였습니다.",
  },
  SERVER_ERROR: {
    key: "SERVER_ERROR",
    isSuccess: false,
    responseCode: 4001,
    responseMessage: "서버와의 연결에 실패하였습니다.",
  },
};

module.exports = baseResponseStatus;
