const express = require('express');
const mongoose = require('mongoose');
const router  = express.Router();
const Review = require('../models/Review');

router.get("/house/:id", (req, res, next) => {
    const { id } = req.params;
    Review
        .find({ idHouse: id })
        .then(reviews => res.json(reviews))
        .catch(err => console.log(err))
})

router.post("/new", (req, res, next) => {
    Review
        .create(req.body)
        .then(res.json(req.body))
        .catch(err => console.log(err))
})

router.put("/update/:id", (req, res, next) => {
    if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
      }
    const { id } = req.params;
    
    Review
        .findByIdAndUpdate(id, req.body)
        .then(res.json(req.body))
        .catch(err => console.log(err))
})

router.delete("/remove/:id", (req, res, next) => {
    if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
      }

    const { id } = req.params;

    Review
        .findByIdAndDelete(id)
        .then(response => res.json(response))
        .catch(err => console.log(err))
})

module.exports = router;