const {initializeConnection, getConnection} = require("../../appDataSource");
const Animal = require("../Animal");
class RegistrationsDao{
    // 등록 현황 저장
    async save(data){
        try{
            await initializeConnection();
            const connection = getConnection();
            const result = await connection.query(
                `
                INSERT INTO registrations(
                city,
                district, 
                animal_count
                ) VALUES (?, ?, ?)
                `,
                [data.city,data.district,data.animal_count]
            
            );
            const exampleAnimals = 
                {
                    city: data.city,
                    district: data.district,
                    count: data.animal_count,
                    location: { type: 'Point', coordinates: [data.latitude, data.longitude] }
                };
                const createdAnimals = await Animal.create(exampleAnimals);
                console.log(createdAnimals)
            return exampleAnimals;
        }catch(err){
            // throw new CustomException(DATABASE_ERROR);
        }
    }
    // 반경 내에 갯수 찾기
    async findInRadius(centerCoordinates,radiusInKm){
        return Animal.find({
            location: {
                $nearSphere: {
                    $geometry: {
                        type: 'Point',
                        coordinates: centerCoordinates
                    },
                    $maxDistance: radiusInKm * 1000
                }
            }
        }).exec();
    }
    // 현황 수정
    async update(data){
        try{
            await initializeConnection();
            const connection = getConnection();
            const result = await connection.query(
                `
                UPDATE registrations r
                SET r.city = ?, r.district = ?, r.animal_count = ?
                WHERE r.id = ?
                `,
                [data.city,data.district,data.animal_count,data.id]
            );
            return result;
        }catch(err){
            // throw new CustomException(DATABASE_ERROR);
        }
    }
    // 현황 삭제
    async delete(id){
        try{
            await initializeConnection();
            const connection = getConnection();
            const result = await connection.query(
                `
                DELETE r
                FROM registrations r
                WHERE r.id = ?
                `,
                [id]
            );
            return result;
        }catch(err){
            // throw new CustomException(DATABASE_ERROR);
        }
    }
    // 전체 리스트 가져오기
    async findAll(){
        try{
            await initializeConnection();
            const connection = getConnection();
            const result = await connection.query(
                `
                SELECT
                    city,
                    district,
                    animal_count
                FROM
                    registrations r
                `
            );
            return result;
        }catch(err){
            // throw new CustomException(DATABASE_ERROR);
        }
    }
    // 해당 지역 데이터 가져오기
    async findByCityAndDistrict(city,district){
        try{
            await initializeConnection();
            const connection = getConnection();
            const result = await connection.query(
                `
                SELECT
                    city,
                    district,
                    animal_count
                FROM
                    registrations
                WHERE
                    city = ? AND district =?
                `, [city,district]
            )
            return result
        }catch(err){
            // throw new CustomException(DATABASE_ERROR);
        }
    }
}
module.exports = RegistrationsDao;
