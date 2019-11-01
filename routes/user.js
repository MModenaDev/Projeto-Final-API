const express = require('express');
const router  = express.Router();
const User = require('../models/User');

router.get("/", (req, res, next) => {
    const { id } = req.user;
    User.findById(id)
        .then(user => res.json(user))
        .catch(err => res.json(err))        
})

router.put("/update", (req, res, next) => {
    const { id } = req.body;
    User.findByIdAndUpdate(id, req.body, {new: true})
        .then(user => res.json(user))
        .catch(err => res.json(err)) 
})

router.get("/delete", (req, res, next) => {
    const { id } = req.user
    User.findByIdAndDelete(id)
        .then(user => res.json(user))
        .catch(err => res.json(err)) 
})

module.exports = router;