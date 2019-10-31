const express = require('express');
const router  = express.Router();
const House = require('../models/House')
const Slots = require('../models/Slots')
const axios = require('axios')
const mongoose = require('mongoose')

// ==================================================================================================================
// Add user booking - UPDATE

router.put('/:houseId/bookuser', (req, res, next) => {  
  const { houseId } = req.params;
  const { dateStart, dateFinish } = req.body;

  let dateStartAdj = new Date(dateStart)
  let dateFinishAdj = new Date(dateFinish)
  
  let responseArr = [];
  let countLoop = 1

  Slots.find({ house: houseId })
    .populate('house')
    .then (allSlots => {
      
      let slotsFilter = allSlots.filter(slot => {        
        let dateStartSlotAdj = new Date(slot.dateStart)
        let dateFinishSlotAdj = new Date(slot.dateFinish)
        return (dateStartSlotAdj >= dateStartAdj && dateFinishSlotAdj <= dateFinishAdj)
      })
      
      slotsFilter.forEach(slot => {
        if (slot.usersBooked.length < slot.house.maxBooking) {
          
          slot.usersBooked.push(req.user);
          
          responseArr.push(Slots.findByIdAndUpdate(slot._id,{ usersBooked: slot.usersBooked }, {new: true}))
          console.log(responseArr);
          
          if (countLoop < slotsFilter.length) {
            countLoop += 1;
            console.log(countLoop);              
          } else {

            Promise.all(responseArr)
              .then(responses => {
                console.log(responses);
                
                res.json(responses)})
              .catch(err => res.json(err))  
          }
        } else res.json({message: 'No more open spots in this date'});
      })
    })
    .catch(err => res.json(err))
})

// ==================================================================================================================
// Remove user booking - UPDATE

router.put('/:houseId/unbookuser', (req, res, next) => {
  const { houseId } = req.params;
  const { dateStart, dateFinish } = req.body;

  let dateStartAdj = new Date(dateStart)
  let dateFinishAdj = new Date(dateFinish)
  
  let responseArr = [];
  let countLoop = 1

  Slots.find({ house: houseId })
    .populate('house')
    .then (allSlots => {
      
      let slotsFilter = allSlots.filter(slot => {        
        let dateStartSlotAdj = new Date(slot.dateStart)
        let dateFinishSlotAdj = new Date(slot.dateFinish)
        return (dateStartSlotAdj >= dateStartAdj && dateFinishSlotAdj <= dateFinishAdj)
      })
      
      slotsFilter.forEach(slot => {
          
          slot.usersBooked.splice(slot.usersBooked.indexOf(slot.usersBooked._id === req.user_id, 0), 1);
          
          responseArr.push(Slots.findByIdAndUpdate({_id: slot._id},{ usersBooked: slot.usersBooked }))
          
          if (countLoop < slotsFilter.length) {
            countLoop += 1;
            console.log(countLoop);              
          } else {

            Promise.all(responseArr)
              .then(responses => {
                console.log(responses);               
                res.json(responses)})
              .catch(err => res.json(err))  
          }
      })
    })
    .catch(err => res.json(err))
})

// ==================================================================================================================
// GET booking

router.get('/search/:houseId', (req, res, next) => {
  const { houseId } = req.params;
  const { dateStart, dateFinish } = req.query;
  console.log("a");
  console.log(dateStart);
  console.log(dateFinish);
  
  
  
  if ((dateStart === undefined && dateFinish === undefined) || (dateStart === null && dateFinish === null) || (dateStart === '' && dateFinish === '')) {
    console.log("b");
    Slots.find({ house: houseId })
    .then (allSlots => {res.json(allSlots)})
    .catch(err => res.json(err))

  } else {
    let dateStartAdj = new Date(dateStart)
    let dateFinishAdj = new Date(dateFinish)
    console.log("c");
    
    
    Slots.find({ house: houseId })
      .then (allSlots => {

        let slotsFilter = allSlots.filter(slot => {        
          let dateStartSlotAdj = new Date(slot.dateStart)
          let dateFinishSlotAdj = new Date(slot.dateFinish)
          return (dateStartSlotAdj >= dateStartAdj && dateFinishSlotAdj <= dateFinishAdj)
        })
        res.json(slotsFilter)
      })
      .catch(err => res.json(err))
  }
})
// ==================================================================================================================
// GET all booking


module.exports = router;