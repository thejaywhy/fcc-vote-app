'use strict';

var Poll = require('../models/polls.model').Poll;

function PollHandler () {

  this.getPolls = function (req, res) {
    Poll
      .find(
        {},
        { '_id': false, 'displayName': true  },
        function (err, result) {
        if (err) return res.status(500).json({error: "unable to connect to database"});

        res.json({polls: result});
      });
  };

  this.getPoll = function (req, res) {
    Poll
      .find(
        {displayName: req.params.id},
        { '_id': false },
        function (err, result) {
        if (err) return res.status(500).json({error: "unable to connect to database"});

        if (result.length === 0 ) return res.status(404).json({error: "Can't find poll with name: " + req.params.id});

        res.json(result[0]);
      });
  };


  this.addPoll = function (req, res) {
    // validation
    // TODO: move validation to the model itself?
    //       or use express-validator?
    if ( req.body == null ) return res.status(400).json({error: "missing body"});
    if ( ( req.body.displayName == null ) ||
      (req.body.displayName == "" )) {
        return res.status(400).json({error: "Must give a 'displayName'"});
    }
    if ( ( req.body.choices == null ) ||
      ( req.body.choices.length == 0 ) ) {
        return res.status(400).json({error: "Must specify a 'choices' array"});
    }

    var poll = new Poll({
      displayName: req.body.displayName,
      choices: req.body.choices,
    });

    Poll.findOne(
      {'displayName': req.body.displayName },
      function (err, found) {
        if (err) return res.status(400).json({error: err});

        if (found) return res.status(400).json({error: "poll already exists"});

        poll.save(function (err) {
          if (err) return res.status(500).json({error: "Couldn't save poll to database"});

          // TODO - I don't like that we run another query here. why can't we strip internals?
          //console.log("QUERY", poll.find({_id: poll._id}));

          return res.status(201).json(poll);
        });
      });
  };

}

module.exports = PollHandler;
