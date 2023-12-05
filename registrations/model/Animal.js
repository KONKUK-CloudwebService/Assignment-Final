const mongoose = require('mongoose');
const initMongoDB = async () => {
  try {
    await mongoose.connect("주소 및 비번");
    console.error("MongoDB connected");
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error}`);
    throw error;
  }
};
// MongoDB 연결 초기화
initMongoDB();
const animalSchema = new mongoose.Schema({
    city: String,
    district: String,
    count: Number,
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
animalSchema.index({ location: '2dsphere' });
const Animal = mongoose.model('Animal', animalSchema);
module.exports = Animal;
