// Retrieve
var MongoClient = require('mongodb').MongoClient;

// Connect to the db
MongoClient.connect("mongodb://localhost:27017/open_shakespeare", function(err, db) {
  if(!err) {
    console.log("connected successfully to mongodb://localhost:27017/open_shakespeare");
    updateAnnotationsRangesUri(db);
  } else {
    console.error("Error connecting to mongodb://localhost:27017/open_shakespeare");
  }
});

//update the Ranges and URI to match DOM structure
function updateAnnotationsRangesUri(db) {
  var annotations = db.collection('annotations');

  annotations.find().toArray(function(err, results) {
    if(!err) {
      results.forEach(function(annotation){
        if(annotation.ranges) {

          //extract title from URI to make a relative pathname
          var titleStart = (annotation._source.uri).search('/work') + 6,
          title = (annotation._source.uri).slice(titleStart),
          uri = '/#works/' + title;

          //edit here to create a filepath relative to your DOM structure
          var start = '/div[2]/div[1]/div[2]/div[2]' + annotation.ranges[0].start;
          var end = '/div[2]/div[1]/div[2]/div[2]' + annotation.ranges[0].end;
          annotations.update(
            //update the changes in the db.
            {'_id': annotation._id},
            {
              $set: {
                'uri': uri,
                'ranges.0.start': start,
                'ranges.0.end': end
              }
            }, 
            {safe: true}, 
            function(err, result){
              if(!err) {
                console.log('Success!');
              } else {
                console.log('Error updating annotation ranges for %s', annotation._id);
              }
            }
          );
        };
      });
    console.log("Complete!");
    } else {
      console.error("Error querying annotations collection:", err );
    }
  });
}

