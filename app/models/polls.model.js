'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PollChoiceSchema = Schema({
  displayName: {
    type: String,
    required: true
  },
  votes: {
    type: Number,
    default: 0
  }
});

// Defining schema for our Polls
var PollSchema = Schema({
  displayName: {
    type: String,
    required: true
  },
  choices: [PollChoiceSchema],
  created_on: {
    type: Date,
    default: Date.now
  },
});

//Exporting our model
var PollModel = mongoose.model('Poll', PollSchema);
var PollChoice = mongoose.model('PollChoice', PollChoiceSchema);

module.exports = {
  Poll: PollModel,
  Choice: PollChoice
};
