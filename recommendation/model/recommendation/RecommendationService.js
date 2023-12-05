const RecommenderDao = require("../recommender/RecommenderDao");
class RecommenderService{
    recommenderDao;
    constructor(){
        this.recommenderDao = new RecommenderDao();
    }
    // 데이터 저장
    async provideDoctor(centerCoordinates){
        let count = 0;
        const hospital01 = await this.recommenderDao.provideHospital(centerCoordinates,1);
        const hospital13 = await this.recommenderDao.provideHospital(centerCoordinates,3);
        const hospital35 = await this.recommenderDao.provideHospital(centerCoordinates,5);
        if(hospital01.length == 0) count+=40;
        else if(hospital01.length == 1) count+=25;
        else if(hospital01.length >= 2 && hospital01.length <= 4) count+=10;
        else count;
        if(hospital13.length - hospital01.length == 0) count+=15;
        else if(hospital13.length - hospital01.length == 1) count+=5;
        else count;
        if(hospital35.length - hospital13.length == 0) count+=5;
        else count;
        const animal = await this.recommenderDao.provideAnimal(centerCoordinates,3);
        if(animal.length >= 5000) count+=30;
        else if(animal.length >= 2500 && animal.length < 5000) count+=20;
        else if(animal.length >= 1000 && animal.length < 2500) count+=10;
        else count += 5;
        const park = await this.recommenderDao.providePark(centerCoordinates);
        if(park.length > 0){
            const ex = park[0];
            const dist = ex.dist*1000;
            if(dist < 3) count+=10;
            else if(dist >=3 && dist < 5) count += 5;
            else count;
        }
        console.log(park[0].dist*1000);
        
        return count;
    }
    async provideNormal(centerCoordinates){
        let count = 0;
        const hospital01 = await this.recommenderDao.provideHospital(centerCoordinates,1);
        const hospital13 = await this.recommenderDao.provideHospital(centerCoordinates,3);
        const hospital35 = await this.recommenderDao.provideHospital(centerCoordinates,5);
        if(hospital13.length >= 3) count+=40;
        else if(hospital13.length >= 1 && hospital13.length < 3) count+=30;
        else count;
        if(hospital35.length - hospital13.length >= 1) count+=10;
        else count;
        const animal = await this.recommenderDao.provideAnimal(centerCoordinates,3);
        if(animal.length >= 3000) count+=10;
        else if(animal.length >= 1000 && animal.length < 3000) count+=5;
        else if(animal.length < 1000) count+=3;
        else count;
        const park = await this.recommenderDao.providePark(centerCoordinates);
        if(park.length > 0){
            const ex = park[0];
            const dist = ex.dist*1000;
            if(dist < 3) count+=40;
            else if(dist >=3 && dist < 5) count += 20;
            else count += 5;
        }
        console.log(park[0].dist*1000);
        
        return count;
    }
}
module.exports = RecommenderService;
