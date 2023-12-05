const jwt = require("jsonwebtoken");
const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const crypto = require("crypto");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Busboy = require("busboy");
dotenv.config();

const postService = require("./src/communities/postService");
const postController = require("./src/communities/postController");

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
  const userData = await postService.findUserIdByEmail(decoded.userId);
  if (!userData) throw new Error("User not found");

  return userData;
};

const validateUserId = (event, userData) => {
  const pathParameters = event.pathParameters;
  if (pathParameters.userId !== userData.id) {
    throw new Error("Invalid user ID");
  }
};

//S3
const s3Client = new S3Client({
  region: process.env.S3_REGION,
});

const uploadImageToS3 = async (file) => {
  const filename = `post/${Date.now()}-${crypto.randomUUID()}`;
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: filename,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  await s3Client.send(new PutObjectCommand(params));
  return generateS3Url(process.env.BUCKET_NAME, filename);
};

// Data parsing
const parseMultipartFormData = async (event) => {
  return new Promise((resolve, reject) => {
    const busboy = new Busboy({ headers: event.headers });

    const result = {
      files: [],
    };

    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
      const fileChunks = [];
      file.on("data", (data) => {
        fileChunks.push(data);
      });
      file.on("end", () => {
        const completeFile = Buffer.concat(fileChunks);
        result.files.push({
          fieldname,
          file: completeFile,
          filename,
          encoding,
          mimetype,
        });
      });
    });

    busboy.on("field", (fieldname, value) => {
      result[fieldname] = value;
    });

    busboy.on("finish", () => {
      resolve(result);
    });

    busboy.write(event.body, event.isBase64Encoded ? "base64" : "binary");
    busboy.end();
  });
};

// Lambda handler
exports.handler = async (event) => {
  // MongoDB 연결
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGODB_URL);
  }

  try {
    const method = event.httpMethod;
    const path = event.path;

    if (path === "/posts" && method === "GET") {
      return postController.getAllposts(event);
    }
    if (path === "/posts" && method === "POST") {
      const userData = await authenticateUser(event);
      validateUserId(event, userData);

      const parsedData = await parseMultipartFormData(event);
      const files = parsedData.files;

      // 파일을 S3에 업로드하고 URL을 저장
      const uploadedUrls = [];
      for (const file of files) {
        const uploadedUrl = await uploadImageToS3(file);
        uploadedUrls.push(uploadedUrl);
      }
      return postController.createPost(event);
    }
    if (path.match(/^\/posts\/[0-9]+\/[a-zA-Z0-9-]+$/) && method === "PATCH") {
      const userData = await authenticateUser(event);
      validateUserId(event, userData);

      const parsedData = await parseMultipartFormData(event);
      const files = parsedData.files;

      // 파일을 S3에 업로드하고 URL을 저장
      const uploadedUrls = [];
      for (const file of files) {
        const uploadedUrl = await uploadImageToS3(file);
        uploadedUrls.push(uploadedUrl);
      }
      return postController.updatePostByUserId(event, uploadedUrls);
    }
    if (path.match(/^\/[a-zA-Z0-9]+$/) && method === "DELETE") {
      const userData = await authenticateUser(event);
      validateUserId(event, userData);
      return postController.deletePostById(event);
    }

    return {
      statusCode: 404,
      body: JSON.stringify({ message: "Not Found" }),
    };
  } catch (error) {
    // 에러 처리
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Internal Server Error",
        error: error.message,
      }),
    };
  }
};
