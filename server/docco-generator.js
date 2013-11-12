var fs = require('fs'),
    docco = require('docco'),
    _ = require('underscore'),
    defaults;


defaults = {
    output: 'docs/',
    extension: '.js',
    template: __dirname + '../src/views/docco.jst'
};

//filter the files in the directory to only example files
var isExampleFile = function( filename ){
    return filename.match(/(\.js$|\.pde$)/);
};
//ensure theres a trailing slash
var cleanDirectoryName = function( directory ){
    if( directory.charAt(directory.length-1) !== '/' ){
        directory += '/';
    }
    return directory;
};
//read the directory and return the examples
var getFiles = function( directory, callback ){
    directory = cleanDirectoryName( directory );
    fs.readdir( directory, function( err, files ){
        if( err ){
            callback( err );
            return;
        }
        callback( null, files
            .filter(isExampleFile)
            .map(function( filename ){
                return directory + filename;
            })
        );
    });
};

/**
 * Generate Docco pagelets for the given directory
 * @param {String} directory of example files
 * @param {Object} options docco options
 * @param {Function} callback
 */
module.exports = function( directory, options, callback ){
    callback = callback || function(){};
    getFiles( directory, function( err, files ){
       if( err ){
           callback( err );
           return;
        }
        options.args = files;
        var completed = 0;
        docco.document( _.defaults(options, defaults), function(output){
            completed++;
            console.log('completed: ', completed);
            if( completed === files.length ){
                callback(files);
            }
        });
    });
};

