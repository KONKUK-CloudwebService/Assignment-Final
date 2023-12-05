const mongoose = require('mongoose');
const initMongoDB = async () => {
  try {
    await mongoose.connect("연결 주소 및 비밀번호");
    console.error("MongoDB connected");
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error}`);
    throw error;
  }
};
// MongoDB 연결 초기화
initMongoDB();
const parkSchema = new mongoose.Schema({
    name: String,
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            default: [0, 0]
        }
    }
});
parkSchema.index({ location: '2dsphere' });
const Park = mongoose.model('Park', parkSchema);
module.exports = Park;
