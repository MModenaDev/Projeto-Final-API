const express = require('express');
const mongoose = require('mongoose');
const router  = express.Router();
const formData = require('express-form-data')
const cloudinary = require('cloudinary')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

router.use(formData.parse())

router.post('/image-upload', (req, res, next) => {

  const values = Object.values(req.files)
  const promises = values.map(image => cloudinary.uploader.upload(image.path))
  
  Promise
    .all(promises)
    .then(results => res.json(results))

})

module.exports = router;