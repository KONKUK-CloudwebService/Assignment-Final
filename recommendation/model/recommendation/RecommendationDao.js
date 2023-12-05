const {Animal,Hospital,Park} = require("../Animal");
class RecommenderDao{
    // 반경 내에 갯수 찾기
    async provideAnimal(centerCoordinates,radiusInKm){
        return Animal.find({
            location: {
                $nearSphere: {
                    $geometry: {
                        type: 'Point',
                        coordinates: centerCoordinates
                    },
                    $maxDistance: radiusInKm * 10000
                }
            }
        }).exec();
    }
    async providePark(centerCoordinates){
        return await Park.aggregate([
            {
              $geoNear: {
                near: centerCoordinates,
                distanceField: 'dist',
                spherical: true,
                maxDistance: 10000  // 최대 거리 설정 (미터 단위)
              }
            },
            {
                $sort: {
                dist: 1  // 오름차순 정렬
                }
            }
          ]);
    }
    async provideHospital(centerCoordinates,radiusInKm){
        return Hospital.find({
            location: {
                $nearSphere: {
                    $geometry: {
                        type: 'Point',
                        coordinates: centerCoordinates
                    },
                    $maxDistance: radiusInKm * 10000
                }
            }
        }).exec();
    }
}
module.exports = RecommenderDao;
