const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const houseSchema = new Schema({
  name : String,
  adress: String,
  street: String,
  streetNumber: Number,
  complement: String,
  city: String,
  state: String,
  country: String,
  maxBooking: Number,
  description: String,
  numberRooms: Number,
  numberBath: Number,
  garage: Boolean,
  numberGarage: Number,
  plan: String,
  images: Array,
  location: { type: { type: String }, coordinates: [Number] } // coordinates [longitude, latitude]
},
{
  timestamps: true
});
  houseSchema.index({ location: '2dsphere' });

const House = mongoose.model('House', houseSchema);
module.exports = House;