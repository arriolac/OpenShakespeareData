var mongoose = require('mongoose');
var fs = require('fs');

//connect to your mongo DB database, change string to reflect your db's address
mongoose.connect('mongodb://localhost/open_shakespeare');

//declare mongoose schema and model
var PlaySchema = new mongoose.Schema({
  title: String,
  uriTitle: String,
  html: String
});
var Play = mongoose.model('Play', PlaySchema);

//TODO: remove .html && underscores and moby
var nameRE = / ?\d*?\.html$/;
//searches for a file called html in the current directory
var dir = __dirname+'/html/';

console.log('Looking for html files in %s', __dirname+'/html/');

// Read a list of files from a folder
fs.readdir(dir, function(err, files) {
  if (err) {
    console.error('Error reading directory: %s', err);
    return;
  }
  console.log('Found %d files', files.length);

  // Track # of files to process
  var toProcess = files.length;

  function callback() {
    toProcess--;
    if (toProcess === 0)
      process.exit();
  }

  // For each file/work
  files.forEach(function(fileName) {
    if (fileName.slice(-5) !== '.html') {
      return callback();
    }

    console.log('Processing %s', fileName);

    // Extract the name of the work from the filename
    var workName = fileName.replace(nameRE, '');

    console.log('Looking for db matching %s', workName);

    // Read the file contents
    fs.readFile(dir+'/'+fileName,{ encoding: 'utf8' }, function(err, contents) {
      if (err) {
        console.error('Failed to read file: %s', err);
        return callback();
      }
      console.log('Read file contents for %s', workName);

      //save new db entry
      var work = new Play;

      //slices title to be used in the uri-lookup for the annotations plugin
      var uriTitle = workName.slice(0, workName.length - 5);
      
      //TODO: remove underscores using regex, but this works for now 
      formattedTitle = uriTitle.replace(/\_/g,' ')
      //capitalize the first letter of each word
      work.title = formattedTitle.replace(/([^ \t]+)/g, function(_, word) { 
        var firstLetter = word[0].toUpperCase();
        return firstLetter + word.slice(1);
       })

      //store original name that is used in the uri for the annotation plugin look-up
      work.uriTitle = uriTitle;

      work.html = contents;

      //save to the db!
      work.save(function(err, saved){
        if(err) {
          console.error('Error saving %s: %s', workName, err);
          callback();
        }
        console.log('Successfully saved %s', work.title);
        callback();
      });
    });
  });
});

