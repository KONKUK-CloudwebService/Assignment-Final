const axios = require("axios");
const hospitalDao = require("./hospitalDao");

const getHospitals = async () => {
  try {
    // 외부 API에서 데이터 가져오기
    let pageIndex = 1;
    const pageSize = 100; // API에서 한 번에 가져올 수 있는 최대 데이터 수
    let totalHospitals = 0;
    let totalPages = 0;

    // 첫 번째 API 호출로 총 페이지 수 계산
    if (pageIndex === 1) {
      const response = await axios.get(
        `${process.env.HOSPITAL_API}&pIndex=${pageIndex}&pSize=${pageSize}`
      );
      const totalShelterCount =
        response.data.Animalhosptl[0].head[0].list_total_count;
      totalPages = Math.ceil(totalShelterCount / pageSize);
    }

    while (pageIndex <= totalPages) {
      // 외부 API 호출
      const response = await axios.get(
        `${process.env.HOSPITAL_API}&pIndex=${pageIndex}&pSize=${pageSize}`
      );
      const hospitalData = response.data.Animalhosptl[1].row;

      // "정상" 상태의 병원만 필터링
      const normalHospitals = hospitalData.filter(
        (hospital) => hospital.BSN_STATE_NM === "정상"
      );

      // 각 보호소 정보를 데이터베이스에 저장
      for (let hospital of normalHospitals) {
        const hospitalData = {
          phone_number: hospital.LOCPLC_FACLT_TELNO,
          address: hospital.REFINE_LOTNO_ADDR,
          hospital_name: hospital.BIZPLC_NM,
          latitude: hospital.REFINE_WGS84_LAT,
          longitude: hospital.REFINE_WGS84_LOGT,
          likes: 0,
          is_available: true,
          is_open_24_hours: false, // false 초기화
        };

        await hospitalDao.addHospital(hospitalData);
      }

      totalHospitals += normalHospitals.length;
      pageIndex++; // 다음 index
    }

    return { message: `${totalHospitals} hospitals added successfully` };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// 근처 동물보호소 5개 찾기
const getHospitalsNearby = async (userId) => {
  try {
    const { latitude, longitude } = await hospitalDao.findUserLocation(userId);
    const nearbyShelters = await hospitalDao.findNearbyHospitals(
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
    return await hospitalDao.findUserIdByEmail(email);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  getHospitals,
  getHospitalsNearby,
  findUserIdByEmail,
};
