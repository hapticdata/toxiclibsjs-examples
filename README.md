# [Toxiclibs.js](http://github.com/hapticdata/toxiclibsjs) Examples
## [http://haptic-data.com/toxiclibsjs](http://haptic-data.com/toxiclibsjs)

##The Examples
The sites rendered example html files are located in [www/](./www). Each examples source file is in [examples/](./examples) any file ending in `.pde` is a [processing.js](http://processingjs.org) file. A description of each example is in [config.json](./config.json)


##Install dependencies
		npm install
This site uses [docco](http://jashkenas.github.com/docco/) which has additional dependencies. View the readme file for more information.


##Creating a new example
1.	Create a new javascript file in the `examples/` directory
1.	run `node build --watch` to begin watching files
1.	Add the new example into the [config.json](./config.json) file, including
the template that should be used, i.e. `pjs`, `require`, `canvas2d` or `index`