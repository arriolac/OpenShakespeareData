
// Retrieve
var MongoClient = require('mongodb').MongoClient;

// Connect to the db
MongoClient.connect("mongodb://localhost:27017/open_shakespeare", function(err, db) {
  if(!err) {
    console.log("connected successfully to mongodb://localhost:27017/open_shakespeare");
    parseAnnotations(db);
  } else {
    console.error("Error connecting to mongodb://localhost:27017/open_shakespeare");
  }
});

function parseAnnotations(db) {
  var annotations = db.collection('annotations');

  annotations.find().toArray(function(err, results) {
    if(!err) {
      console.log('query returned', results);
      results[0].hits.hits.forEach(function(annotation){
        annotations.insert(annotation, {safe: true}, function(err, records){
          if(!err) {
            console.log("Record added as "+records[0]._id);
          } else {
            console.error("error")
          }
        });
      });
    db.close();
    console.log("Db closed");
    } else {
      console.error("Error querying annotations collection:", err );
    }
  });
}