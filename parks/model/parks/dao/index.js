const {initializeConnection, getConnection} = require("../../../appDataSource");
const Park = require("../../Park");
class ParkDao{
    // 공원 장소 저장
    async save(name,parks_image,latitude,longitude){
        try{
            console.error(name);
            await initializeConnection();
            const connection = getConnection();
            const result = await connection.query(
                `
                INSERT INTO parks(
                name,
                parks_image, 
                latitude,
                longitude
                ) VALUES (?, ?, ?, ?)
                `,
                [name, parks_image, latitude,longitude]
            
            );
            console.error(name);
            const examplePark = 
            {
                name: name,
                location: { type: 'Point', coordinates: [latitude, longitude] }
            };
            console.error(name);
            const createPark = await Park.create(examplePark);
            //console.error(createPark);
            return result;
        }catch(err){
            throw(err);
            //throw new CustomException(DATABASE_ERROR);
        }
    }
    // 위치 기반으로 개수 가져오기
    // 반경 내에 갯수 찾기
    async findInRadius(centerCoordinates,radiusInKm){
        const result = Park.find({
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
        console.log(result);
        return result;
    }
    // 공원 장소 수정
    async update(data){
        try{
            await initializeConnection();
            const connection = getConnection();
            const result = await connection.query(
                `
                UPDATE parks p
                SET p.name = ?,p.latitude = ? , p.longitude = ?, p.parks_image = ?
                WHERE p.id = ?
                `,
                [data.name,data.latitude,data.longitude,data.parks_image,data.id]
            );
            return result;
        }catch(err){
            //throw new CustomException(DATABASE_ERROR);
        }
    }
    // 공원 위치를 기반으로 조회
    async findByPos(latitude,longitude){
        try{
            await initializeConnection();
            const connection = getConnection();
            const result = await connection.query(
                `
                SELECT
                    name,
                    latitude,
                    longitude
                FROM
                    parks p
                WHERE
                    p.latitude = ? AND p.longitude = ?
                `, [latitude,longitude]
            )
            return result;
        }catch(err){
           // throw new CustomException(DATABASE_ERROR);
        }
    }
    // 공원 이름으로 검색, 없으면 빈 값으로 나옴
    async findByName(name){
        try{
            await initializeConnection();
            const connection = getConnection();
            const result = await connection.query(
                `
                SELECT
                    p.name,
                    p.latitude,
                    p.longitude
                FROM
                    parks p
                WHERE
                    p.name = ?
                `, [name]
            )
            return result;
        }catch(err){
           // throw new CustomException(DATABASE_ERROR);
        }
    }
    // 공원 데이터 삭제
    async deleteParkData(park_id){
        try{
            await initializeConnection();
            const connection = getConnection();
            const result = await connection.query(
                `
                DELETE p
                FROM parks p
                WHERE p.id = ?
                `,
                [park_id]
            );
            return result;
        }catch(err){
           // throw new CustomException(DATABASE_ERROR);
        }
    }
    // 모든 공원 정보 조회
    async findAll(){
        try{
            await initializeConnection();
            const connection = getConnection();
            const result = await connection.query(
                `
                SELECT
                    name,
                    latitude,
                    longitude
                FROM
                    parks p
                `
            );
            return result;
        }catch(err){
            throw(err);
           // throw new CustomException(DATABASE_ERROR);
        }
    }
    // 아이디 기반으로 검색
    async findById(park_id){
        try{
            await initializeConnection();
            const connection = getConnection();
            const result = await connection.query(
                `
                SELECT
                    name,
                    latitude,
                    longitude
                FROM
                    parks 
                WHERE
                    id = ?
                `, [park_id]
            )
            return result;
        }catch(err){
            //throw new CustomException(DATABASE_ERROR);
        }
    }
}
module.exports = ParkDao;
