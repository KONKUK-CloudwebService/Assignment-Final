const postService = require("./postService");
const baseResponse = require("../../utils/baseResponse");
const {
  KEY_ERROR,
  NONE_EXIST_DATA,
} = require("../../utils/baseResponseStatus");
const CustomException = require("../../utils/handler/customException");
const Community = require("../../models/community");

// cors 설정
const responseHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PATCH,DELETE",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, Content-Length, X-Requested-With",
};

const getAllposts = async (event) => {
  try {
    const queryStringParameters = event.queryStringParameters || {};
    const page = parseInt(queryStringParameters.page) || 1;
    const limit = parseInt(queryStringParameters.limit) || 10;
    const searchQuery = queryStringParameters.search || "";

    const searchOptions = searchQuery
      ? {
          $or: [
            { title: { $regex: searchQuery, $options: "i" } },
            { content: { $regex: searchQuery, $options: "i" } },
          ],
        }
      : {};

    const total = await Community.countDocuments(searchOptions);
    const posts = await Community.find(searchOptions)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return {
      statusCode: 200,
      headers: responseHeaders, // CORS 헤더 추가
      body: JSON.stringify({
        isSuccess: true,
        responseCode: 1000,
        responseMessage: "요청에 성공하였습니다.",
        total,
        posts,
      }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};

const createPost = async (event) => {
  try {
    const requestBody = JSON.parse(event.body);
    const { title, content } = requestBody;
    const userId = event.requestContext.authorizer.principalId; // 예시로 사용자 ID를 Lambda Authorizer에서 가져옴
    const imageUrls = event.uploadedFileUrls; // 이미지 URL은 이전 단계에서 처리

    if (!title || !content) {
      throw new CustomException(KEY_ERROR);
    }

    const postId = await postService.createPost(
      title,
      content,
      imageUrls,
      userId
    );

    return {
      statusCode: 200,
      headers: responseHeaders, // CORS 헤더 추가
      body: JSON.stringify({
        isSuccess: true,
        responseCode: 1000,
        responseMessage: "요청에 성공하였습니다.",
        postObjectId: `${postId._id}`,
      }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};

const deletePostById = async (event) => {
  try {
    const postId = event.pathParameters.postId;

    const result = await postService.deletePostById(postId);
    if (result.success) {
      return {
        statusCode: 200,
        headers: responseHeaders, // CORS 헤더 추가
        body: JSON.stringify({
          isSuccess: true,
          responseCode: 1000,
          responseMessage: "요청에 성공하였습니다.",
          id: `${result.postId}`,
        }),
      };
    } else {
      throw new CustomException(NONE_EXIST_DATA);
    }
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};

const updatePostByUserId = async (event) => {
  try {
    const { userId, postId } = event.pathParameters;
    const requestBody = JSON.parse(event.body);
    const { content } = requestBody;
    const imageUrl = event.uploadedFileUrls; // 이미지 URL은 이전 단계에서 처리

    const rows = await postService.updatePostContent(
      userId,
      postId,
      content,
      imageUrl
    );

    return {
      statusCode: 200,
      headers: responseHeaders, // CORS 헤더 추가
      body: JSON.stringify({
        isSuccess: true,
        responseCode: 1000,
        responseMessage: "요청에 성공하였습니다.",
        rows,
      }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};

module.exports = {
  getAllposts,
  createPost,
  deletePostById,
  updatePostByUserId,
};
