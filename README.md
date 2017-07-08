## Usage
### Requirements
* [Git](http://git-scm.com/) 
* [NodeJS](http://nodejs.org/) (with [NPM](https://www.npmjs.org/))
* [Bower](http://bower.io)
* [Gulp](http://gulpjs.com)

### Installation
1. Clone the repository: `git clone https://github.com/hdthuc93/market_data_mining.git`
2. Install the NodeJS dependencies: `npm install`.
3. Install the Bower dependencies: `bower install`.
4. Run project: `gulp (run client)`.
[http://localhost:8899](http://localhost:8899).

Ensure your preferred web server points towards the `dist` directory.

### Development
Continue developing the dashboard further by editing the `src` directory. With the `gulp` command, any file changes made will automatically be compiled into the specific location within the `dist` directory.

#### Modules & Packages
By default, rdash-angular includes [`ui.bootstrap`](http://angular-ui.github.io/bootstrap/), [`ui.router`](https://github.com/angular-ui/ui-router) and [`ngCookies`](https://docs.angularjs.org/api/ngCookies). 

If you'd like to include any additional modules/packages not included with rdash-angular, add them to your `bower.json` file and then update the `src/index.html` file, to include them in the minified distribution output.
