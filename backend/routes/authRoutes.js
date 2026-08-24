const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');

router.post('/login', async (req, res, next) => {
  try {
    const { email, name } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email to log in'
      });
    }

    let customer = await Customer.findOne({ email });
    if (!customer) {
      customer = await Customer.create({
        name: name || 'Demo Customer',
        email: email,
        phone: '9876543210',
        address: 'Hostel Block B, CSPIT, Changa'
      });
    }

    const token = jwt.sign(
      {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        role: 'Customer'
      },
      process.env.JWT_SECRET || 'quickbite_jwt_secret_key_2026',
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      customer: {
        _id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        role: 'Customer'
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
