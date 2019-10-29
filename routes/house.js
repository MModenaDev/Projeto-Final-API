const express = require('express');
const router  = express.Router();
const House = require('../models/House')
const Slots = require('../models/Slots')
const axios = require('axios')
const mongoose = require('mongoose')
const uploadCloud = require('../configs/cloudinary');

// ==================================================================================================================
// POST house / POST slots of this house
router.post('/new', uploadCloud.single('photo'), (req, res, next) => {
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

  // const { images } = req.file.url;

  let adressInsert = street+', '+streetNumber+', '+complement+', '+city+', '+state+', '+country;
  
  const streetAdj = street.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const cityAdj = city.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const stateAdj = state.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const countryAdj = country.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  let adress = streetAdj+'+'+streetNumber+'+'+cityAdj+'+'+stateAdj+'+'+countryAdj;
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
        console.log("a");
        
        House.create({
          name,
          adress: adressInsert,
          street: streetAdj,
          streetNumber,
          complement,
          city: cityAdj,
          state: stateAdj,
          country: countryAdj,
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
      
            let dateEnd = new Date(2019,10,05,0,0,0);
      
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
              .catch(err => res.json(err))
      
              dateBegin.setDate(dateBegin.getDate() + 1);
              dateMid.setDate(dateMid.getDate() + 1);
      
            }
            res.json(house)
          })
          .catch(err => res.json(err))
    })
    .catch((err) => {
      console.log("b");
      
      res.json(err)
    })
})

// ==================================================================================================================
// GET all houses / GET all houses by city
router.get('/search', (req, res, next) => {
  const { city } = req.query;
  const adjCity = city.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  if (city === '') {
    House.find()
      .then(allHouses => res.json(allHouses))
      .catch(err => res.json(err))
  } else {
    House.find({ city: adjCity })
      .then(housesByCity => res.json(housesByCity))
      .catch(err => res.json(err))
  }
})

// ==================================================================================================================
// GET House by id
router.get('/:id', (req, res, next) => {

  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  const { id } = req.params;
  
  House.findById(id)
    .then(house => res.json(house))
    .catch(err => res.json(err))
})

// ==================================================================================================================
// PUT House by id
router.put('/:id', (req, res, next) => {

  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  const { id } = req.params;

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
  
  const streetAdj = street.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const cityAdj = city.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const stateAdj = state.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const countryAdj = country.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  let adress = streetAdj+'+'+streetNumber+'+'+cityAdj+'+'+stateAdj+'+'+countryAdj;
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

      const updateHouse = {
        name,
        adress: adressInsert,
        street: streetAdj,
        streetNumber,
        complement,
        city: cityAdj,
        state: stateAdj,
        country: countryAdj,
        maxBooking,
        description,
        numberRooms,
        numberBath,
        garage,
        numberGarage,
        plan,
        images,
        location: location,
      }

      House.findByIdAndUpdate(id, updateHouse, { new: true })
        .then(house => res.json(house))
        .catch(err => res.json(err))
    })
    .catch((err) => res.json(err))
})

// ==================================================================================================================
// Delete House by id

router.delete('/:id', (req, res, next) => {
  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  const { id } = req.params;

  Slots.deleteMany({ house: id })
    .then(response => {
      House.findByIdAndDelete(id)
        .then(res.json({message: `House ${id} removed with sucess!`}))
        .catch(err => res.json(err))
    })
    .catch(err=>res.json(err))
})

module.exports = router;