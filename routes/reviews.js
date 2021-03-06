'use strict';

const express = require('express');
const mongoose = require('mongoose');
//const passport = require('passport');
const Review = require('../models/review');
const router = express.Router();

//specify the authentication
// gonna work on this later
// router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));
/* ========== GET/READ ALL ITEMS ========== */
router.get('/', (req, res, next) => {
  Review.find({})
    .sort('name')
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});

/* ========== GET/READ A SINGLE ITEM ========== */
router.get('/:id', (req, res, next) => {
    const id = req.params.id;

    Review.find({_id: id})
    .sort('name')
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});

/* Delete Review */

router.delete('/:id', (req,res,next) => {
    const id = req.params.id;

    Review.findOneAndRemove({_id: id})
    .sort('name')
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
})

/* Post Review */
router.post('/', (req, res, next) => {
  const { name, genre, description, imgUrl } = req.body;
  const newReview = { name, genre, description, imgUrl };

  // Checking for improper input from the user
  // Check for bad ids
  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  Review.create(newReview)
    .then(result => {
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('Folder name already exists');
        err.status = 400;
      }
      next(err);
    });
});

router.put('/:id', (req, res, next) => {
  const { id } = req.params;
  const { name, description, genre, imgUrl } = req.body;
  // const userId = req.user.id;
  // Checking for improper input from the user
  // Check for bad ids
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  const updateReview = { name, description , genre , imgUrl};

  Review.findOneAndUpdate({_id: id} , updateReview, { new: true })
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('Folder name already exists');
        err.status = 400;
      }
      next(err);
    });
});

module.exports = router;
