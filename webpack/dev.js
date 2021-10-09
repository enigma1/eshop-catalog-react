const common = require('./config');
var bodyParser = require('body-parser');
const {defaults} = require('jest-config');

console.log(defaults);
console.log('[Webpack] Using dev configuration\n');

const proxyServer = 'https://www.example.com:5443/';

const dev = Object.assign({}, {
  devServer: {
    port: 8181,
    static: './public/development',
    host: 'www.example.com',
    hot: false,
    https: true,
    // Set this for rewrites and to enable js router access
    historyApiFallback: true,
    //disableHostCheck: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    // berfore: function(app) {
    //   app.use(bodyParser.json());
    //   app.use(bodyParser.urlencoded({
    //       extended: true
    //   }));

    //   app.post(/^\/(URL1|URL2|URL3)\//, function(req, res) {
    //       var serviceCallResponse = request('POST', 'your app server url here' + req.originalUrl, {
    //           json:req.body
    //       });
    //       res.send(serviceCallResponse.getBody('utf8'));
    //   });
    // },
    // setup(app) {
    //   console.log('request');
    //   app.post('*', (req, res) => {
    //       res.redirect(req.originalUrl);
    //   });
    // },
    // proxy: {
    //   '/api/**': proxyServer
    // //   //'/api':,
    // //   //'/**': {
    // //   '/search-in-products/**': "https://www.example.com:5443/"
    // },
    open: false,
  },
  mode: 'development',
  //devtool: '#source-map',
}, common);

module.exports = dev;