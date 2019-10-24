const express = require('express');
const router  = express.Router();
const House = require('../models/House')
const Slots = require('../models/Slots')

// ==================================================================================================================
// Create a house
router.post('/newhouse', (req, res, next) => {
  const {name} = req.body;

  House.create({name})
    .then(house => {
      let dateBegin = new Date();
      dateBegin.setHours(0);
      dateBegin.setMinutes(0);
      dateBegin.setSeconds(0);

      let dateEnd = new Date(2020,11,31,0,0,0);

      let dateMid = new Date();
      dateMid.setHours(0);
      dateMid.setMinutes(0);
      dateMid.setSeconds(0);
      dateMid.setDate(dateMid.getDate() + 1);

      while (dateBegin < dateEnd) {

        Slots.create({
          house,
          dateStart: dateBegin,
          dateFinish: dateMid,
        })
        .then(slot => res.json(house))
        .catch(err => console.log(err))

        dateBegin.setDate(dateBegin.getDate() + 1);
        dateMid.setDate(dateMid.getDate() + 1);

      }
    })
    .catch(err => console.log(err))
})

module.exports = router;