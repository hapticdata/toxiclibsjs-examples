# [Toxiclibs.js](http://github.com/hapticdata/toxiclibsjs) Examples
## [http://haptic-data.com/toxiclibsjs](http://haptic-data.com/toxiclibsjs)

##The Examples
The sites rendered example html files are located in [www/](./www). Each examples source file is in [examples/](./examples) any file ending in `.pde` is a [processing.js](http://processingjs.org) file. A description of each example is in [config.json](./config.json)


##Install dependencies
	npm install
This site uses [docco](http://jashkenas.github.com/docco/) which has additional dependencies. View the readme file for more information.



##Basic System
1.	[Node.js](http://nodejs.org) is used for compiling sources into static pages
1.	[Docco](http://jashkenas.github.com/docco/) is used for rendering annotated source and injecting it into the example templates
1.	[Jade](http://github.com/visionmedia/jade) is used for server-side templating
1.	[Less](http://lesscss.org) is used for stylesheet pre-processing


##Creating a new example
1.	Create a new javascript file in the `examples/` directory
1.	run `node build --watch` to begin watching files
1.	Add the new example into the [site.js](./src/site.js) file, including
the template that should be used, i.e. `pjs`, `require`, `canvas2d` or `index`