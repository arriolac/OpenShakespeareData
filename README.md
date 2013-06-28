OpenShakespeareData
===================

Scripts on converting Moby's XML formatted Shakespeare works and [Finals Club](http://finalsclub.org)'s annotations data stored on AnnotateIt.org to work with the new version of the [AnnotateIt Plugin](http://annotateit.org/) using Mongodb/Mongoose datastore.

Overview
===================
All the resources for converting the raw data to work cohesively with the [AnnotateIt Plugin](http://annotateit.org/).
* Convert the works of shakespeare into the expected format and add it to your Mongodb db
* Add annotations data to your Mongodb db
* Convert the [Finals Club annotation data](http://annotateit.org/api/search_raw?q=_exists_:finalsclub_id&size=200&from=200) into schema expected by the annotateIt plugin

Works of Shakespeare
===================
See the directions below to Convert into the expected HTML format and add it to your db

<h3>Convert Works of Shakespeare from XML to HTML</h3>
--


A big thanks to Nick Stenning for providing these scripts, resources and clear directions:
<h5>install python</h5>

<h5>downloand the data and conversion scripts</h5>
    
    git clone https://github.com/okfn/shakespeare
    //!!Don't forget to cd into shakespeare  
    cd shakespeare
    hg clone https://bitbucket.org/okfn/shksprdata
    
<h5> Install all the dependencies </h5>
    
    pip install -e . -e shksprdata
    

<h5> Configure the "shakespeare" app</h5>
    
    paster make-config shakespeare development.ini
    
    
<h5>Convert the Moby XML to HTML</h5>
    
    paster --plugin=shksprdata moby html shksprdata/shksprdata/moby
    

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
<h5>edit the script to connect to your database</h5>
<h6>filename</h6>

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
Retrieve annotations
===================



