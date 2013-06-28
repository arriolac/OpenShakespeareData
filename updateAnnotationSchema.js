// Retrieve
var MongoClient = require('mongodb').MongoClient;

// Connect to the db
MongoClient.connect("mongodb://localhost:27017/open_shakespeare", function(err, db) {
  if(!err) {
    console.log("connected successfully to mongodb://localhost:27017/open_shakespeare");
    updateAnnotationsSchema(db);
  } else {
    console.error("Error connecting to mongodb://localhost:27017/open_shakespeare");
  }
});

//update Annotations
function updateAnnotationsSchema(db) {
  //uses annotations Collection
  var annotations = db.collection('annotations');
  //finds all annotations and updates them to the co
  annotations.find().toArray(function(err, results) {
    if(!err) {
      results.forEach(function(annotation){
        if (annotation._source) {
          var user = annotation._source.user,
          username = annotation._source.username,
          text = annotation._source.text,
          uri = annotation._source.uri,
          quote = annotation._source.quote,
          _id = annotation._id,
          permissions = annotation._source.permissions,
          ranges = annotation._source.ranges,
          updated = annotation._source.updated,
          created = annotation._source.created;

          annotations.update(
            {'_id': annotation._id},
            {
            'user': user,
            'username': username,
            'text': text,
            'uri': uri,
            'quote': quote,
            '_id': _id,
            'permissions': permissions,
            'ranges': ranges,
            'updated': updated,
            'created': created
            }, 
            {safe: true}, 
            function(err, result){
              if(!err) {
                console.log("successfully updated");
              } else {
                console.log('Error updating annotation schema');
              }
            }
          );
        };
      });
    console.log("Db closed");
    } else {
      console.error("Error querying annotations collection:", err );
    }
  });
}

