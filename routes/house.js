const express = require('express');
const router  = express.Router();
const House = require('../models/House')
const Slots = require('../models/Slots')
const axios = require('axios')

// ==================================================================================================================
// Create a house
router.post('/new', (req, res, next) => {
  const { name, 
    street, 
    streetNumber,
    complement,
    city,
    state,
    country,
    maxBooking,
    description,
    numberRooms,
    numberBath,
    garage,
    numberGarage,
    plan,
    images,
  } = req.body;

  let adressInsert = street+', '+streetNumber+', '+complement+', '+city+', '+state+', '+country;
  
  let adress = street+'+'+streetNumber+'+'+city+'+'+state+'+'+country;
  const adressValue = adress.trim().replace(/ /g, '+');

  const adressAPI = axios.create({baseURL: `https://maps.googleapis.com/maps/api/geocode/json?address=${adressValue}&key=${process.env.GOOGLE_KEY}`})
  adressAPI
    .get()
    .then(adressInfo => {
      const { lat, lng } = adressInfo.data.results[0].geometry.location;

      const location = {
        type: 'Point',
        coordinates: [lng, lat]
        };

        House.create({
          name,
          adress: adressInsert,
          street,
          streetNumber,
          complement,
          city,
          state,
          country,
          maxBooking,
          description,
          numberRooms,
          numberBath,
          garage,
          numberGarage,
          plan,
          images,
          location: location,
        })
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
              .then(slot => {})
              .catch(err => console.log(err))
      
              dateBegin.setDate(dateBegin.getDate() + 1);
              dateMid.setDate(dateMid.getDate() + 1);
      
            }
            res.json(house)
          })
          .catch(err => console.log(err))
    })
    .catch((err)=>console.log(err))
})

// ==================================================================================================================
// Find house



module.exports = router;