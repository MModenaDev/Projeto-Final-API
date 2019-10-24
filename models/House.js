const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const houseSchema = new Schema({
  name : String,
  adress: String,
  maxBooking: Number,
  description  : String,
  numberRooms: Number,
  numberBath: Number,
  garage: Boolean,
  numberGarage: Number
},
{
  timestamps: true
});

const House = mongoose.model('House', houseSchema);
module.exports = House;