const userDao = require("./userDao");
const bcrypt = require("bcryptjs");
const { emailRegex, passwordRegex } = require("../../utils/regex");
const jwt = require("jsonwebtoken");
const customException = require("../../utils/handler/customException");
const {
  INVALID_REQUEST,
  INVALID_EMAIL_OR_PASSWORD,
  DUPLICATED_EMAIL,
} = require("../../utils/baseResponseStatus");

const secretKey = process.env.SECRET_KEY;

const signUp = async (
  name,
  email,
  profileImage,
  password,
  latitude,
  longitude
) => {
  try {
    if (!emailRegex.test(email)) {
      throw new customException(INVALID_REQUEST);
    }

    if (!passwordRegex.test(password)) {
      throw new customException(INVALID_REQUEST);
    }

    if (await userDao.findUserIdByEmail(email)) {
      throw new customException(DUPLICATED_EMAIL);
    }

    const saltRound = 12;
    const hashedPassword = await bcrypt.hash(password, saltRound);

    return userDao.createUser(
      name,
      email,
      profileImage,
      hashedPassword,
      latitude,
      longitude
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const signIn = async (email, password) => {
  try {
    const user = await findUserIdByEmail(email);

    if (!user) {
      throw new customException(INVALID_EMAIL_OR_PASSWORD);
    }

    const isMatched = await bcrypt.compare(password, user.password);

    if (!isMatched) {
      throw new customException(INVALID_EMAIL_OR_PASSWORD);
    }

    const payload = { userId: user.email };
    const token = jwt.sign(payload, secretKey, { expiresIn: "6h" });

    return token;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const findUserIdByEmail = async (email) => {
  try {
    return await userDao.findUserIdByEmail(email);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  signUp,
  signIn,
  findUserIdByEmail,
};
