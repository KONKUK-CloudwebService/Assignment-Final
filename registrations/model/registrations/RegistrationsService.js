const RegistrationsDao = require("../registrations/RegistrationsDao.js");
class RegistrationsService{
    registrationsDao;
    constructor(){
        this.registrationsDao = new RegistrationsDao();
    }
    // 데이터 저장
    async saveRegistrations(data){
        try{
            if(data?.city == null || data?.district == null || data?.animal_count == null){
                throw("저장할 데이터가 부족합니다.");
            }
            const result = await this.registrationsDao.save(data);
            return result;
        }catch(err){
            throw err;
        }
    }
    async findAnimalsInRadius(centerCoordinates, radiusInKm){
        const result = await this.registrationsDao.findInRadius(centerCoordinates,radiusInKm);
        let cnt = 0;
        for(let i=0;i<result.length;i++){
            cnt += result[i].count;
        }
        console.log(result);
        return cnt;
    }
    // 삭제
    async deleteRegistrations(id){
        try{
            const result = await this.registrationsDao.deleteRegistrations(id);
            return result;
        }catch(err){
            throw err;
        }
    }
    // 업데이트
    async updateRegistrations(data){
        try{
            if(data?.city == null || data?.district == null || data?.animal_count == null){
                throw("잘못된 업데이트 값입니다.");
            }
            const result = await this.registrationsDao.update(data);
            return result;
        }catch(err){
            throw err;
        }
    }
    // 전체 가져오기
    async findAllRegistrations(){
        try{
            const result = await this.registrationsDao.findAll();
            return result;
        }catch(err){
            throw err;
        }
    }
    // 조건에 맞춰
    async findRegistrationsByCityAndDistrict(city,district){
        try{
            const result = await this.registrationsDao.findByCityAndDistrict(city,district);
            return result;
        }catch(err){
            throw err;
        }
    }
}
module.exports = RegistrationsService;
