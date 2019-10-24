const express = require('express');
const router  = express.Router();
const User = require('../models/User');

router.get("/", (req, res, next) => {
    const { id } = req.user;
    User.findById(id)
        .then(user => res.json(user))
        .catch(err => console.log(err))        
})

router.post("/update", (req, res, next) => {
    const { id } = req.user;
    User.findByIdAndUpdate(id, req.body)
        .then(user => res.json(user))
        .catch(err => console.log(err)) 
})

router.get("/delete", (req, res, next) => {
    const { id } = req.user
    User.findByIdAndDelete(id)
        .then(user => res.json(user))
        .catch(err => console.log(err)) 
})

module.exports = router;