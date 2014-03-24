# [Toxiclibs.js](http://github.com/hapticdata/toxiclibsjs) Examples
## [http://haptic-data.com/toxiclibsjs](http://haptic-data.com/toxiclibsjs)

##The Examples
This repository contains the site files for [toxiclibsjs](http://github.com/hapticdata/toxiclibsjs). The site is an Express.js server and you can learn more about how this works in the [Basic System](#basic-system).
The site's examples are configured in the [sitemap.js](https://github.com/hapticdata/toxiclibsjs-examples/blob/master/sitemap.js) and located in [src/javascripts/examples/](https://github.com/hapticdata/toxiclibsjs-examples/tree/master/src/javascripts/examples/). _Each example ending in `.pde` is a [processing.js](http://processingjs.org) file._

##Run the site locally

###Install dependencies
	npm install
###Run the server
	npm start
View in browser at `http://localhost:3004`


##Basic System
1.	[Node.js](http://nodejs.org) is used for the server and build processes
1.  [Grunt](http://gruntjs.com) is used for development tasks, such as building javascript files and deploying files to s3.
1.	[Docco](http://jashkenas.github.com/docco/) is used for rendering annotated source and injecting it into the example templates
1.	[Jade](http://github.com/visionmedia/jade) is used for server-side and client-side templating
1.	[Less](http://lesscss.org) is used for stylesheet pre-processing
1.  [Require.js](http://requirejs.org) is used for loading and building site javascript files.


##Creating a new example
1.	Create a new javascript file in the `src/javascripts/examples/` directory
1.	Add a new entry into the [sitemap.js](https://github.com/hapticdata/toxiclibsjs-examples/blob/master/sitemap.js) file under `examples`, including the template that should be used, i.e. `pjs`, `require`, `canvas2d` or `index`.

_Note: after you add an entry to `sitemap.js` you will need to re-start the server for it to see the changes. Or you can use a tool like [forever](https://github.com/nodejitsu/forever)._

__________

**Project developed by [Kyle Phillips](http://haptic-data.com)**



This library is free software; you can redistribute it and/or
modify it under the terms of the GNU Lesser General Public
License as published by the Free Software Foundation; either
version 2.1 of the License, or (at your option) any later version.

[http://creativecommons.org/licenses/LGPL/2.1/](http://creativecommons.org/licenses/LGPL/2.1/)

This library is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public
License along with this library; if not, write to the Free Software
Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301, USA