![alt text](https://raw.github.com/bgando/OpenShakespeareData/master/penLight.jpeg "Logo")OpenShakespeareData
===================

Scripts on converting Moby's XML formatted Shakespeare works and [Finals Club](http://finalsclub.org)'s annotations data stored on [AnnotateIt.org](annotateit.org) to work with the new version of the [AnnotateIt Plugin](http://annotateit.org/) using Mongodb/Mongoose datastore.

Overview
===================
All the resources for converting the raw data to work cohesively with the [AnnotateIt Plugin](http://annotateit.org/).
* Convert the works of shakespeare into the expected format and add it to your Mongodb db
* Add the old [Finals Club annotation data](http://annotateit.org/api/search_raw?q=_exists_:finalsclub_id&size=3100&from=0) from [AnnotateIt.org](annotateit.org) to your Mongodb db
* Convert the [Finals Club annotation data](http://annotateit.org/api/search_raw?q=_exists_:finalsclub_id&size=3100&from=0) into schema expected by the annotateIt plugin

Works of Shakespeare
===================
See the directions below to Convert into the expected HTML format and add it to your db

<h3>Convert Works of Shakespeare from XML to HTML</h3>
--


A big thanks to [Nick Stenning](https://github.com/nickstenning) for providing these scripts, resources and clear directions:
<h5>install python</h5>

<h5>downloand the data and conversion scripts</h5>

```    
    git clone https://github.com/okfn/shakespeare
    //!!Don't forget to cd into shakespeare  
    cd shakespeare
    hg clone https://bitbucket.org/okfn/shksprdata
```    
<h5> Install all the dependencies </h5>

```    
    pip install -e . -e shksprdata
```
<h5> Configure the "shakespeare" app</h5>

```
    paster make-config shakespeare development.ini
``` 
    
<h5>Convert the Moby XML to HTML</h5>

```
    paster --plugin=shksprdata moby html shksprdata/shksprdata/moby
``` 

The output HTML files will go into the material_cache/moby/html directory.

<h4> Side Note: Other Formats </h4>
It is possible to convert this data into other formats such as JSON and render it into the corresponding html format on the client side. I would reccomend this if you want more power over your data.
<h5> samples </h5>

<h3>Add the Shakespeare HTML to your Mongodb database</h3>
--


<h5>dependencies: </h5>
* [Node](http://nodejs.org/)
* [Mongodb node driver](https://npmjs.org/package/mongodb) <br>

```
    npm install mongodb
```

* [Mongoose](https://npmjs.org/package/mongoose) <br>

```
npm install mongoose
```

<h5>edit the importShakespeareHtml.js script to connect to your database</h5>

<h6>importShakespeareHtml.js</h6>

```javascript
    var mongoose = require('mongoose');
    var fs = require('fs');
    
    //edit the string to refer to your database location
    mongoose.connect('mongodb://localhost/open_shakespeare');
    
    //the script expects this schema
    //this is flexible but will have to match throughout your application
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

Retrieve annotations from [AnnotateIt.org](annotateit.org)
--

<h3>Save json file</h3>
<h6> Not necessary for you to do, but I wanted to outline where and how I recieved the data. The annotations.json file is the result of theis process:</h6> 
Download all the data returned by the Annotatit.org API query for all previously stored annotations by FinalsClub.org and saves it into a file called annotations.json

```
curl -o annotations.json http://annotateit.org/api/search_raw?q=_exists_:finalsclub_id&size=3100&from=0
```

--

<h3>Run script to add it into db</h3>
--

Convert old [AnnotateIt.org](annotateit.org) data to AnnotateIt plugin's expected schema
--

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






