OpenShakespeareData
===================

Scripts on converting Moby's XML formatted Shakespeare works and Finals Club's annotations data to work with the AnnotateIt plugin using Mongodb/Mongoose datastore.

Overview
===================
All the resources for converting the raw data to work cohesively with the http://annotateit.org/ plugin.


Convert Works of Shakespeare from XML to HTML
===================
A big thanks to Nick Stenning for providing these scripts, resources and clear directions:
<h3>Install Dependencies</h3>
* Python
* pip
    ```bash
    // Clone the needed repositories
    git clone https://github.com/okfn/shakespeare
    cd shakespeare
    hg clone https://bitbucket.org/okfn/shksprdata

    // Install all the dependencies
    pip install -e . -e shksprdata

    // Configure the "shakespeare" app
    paster make-config shakespeare development.ini
    
    // Convert the Moby XML to HTML
    paster --plugin=shksprdata moby html shksprdata/shksprdata/moby
    ```

The output HTML files will go into the material_cache/moby/html directory.

Add the Shakespeare HTML to your Mongodb database
===================

<h3>dependencies: </h3>
* Node: http://nodejs.org/<br>
* Mongodb node driver: https://npmjs.org/package/mongodb<br>
```bash    
npm install mongodb
```
* Mongoose: https://npmjs.org/package/mongoose<br>
```bash
    npm install mongoose
```
<h3>edit the script to connect to your database</h3>
<h5>filename</h5>

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
<h3></h3>



