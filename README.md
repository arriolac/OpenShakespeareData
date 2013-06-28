OpenShakespeareData
===================

Scripts on converting Moby's XML formatted Shakespeare works and Finals Club's annotations data to work with the AnnotateIt plugin using Mongodb/Mongoose datastore.

Overview
===================
All the resources for converting the raw data to work cohesively with the http://annotateit.org/ plugin.


Convert Works of Shakespeare from XML to HTML
===================
A big thanks to Nick Stenning for providing these scripts, resources and clear directions:

    # Clone the needed repositories
    git clone https://github.com/okfn/shakespeare
    cd shakespeare
    hg clone https://bitbucket.org/okfn/shksprdata

    # Install all the dependencies
    pip install -e . -e shksprdata

    # Configure the "shakespeare" app
    paster make-config shakespeare development.ini
    
    # Convert the Moby XML to HTML
    paster --plugin=shksprdata moby html shksprdata/shksprdata/moby

The output HTML files will go into the material_cache/moby/html directory.

Add the Shakespeare HTML to your Mongodb database
===================

