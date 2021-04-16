var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const { DateTime } = require('luxon');
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

  getAllUsers()
  .then(() => {
    mongoose.connection.close();
  });
});

router.get('/log/:userId?', function(req, res, next) {
  console.log(req.query)
  let userId = req.query.userId;
  let from = DateTime.fromISO(req.query.from);
  let to = DateTime.fromISO(req.query.to);
  let limit = Infinity;

  console.log('Validating parameters...')
  if (parseInt(req.query.limit)) {
    limit = req.query.limit;
  } else {
    limit = Infinity;
  }

  if (from.toISODate() && from.toISODate() <= DateTime.now().toISODate()) {
    // query is good
  } else {
    from = DateTime.fromISO('1900-01-01');
  }

  if (to.toISODate()) {
    // query is good
  } else {
    to = DateTime.now();
  }

  console.log(`final parameters: limit: ${limit}, from: ${from}, to: ${to}`)
  
  async function checkIfUserExists () {
    console.log('Checking if User exists in DB...')
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
      const asyncUserFinder = await UserModel.find({'_id': userId});
      return asyncUserFinder
    } catch (e) {
      console.error(e)
    } finally {
      mongoose.connection.close();
    }
  }
  
  checkIfUserExists()
  .then((userFoundInDB) => {
    let userExists = Object.keys(userFoundInDB).length;
    if (userExists) {
      console.log(`user: ${userFoundInDB[0].username} was found in the DB`);
      let exerciseLog = userFoundInDB[0].log;
      let newExerciseLog = [];
      let i = 0;
      while (i < limit && i < exerciseLog.length) {
        let dateFromLog = new Date(exerciseLog[i].date);
        dateFromLog = dateFromLog.toISOString();
        dateFromLog = DateTime.fromISO(dateFromLog);
        if (dateFromLog > from && dateFromLog < to) {
          newExerciseLog.push(exerciseLog[i]);
        }
        i++;        
      }
      userFoundInDB[0].log = newExerciseLog;
      console.log(`originalExerciseLog: ${exerciseLog}`);
      console.log(`newExerciseLog: ${newExerciseLog}`);
      res.send(userFoundInDB);
    } else {
      res.send(`userId: ${userId} was not found in the database!`);
    }
  })
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
    
    newUser.save()
    .then((user, err) => {
      userId = user._id;
      const userMinified = {'_id': userId, 'username': username}
      console.log('User was saved!');
      mongoose.connection.close();
      res.send(userMinified);
    })
    .catch(err => {
      console.log('uh oh. error while saving:');
      res.send('error');
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
      console.log(`User not found. Creating new user...`)
      createUser();
    }
  })
});

router.post('/add', function(req, res, next) {
  let userId = req.body.userId;
  let description = req.body.description;
  let duration = parseInt(req.body.duration);
  let date = DateTime.fromISO(req.body.date);
  let newExerciseRecordLog = {"_id": userId, "description": description, "duration": duration, "date": ""}
  
  if (userId && description && duration) {
    console.log('All required parameters are present.');
  } else {
    console.log('Missing one or more required parameters');
    res.status(400);
    res.send('Please submit request again with required parameters: userId, description and duration');
    return
  }

  console.log('Validating date...');
  if (date.toISODate() && date.toISODate() <= DateTime.now().toISODate()) {
    console.log(`${date} is a valid date`);
    console.log(date.toISODate())
    newExerciseRecordLog.date = date.toISODate();
  } else {
    console.log(`Date was either undefined or not a valid date. Using today's date: ${DateTime.now().toISODate()}`)
    newExerciseRecordLog.date = DateTime.now().toISODate();
  }

  console.log(`Exercise record to be added in log:`)
  console.log(newExerciseRecordLog);

  async function checkIfUserExists () {
    console.log('Opening MongoDB Atlas connection...')
    console.log('Checking if User exists in DB...')
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    const asyncUserFinder = await UserModel.findOne({'_id': userId});
    return asyncUserFinder
  }
  
  async function run () {
    const userFoundInDB = await checkIfUserExists();
    let userExists = Object.keys(userFoundInDB).length;
    if (userExists) {
      console.log(`User record found in the DB.`);
      console.log('adding new exercise record to log...')
      try {
        userFoundInDB.log.push(newExerciseRecordLog);
        userFoundInDB.count = userFoundInDB.log.length;
        // console.log(userFoundInDB.log);
        await userFoundInDB.save();
        let responseWithUsername = newExerciseRecordLog;
        responseWithUsername.username = userFoundInDB.username;
        res.send(responseWithUsername);
        console.log('Closing MongoDB connection...')
        await mongoose.connection.close();
        return 
      } catch (err) {
        console.error('unexpected error encontered.')
        console.error(err);
      }
    } else {
      res.send(`userId: ${userId} was not found in the database!`);
    }
  }

  run();
});



module.exports = router;
