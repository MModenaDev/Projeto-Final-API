const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const slotSchema = new Schema({
  house: {type: Schema.Types.ObjectID, ref:`House`},
  usersBooked: [{type: Schema.Types.ObjectID, ref:`User`}],
  dateStart: String,
  dateFinish: String,
},
{
  timestamps: true
});

const Slot = mongoose.model('Slot', slotSchema);
module.exports = Slot;