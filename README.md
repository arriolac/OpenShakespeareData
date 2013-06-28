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
About the Annotator Plugin
About the Data Sets

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



![alt text][icon] 1. Add Works of Shakespeare
===================
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

![alt text][icon] 2. Add Annotations into DB
===================

```
    mongoimport --db dbname --collection annotations --file annotations.json --jsonArray
```

Since the data is very large, MongoDb will return an error unless you use --jsonArray. This puts all the JSON data into one big object that will need to be parsed out into individual db entries.

<h3> Parse MongoDb Array </h3>
--
This must be done before any of the annotation reformatting scripts can run.

<h5> edit DB location in parseJsonArray.js </h5>
Change the db location address to use your database by changing the first parameter of the MongoClient.connect() function

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

3. Convert old [AnnotateIt.org](annotateit.org) data to AnnotateIt plugin's expected schema
===================

<h5> AnnotateIt.org data example</h5>
This what is the JSON data in annotations.json looks like:

```javascript
"timed_out": false, 
  "took": 20, 
  "_shards": {
    "total": 1, 
    "successful": 1, 
    "failed": 0
  }, 
  "hits": {
    "max_score": 1.0, 
    "total": 3097, 
    "hits": 
    [ //all the annotation data we need is located in this 'hit' array
        {
        "_index": "ygtnjguco3fkhapb469t", 
        "_id": "w7QFZWoOTTynOMIHLafaQQ", 
        "_score": 1.0, 
        "_source": { //the most important information is found here inside the '_source' object
          "uri": "http://openshakespeare.org/work/romeo_and_juliet", 
          "created": "2007-09-18T08:35:43", 
          "finalsclub_id": 215, 
          "ranges": [
            {
              "start": "/p[25]", 
              "end": "/p[25]", 
              "endOffset": 84, 
              "startOffset": 0
            }
          ], 
          "quote": "Enter ROMEO, MERCUTIO, BENVOLIO, with five or six Maskers, Torch-bearers, and others", 
          "permissions": {
            "read": [
              "group:__world__"
            ]
          }, 
          "consumer": "39fc339cf058bd22176771b3e32b7448", 
          "text": "The dialogue among Romeo and his friends twists and turns and presents some\ndifficulty in being understood.\u00a0 Don\u2019t be frustrated with their language;\ntheir parents probably would have been, too, and we shouldn\u2019t expect to\nunderstand everything they say.\u00a0 The scene is of chief importance for\nintroducing Mercutio, a pivotal character in the play\u2019s plot and supposedly\none of Romeo\u2019s close friends.\u00a0 Read his speech, especially the famous\ndiscussion of Queen Mab, carefully, noting the type of language he employs.\nHow does his language strike you when compared to Romeo\u2019s?\u00a0 Benvolio\u2019s?\n\n", 
          "user": {
            "id": 8, 
            "realname": "", 
            "name": ""
          }, 
          "updated": "2012-06-29T12:14:56.421124+00:00"
        }, 
        "_type": "annotation"
      }, //more annotations ...
```

<h5>expected schema</h5>
We want the annotations.json data shown above to look like this so that it will work with the plugin:

```javascript
    // Annotation Ranges
    var Ranges = new Schema({
        start: { type: String, required: true },
        startOffset: { type: Number, required: false },
        end: { type: String, required: true},
        endOffset: { type: Number, required: false },
        _id: { type: String, required: false }, 
    });
    
    // Annotation Model
    var Annotation = new Schema({
        id: { type: String, required: false },
        user: { type: String, required: false },
        username: { type: String, required: false },
        text: { type: String, required: true },
        uri: { type: String, required: true },        
        quote: { type: String, required: true }, 
        _id: { type: String, required: false },
        permissions: {
          read: [String],
          admin: [String],
          update: [String],
          delete: [String]
        },   
        ranges: [Ranges],
        created: { type: Date, default: Date.now() },
        updated: { type: Date, default: Date.now() },
    });
```
<h3>change uri and/or ranges</h3>
--
It is really important that you run the updateAnnotationsRangesUri.js script before you run the updateAnnotationsSchema.js script. If you do not want to update the URI or ranges, skip to the edit schema step. 

<h5>edit the script to use your db</h5>
Change the db location address to use your database by changing the first parameter of the MongoClient.connect() function

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

<h5>run updateAnnotationsRangesUri.js</h5>
in the console:
```
node updateAnnotationsRangesUri.js
```
It should print whether there were any errors, successes and when it completes
<h3>edit schema</h3>
--
Ensure that if you want to edit the ranges or URI that you run the updateAnnotationsRangesUri.js script before this one.
<h5>edit script for your db</h5>
note that this script does not use Mongoose like the importShakespeareHtml.js script

```javascript
    // Retrieve
    var MongoClient = require('mongodb').MongoClient;
    
    // Connect to the db
    MongoClient.connect("mongodb://localhost:27017/open_shakespeare", function(err, db) {
      if(!err) {
        console.log("connected successfully to mongodb://localhost:27017/open_shakespeare");
        updateAnnotations(db);
      } else {
        console.error("Error connecting to mongodb://localhost:27017/open_shakespeare");
      }
    });
```






