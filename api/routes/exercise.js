var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
require('dotenv').config();

const userSchema = new mongoose.Schema({
  username: String,
  count: Number,
  log: [{
    description: String,
    duration: Number,
    date: Date
  }]
});

const UserModel = mongoose.model('User', userSchema);

router.get('/', function(req, res, next) {

});

router.get('/users', function(req, res, next) {

  async function getAllUsers () {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    const allUsers = await UserModel.find({});
    let allUsersResponse = [];
    allUsers.forEach((user) => {
      allUsersResponse.push({_id: user._id, user: user.username})
    })
    res.send(allUsersResponse);
  }

  getAllUsers();
});

router.get('/log/:params?', function(req, res, next) {
  res.send({_id: 'id', username: 'person', count: 1, log: [{description: 1, duration: 1, date: 0}]});
});

router.post('/new-user', function(req, res, next) {
  let username = req.body.username;

  async function checkIfUserExists () {
    console.log('Checking if User exists in DB...')
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    const asyncUserFinder = await UserModel.find({'username': username});
    mongoose.connection.close();
    return asyncUserFinder
  }
  
  async function createUser () {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    const newUser = new UserModel({
      'username': username,
      count: 0,
      log: []
    });
    let userId;
    
    console.log('New user Model has been created successfully.');
    console.log(newUser);
    
    // fix below: no using callbacks in then() save mongoose calls
    newUser.save((err, user) => {
      userId = user._id;
    })
    .then(() => {
      const userMinified = {'_id': userId, 'username': username}
      console.log('User was saved!');
      mongoose.connection.close();
      res.send(userMinified);
    })
    .catch(err => {
      console.log('uh oh. error while saving:');
      res.send('it is working!');
      console.error(err);
      mongoose.connection.close();
    })
  }

  checkIfUserExists()
  .then((userFoundInDB) => {
    let userAlreadyExists = Object.keys(userFoundInDB).length;
    if (userAlreadyExists) {
      let existingUserRecord = {"_id": userFoundInDB[0]['_id'], "username": userFoundInDB[0]['username']};
      console.log(`This user already exists in the DB: ${existingUserRecord}`);
      res.send(existingUserRecord);
    } else {
      createUser();
    }
  })
});

router.post('/add', function(req, res, next) {
  console.log(req.body.userId);
  res.send({userId: 'id', description: 'workout', duration: '30', date: '10/01/2021'});
});



module.exports = router;
