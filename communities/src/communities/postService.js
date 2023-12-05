const Community = require("../../models/community");
const { deleteImageFromS3 } = require("../../utils/s3/imageUploader");
const CustomException = require("../../utils/handler/customException");
const { NONE_EXIST_DATA } = require("../../utils/baseResponseStatus");

const createPost = async (title, content, imageUrls, userId) => {
  try {
    const newPost = new Community({
      title,
      content,
      images: imageUrls,
      user_id: userId,
    });

    await newPost.save();
    return newPost;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const deletePostById = async (postId) => {
  // MongoDB 포스트 찾기
  const post = await Community.findById(postId);

  if (!post) {
    throw new CustomException(NONE_EXIST_DATA);
  }

  // S3 이미지 삭제
  if (post.images && post.images.length) {
    for (let imageUrl of post.images) {
      await deleteImageFromS3(imageUrl);
    }
  }

  // MongoDB 포스트 삭제
  await Community.deleteOne({ _id: postId });

  return { success: true, postId: postId };
};

const updatePostContent = async (userId, postId, content, updatedUrls) => {
  try {
    // MongoDB에서 포스트 찾기
    const post = await Community.findOne({ _id: postId, user_id: userId });

    if (!post) {
      throw new CustomException(NONE_EXIST_DATA); // 수정 필요
    }

    // S3에서 기존 이미지 삭제
    if (post.images && post.images.length) {
      for (let imageUrl of post.images) {
        await deleteImageFromS3(imageUrl);
      }
    }

    // 업데이트할 내용 설정
    post.content = content;

    if (updatedUrls && updatedUrls.length) {
      post.images = updatedUrls;
    }
    post.updated_at = new Date();

    // MongoDB에 업데이트
    await post.save();

    return post;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  createPost,
  deletePostById,
  updatePostContent,
};
