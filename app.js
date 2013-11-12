var express = require('express'),
    http = require('http'),
    path = require('path'),
    _ = require('underscore'),
    envs = require('./envs'),
    str = require('underscore.string'),
    siteMap = require('./sitemap'),
    generateDocco = require('./server/docco-generator'),
    jade = require('jade'),
    app = express(),
    config,
    read;



//strip out pagelets from examples object
var omitFor = function(key, omits){
    omits = _.isArray(omits) ? omits : [omits];
    return function(o){
        o[key] = _.map(o[key],function(ex){
            return _.omit.apply(_, [ex].concat(omits));
        });
        return o;
    };
};

/**
 * configuration for all environments
 */
config = envs( app.get('env') );

//docco is async but doesnt provide callback support :(
generateDocco( config.examples, {
    output: config.doccoPath,
    extension: '.js',
    template: 'src/views/docco.jst'
});

app.configure(function(){
    read = require('./server/utils').read(config);
	app.set('port', config.port);
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(require('less-middleware')({
        src: __dirname+'/src/less',
        force: true,
        dest: config.stylesheetsPath,
        paths: [__dirname+ '/src/less'],
        prefix: '/stylesheets',
        compress: false
    }));
	app.use(express.static(path.join(__dirname, config.staticDir)));
    app.use(express.static(__dirname + '/generated'));
    //serve toxiclibsjs node_modules
    var tP = path.join(__dirname, config.toxiclibsjsDir);
    app.use('/toxiclibsjs',express.static(tP));
	app.use(app.router);
});


app.configure('dev',function(){
    app.use(express.errorHandler());
});

//variables for every template
exports.locals = {
    pretty: true,
    env: app.get('env'),
    staticUrl: config.staticUrl,
    rootUrl: config.rootUrl
};


var render = function( res, template, vars, callback ){
    callback = callback || function(){};
    var path = __dirname + '/src/views/' + template + '.jade';
    jade.renderFile( path, _.defaults(vars, exports.locals), function(err, html){
        if( err ){
            res.send( 'ERROR', err );
        }
        res.send(html);
        callback(err,html);
    });
};

app.get('/', function(req, res){
    render(res,'index', siteMap.pages[0]);
});

//process the examples to generate id's, hrefs, etc
siteMap.examples.forEach(function(ex){
    var hyphenated = str.dasherize( str.strLeftBack(ex.src,'.') );
    ex = _.defaults( ex, { options: {} });
     _.extend(ex, {
        id: hyphenated,
        href: 'examples/'+hyphenated,
        tags: ex.tags.split(', ')
    });
});

//generate an app.get for every example
siteMap.examples.forEach(function(ex){
    app.get('/'+ex.href, function( req, res ){
        //FIXME: workaround because docco doesnt have callback
        //read the pagelet synchronously if this is the first-ever server request
        //during this process.
        if( !ex.pagelet ){
            ex.pagelet = read.docco( ex.src );
        }
        render( res,ex.template, ex );
    });
});
app.get('/api', function(req, res){
    //cant have those pagelet buffers in the response
    res.send(
        _.chain(siteMap)
        .clone()
        .tap(omitFor('examples','pagelet'))
        .value()
    );
});

if ( process.argv.indexOf('--start') > 0 ) {
    console.log('create server!');
    http.createServer(app).listen(app.get('port'), function(){
        console.log('toxiclibsjs server listening on port '+ app.get('port'));
    });
}
exports.app = app;
