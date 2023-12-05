const mongoose = require('mongoose');
const initMongoDB = async () => {
  try {
    await mongoose.connect("주소비번");
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
const hospitalSchema = new mongoose.Schema({
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
hospitalSchema.index({ location: '2dsphere' });
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
const Animal = mongoose.model('Animal', animalSchema);
const Hospital = mongoose.model('Hospital', hospitalSchema);
const Park = mongoose.model('Park', parkSchema);
module.exports = {Animal,Hospital,Park};
