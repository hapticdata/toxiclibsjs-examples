var express = require('express'),
    fs = require('fs'),
    http = require('http'),
    path = require('path'),
    mkdirp = require('mkdirp'),
    _ = require('underscore'),
    envs = require('./envs'),
    str = require('underscore.string'),
    siteMap = require('./sitemap'),
    generateDocco = require('./server/docco-generator'),
    legacyRoutes = require('./server/legacy-routes'),
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

var doccoPath = path.join(__dirname, config.doccoPath);
mkdirp(doccoPath, function(){
  //docco is async but doesnt provide callback support :(
  generateDocco( path.join(__dirname, config.examples), {
      output: doccoPath,
      extension: '.js',
      template: path.join(__dirname,'src/views/docco.jst')
  });
})

app.configure(function(){
    read = require('./server/utils').read(config);
	app.set('port', config.port);
	app.use(express.favicon(path.join(__dirname, 'src/favicon.ico')));
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(require('less-middleware')({
        src: __dirname+'/src/less',
        force: true,
        dest: __dirname +'/'+ config.stylesheetsPath,
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
    githubExamples: config.githubExamples,
    toxiclibsjsBuildUrl: config.toxiclibsjsBuildUrl,
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

var routeToIndex = function(req, res){
    render(res,'index', siteMap.pages[0]);
};
app.get('/',routeToIndex);
app.get('/examples/', routeToIndex);
app.use(function( req, res ){
    res.send({
        status: 404,
        message: "File not Found",
        url: req.url
    });
});

//process the examples to generate id's, hrefs, etc
siteMap.examples.forEach(function(ex){
    var hyphenated = str.dasherize( str.strLeftBack(ex.src,'.') );
    ex = _.defaults( ex, { options: {} });
     _.extend(ex, {
        id: hyphenated,
        href: 'examples/'+hyphenated,
        tags: ex.tags.split(', '),
        exampleBody: fs.readFileSync( __dirname + '/src/javascripts/examples/'+ex.src, 'utf8')
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
        .tap(omitFor('examples','pagelet', 'exampleBody'))
        .tap(function(siteMap){
            siteMap.examples = siteMap.examples.filter(function(e){
                return !e.private;
            });
        })
        .value()
    );
});

_.each(legacyRoutes.routes, function( newRoute, oldRoute ){
    app.get('/'+oldRoute, function( req, res ){
        console.log( res );
        res.redirect( exports.locals.rootUrl + newRoute );
    });
});


if ( process.argv.indexOf('--start') > 0 ) {
    console.log('create server!');
    http.createServer(app).listen(app.get('port'), function(){
        console.log('toxiclibsjs server listening on port '+ app.get('port'));
    });
}
exports.app = app;
