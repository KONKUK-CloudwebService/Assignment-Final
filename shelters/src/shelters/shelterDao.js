const { DATABASE_ERROR } = require("../../utils/baseResponseStatus");
const CustomException = require("../../utils/handler/customException");
const appDataSource = require("../../models/appDataSource");

// 외부 API + 관리자 직접 Add
const addShelter = async (shelterData) => {
  const { phone_number, address, shelter_name, latitude, longitude, likes } =
    shelterData;

  try {
    const query =
      "INSERT INTO shelters (phone_number, address, shelter_name, latitude, longitude, likes) VALUES (?, ?, ?, ?, ?, ?)";

    await appDataSource.query(query, [
      phone_number,
      address,
      shelter_name,
      latitude,
      longitude,
      likes,
    ]);

    return { phone_number, address, shelter_name, latitude, longitude };
  } catch (err) {
    console.log(err);
    throw new CustomException(DATABASE_ERROR);

    // throw new CustomException(DATABASE_ERROR);
  }
};

const findNearbyShelters = async (latitude, longitude) => {
  try {
    const query = `
    SELECT id, shelter_name, phone_number, address, latitude, longitude, likes,
    (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) +
                 sin(radians(?)) * sin(radians(latitude)))) AS distance
    FROM shelters
    HAVING distance < 20
    ORDER BY distance
    LIMIT 5;
`;

    const shelters = await appDataSource.query(query, [
      latitude,
      longitude,
      latitude,
    ]);

    return shelters;
  } catch (err) {
    throw new CustomException(DATABASE_ERROR);
  }
};

const findUserIdByEmail = async (email) => {
  try {
    const [data] = await appDataSource.query(
      `
      SELECT id, email
      FROM users
      WHERE email = ?;
      `,
      [email]
    );

    return data;
  } catch (err) {
    throw new CustomException(DATABASE_ERROR);
  }
};

const findUserLocation = async (userId) => {
  try {
    const [data] = await appDataSource.query(
      `
      SELECT latitude, longitude
      FROM users
      WHERE id = ?
      `,
      [userId]
    );

    return data;
  } catch (err) {
    throw new CustomException(DATABASE_ERROR);
  }
};

// 보호소 리스트 조회
const getAllShelters = async (offset, limit) => {
  try {
    const query = `
      SELECT shelter_name, address, phone_number, latitude, longitude, likes
      FROM shelters
      ORDER BY id ASC
      LIMIT ?
      OFFSET ?
    `;

    const shelters = await appDataSource.query(query, [limit, offset]);

    return shelters;
  } catch (err) {
    // console.log(err);
    throw new CustomException(DATABASE_ERROR);
  }
};

// 관리자 보호소 업데이트
const updateShelter = async (
  shelterId,
  shelter_name,
  address,
  phone_number
) => {
  try {
    let query = `
    UPDATE shelters
    SET 
    shelter_name = COALESCE(?, shelter_name),
    address = COALESCE(?, address),
    phone_number = COALESCE(?, phone_number)
    WHERE id = ?
  `;

    // queryParams 배열에 새 값이 없을 경우 NULL을 할당
    let queryParams = [
      shelter_name !== undefined ? shelter_name : null,
      address !== undefined ? address : null,
      phone_number !== undefined ? phone_number : null,
      shelterId,
    ];

    return await appDataSource.query(query, queryParams);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// 관리자 보호소 삭제
const deleteShelter = async (shelterId) => {
  try {
    const query = "DELETE FROM shelters WHERE id = ?";
    return await appDataSource.query(query, [shelterId]);
  } catch (err) {
    console.log(err);
    throw new CustomException(DATABASE_ERROR);
  }
};

module.exports = {
  addShelter,
  findNearbyShelters,
  findUserLocation,
  findUserIdByEmail,
  getAllShelters,
  updateShelter,
  deleteShelter,
};
