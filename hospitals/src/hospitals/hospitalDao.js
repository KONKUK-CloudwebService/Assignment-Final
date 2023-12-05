const { DATABASE_ERROR } = require("../../utils/baseResponseStatus");
const CustomException = require("../../utils/handler/customException");
const appDataSource = require("../../models/appDataSource");

const addHospital = async (hospitalData) => {
  const {
    phone_number,
    address,
    hospital_name,
    latitude,
    longitude,
    likes,
    is_available,
    is_open_24_hours,
  } = hospitalData;

  try {
    const query = `INSERT INTO hospitals 
      (phone_number, address, hospital_name, latitude, longitude, likes, is_available, is_open_24_hours) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    await appDataSource.query(query, [
      phone_number,
      address,
      hospital_name,
      latitude,
      longitude,
      likes,
      is_available,
      is_open_24_hours,
    ]);

    return { phone_number, address, hospital_name, latitude, longitude };
  } catch (err) {
    console.log(err);
    throw new CustomException(DATABASE_ERROR);
  }
};

const findNearbyHospitals = async (latitude, longitude) => {
  try {
    const query = `
    SELECT id, hospital_name, phone_number, address, latitude, longitude, likes,
    (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) +
                 sin(radians(?)) * sin(radians(latitude)))) AS distance
    FROM hospitals
    HAVING distance < 20
    ORDER BY distance
    LIMIT 5;
`;

    const shelters = await appDataSource.query(query, [
      latitude,
      longitude,
      latitude,
    ]);

    console.log("hi" + shelters);

    return shelters;
  } catch (err) {
    console.log(err);
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

module.exports = {
  addHospital,
  findNearbyHospitals,
  findUserLocation,
  findUserIdByEmail,
};
