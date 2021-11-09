'use strict';

const express = require('express');
const authRoutes = express.Router();
const  {users}  = require('../models/index');
const basicAuth = require('../middleware/basic')
const bearerAuth = require('../middleware/bearer.js')
const permissions = require('../middleware/acl.js')



authRoutes.post('/signup', async (req, res, next) => {


  res.send('helldddddddddo')

  try {
    // console.log(req.body);
    let userRecord = await users.create(req.body);
    // console.log('userRecord',userRecord);
    const output = {
      user: userRecord,
      token: userRecord.token
    };
    res.status(201).json(output);
  } catch (e) {
    next(e.message)
  }
});




authRoutes.post('/signin', basicAuth, (req, res, next) => {
  const user = {
    user: req.user,
    token: req.user.token
  };
  res.status(200).json(user);
});



authRoutes.get('/users', bearerAuth, permissions('delete'), async (req, res, next) => {
  const userRecords = await users.findAll({});
  const list = userRecords.map(user => user.username);
  res.status(200).json(list);
});



authRoutes.get('/secret', bearerAuth, async (req, res, next) => {
  res.status(200).send('Welcome to the secret area')
});



module.exports = authRoutes;
