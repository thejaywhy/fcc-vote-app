'use strict';

//During the test the env variable is set to test
process.env.NODE_ENV = 'unit-test';
process.env.DB_URI = "mongodb://localhost/testDatabase";
process.env.DB = "testShort";
process.env.COLLECTION = "testUrls";
process.env.PORT = "3010";

// Set up Mongoose
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

require('./app/models/polls.test.js')
