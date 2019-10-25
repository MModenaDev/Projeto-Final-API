const express = require('express');
const router  = express.Router();
const House = require('../models/House')
const Slots = require('../models/Slots')
const axios = require('axios')
const mongoose = require('mongoose')

// ==================================================================================================================
// PUT booking

router.put('/:houseId/adduser', (req, res, next) => {  
  const { houseId } = req.params;
  const { dateStart, dateFinish } = req.body;

  let dateStartAdj = new Date(dateStart)
  let dateFinishAdj = new Date(dateFinish)
  
  let responseArr = [];

  Slots.find({ house: houseId })
    .populate('house')
    .then (allSlots => {
      
      allSlots.forEach(slot => {

        let dateStartSlotAdj = new Date(slot.dateStart)
        let dateFinishSlotAdj = new Date(slot.dateFinish)

        if (dateStartSlotAdj >= dateStartAdj && dateFinishSlotAdj <= dateFinishAdj) {
          if (slot.usersBooked.length <= slot.house.maxBooking) {
            
            slot.usersBooked.push(req.user);
            console.log("slot",slot);
            
            Slots.updateOne({_id: slot._id},{ usersBooked: slot.usersBooked })
              .then(response => {
                responseArr.push(response)
              })
              .catch(err => res.json(err))

          } else res.json({message: 'No more open spots in this date'});
        }
      })

      res.json(responseArr)
      //Promise all
    })
    .catch(err => res.json(err))
})

// ==================================================================================================================
// PUT booking

module.exports = router;