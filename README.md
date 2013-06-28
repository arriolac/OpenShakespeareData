![alt text](https://raw.github.com/bgando/OpenShakespeareData/master/penLight.jpeg "Logo")
===================

[icon]: https://raw.github.com/bgando/OpenShakespeareData/master/penIcon.png

This is a repository of scripts that convert Moby's XML formatted Shakespeare works and [Finals Club](http://finalsclub.org)'s annotations data stored on [AnnotateIt.org](annotateit.org) to work with version 1.2.6 of the [AnnotateIt Plugin](http://annotateit.org/) and use Mongodb/Mongoose to store the data.<br>

It can be easily customized and used to migrate this data to another URL or site with a different DOM structure using the Annotator Plugin or even the xpath jQuery library to write your own custom mapping script. 

![alt text][icon]Overview
===================
All the resources for converting the raw data to work cohesively with the [AnnotateIt Plugin](http://annotateit.org/).<br>
<h5>Quick Guide/ReadMe</h5>

<h4> See Wiki pages for an in-depth exploration on these topics:</h4>
About the Annotator Plugin<br>
About the Data Sets<br>

<h4> To recreate my process, see these Wiki pages in the following order: </h4>
1. Convert Works<br>
Convert the works of Shakespeare into the expected format<br>
2. Add Works<br>
Add works of Shakespeare into your MongoDb <br>
3. Retrieve Annotations<br>
Retrieve old  [Finals Club annotation data](http://annotateit.org/api/search_raw?q=_exists_:finalsclub_id&size=3100&from=0) from [AnnotateIt.org](annotateit.org) <br>
4. Add Annotations <br>
Add the old [Finals Club annotation data](http://annotateit.org/api/search_raw?q=_exists_:finalsclub_id&size=3100&from=0) from [AnnotateIt.org](annotateit.org) to your MongoDb<br>
5. Convert Annotation Schema <br>
Convert the [Finals Club annotation data](http://annotateit.org/api/search_raw?q=_exists_:finalsclub_id&size=3100&from=0) into schema expected by the annotateIt plugin

![alt text][icon]Quick Guide/ReadMe
===================
The quick and dirty way to get your database set up correctly<br>

Follow in order:<br>
1. Add Works<br>
2. Add Annotations<br>
3. Convert Annotations<br>



![alt text][icon]1. Add Works of Shakespeare
--
See the directions below to Convert into the expected HTML format and add it to your db


<h3>Add the Shakespeare HTML to your Mongodb database</h3>
--

<h5>download dependencies: </h5>
```
    npm install
```

<h5>edit the importShakespeareHtml.js script to connect to your database</h5>

<h6>importShakespeareHtml.js</h6>

```javascript
    var mongoose = require('mongoose');
    var fs = require('fs');
    
    //edit the string to refer to your database location
    mongoose.connect('mongodb://localhost/open_shakespeare');
    
    //the script expects this schema
    var PlaySchema = new mongoose.Schema({
      title: String,
      uriTitle: String,
      html: String
    });
    
    var Play = mongoose.model('Play', PlaySchema);
```

<h5> put the importShakespeareHtml.js script in the right directory</h5>
The script will look for any .html files in a folder named html in the same directory.<br>
I like to copy the html file out of the material_cache/moby/html directory and into a separate folder with the script for organization purposes. 
<h5> run importShakespeareHtml.js</h5>

```
    node importShakespeareHtml.js
```

![alt text][icon]2. Add Annotations into DB
--

```
    mongoimport --db dbname --collection annotations --file annotations.json --jsonArray
```

Since the data is very large, MongoDb will return an error unless you use --jsonArray. This puts all the JSON data into one big object that will need to be parsed out into individual db entries.

<h3> Parse MongoDb Array </h3>
--
This must be done before any of the annotation reformatting scripts can run.

<h5> edit DB location in parseJsonArray.js </h5>
Change the db location address to use your database by changing the first parameter of the MongoClient.connect() function

<h6>parseJsonArray.js</h6>

```javascript
    // Retrieve
    var MongoClient = require('mongodb').MongoClient;
    
    // Connect to db, edit to match your db address
    MongoClient.connect("mongodb://localhost:27017/open_shakespeare", function(err, db) {
      if(!err) {
        console.log("connected successfully to mongodb://localhost:27017/open_shakespeare");
        //on successfully connecting, run updater function
        parseAnnotations(db);
      } else {
        console.error("Error connecting to mongodb://localhost:27017/open_shakespeare");
      }
    });
```
Run parseJsonArray.js in the console
```
node parseJsonArray.js
```

![alt text][icon]3. Edit URI and annotation Ranges for annotation dataset
--

<h3>Change the dataset's URI and/or the annotation Ranges</h3>
It is really important that you run the updateAnnotationsRangesUri.js script before you run the updateAnnotationsSchema.js script. If you do not want to update the URI or ranges, skip to the edit schema step. 

<h5>edit the script to use your db</h5>
Change the db location address to use your database by changing the first parameter of the MongoClient.connect() function


<h6>updateUriRanges.js</h6>
```javascript
    // Retrieve
    var MongoClient = require('mongodb').MongoClient;
    
    // Connect to db, edit to match your db address
    MongoClient.connect("mongodb://localhost:27017/open_shakespeare", function(err, db) {
      if(!err) {
        console.log("connected successfully to mongodb://localhost:27017/open_shakespeare");
        //on successfully connecting, run updater function
        updateAnnotationsRangesUri(db);
      } else {
        console.error("Error connecting to mongodb://localhost:27017/open_shakespeare");
      }
    });
```

<h5>Edit the URI/Ranges</h5>
The annotateIt plugin relies directly on the URI and xPath ranges to map the annotation data to the works of Shakespeare. For more information on how this works, see the wiki page: About Annotation Plugin.<br>


<h6>updateUriRanges.js</h6>

```javascript
  annotations.find().toArray(function(err, results) {
    if(!err) {
      results.forEach(function(annotation){
        if(annotation.ranges) {

          //extract title from URI to make a relative pathname that matches with the Annotorious router
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
```

<h5>run updateRangesUri.js</h5>
in the console:
```
node updateRangesUri.js
```
It prints whether there were any errors, successes and when it completes




![alt text][icon]4. Edit Annotation Data Schema
--
If you intend to edit the ranges or URI for this data, you must complete step 3 before step 4.

<h5>edit script for your db</h5>
Change the db location address to use your database by changing the first parameter of the MongoClient.connect() function
<h6>updateAnnotationsSchema.js</h6>
```javascript
    // Retrieve
    var MongoClient = require('mongodb').MongoClient;
    
    // Connect to the db edit this string to connect to your db: mongodb://localhost:27017/open_shakespeare
    MongoClient.connect("mongodb://localhost:27017/open_shakespeare", function(err, db) {
      if(!err) {
        console.log("connected successfully to mongodb://localhost:27017/open_shakespeare");
        updateAnnotations(db);
      } else {
        console.error("Error connecting to mongodb://localhost:27017/open_shakespeare");
      }
    });
```








