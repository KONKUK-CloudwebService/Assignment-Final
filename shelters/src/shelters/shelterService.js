const axios = require("axios");
const shelterDao = require("./shelterDao");

// 공공데이터 API 호출로 데이터 입력
const getShelters = async () => {
  try {
    // 외부 API에서 데이터 가져오기
    const response = await axios.get(process.env.SHELTER_API);
    const sheltersData = response.data.OrganicAnimalProtectionFacilit[1].row;

    // 각 보호소 정보를 데이터베이스에 저장
    for (let shelter of sheltersData) {
      const shelterData = {
        phone_number: shelter.ENTRPS_TELNO,
        address: shelter.REFINE_ROADNM_ADDR,
        shelter_name: shelter.ENTRPS_NM,
        latitude: shelter.REFINE_WGS84_LAT,
        longitude: shelter.REFINE_WGS84_LOGT,
        likes: 0,
      };

      await shelterDao.addShelter(shelterData);
    }

    return { message: "Shelters added successfully" };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// 근처 동물보호소 5개 찾기
const getSheltersNearby = async (userId) => {
  try {
    const { latitude, longitude } = await shelterDao.findUserLocation(userId);
    const nearbyShelters = await shelterDao.findNearbyShelters(
      latitude,
      longitude
    );
    return nearbyShelters;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const findUserIdByEmail = async (email) => {
  try {
    return await shelterDao.findUserIdByEmail(email);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// CREATE
const createShelter = async (shelterData) => {
  try {
    const data = {
      ...shelterData,
      likes: 0,
    };

    return await shelterDao.addShelter(data);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// READ
const getAllShelters = async (offset, limit) => {
  try {
    return await shelterDao.getAllShelters(offset, limit);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// UPDATE
const updateShelter = async (
  shelterId,
  shelter_name,
  address,
  phone_number
) => {
  try {
    return await shelterDao.updateShelter(
      shelterId,
      shelter_name,
      address,
      phone_number
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// 관리자 삭제
const deleteShelter = async (shelterId) => {
  try {
    return await shelterDao.deleteShelter(shelterId);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  getShelters,
  getSheltersNearby,
  findUserIdByEmail,
  createShelter,
  getAllShelters,
  updateShelter,
  deleteShelter,
};
