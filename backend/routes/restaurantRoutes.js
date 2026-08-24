const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');

router.get('/', async (req, res, next) => {
  try {
    const restaurants = await Restaurant.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: restaurants.length,
      data: restaurants
    });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const restaurant = await Restaurant.create(req.body);
    return res.status(201).json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
