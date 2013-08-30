/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var scraper = require('./scraper');
var async = require('async');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', function (req, res) {
    var value = req.query.q || "bil";

    async.parallel({
                "rgsi": function (callback) {
                    var url = "http://www.gulesider.no/finn:" + encodeURIComponent(value);
                    scraper.scrape(url, '.company-hit h2 a', "utf-8", function (result) {
                        callback(null, result, url);
                    });
                },
                "r1881": function (callback) {
                    var url = "http://www.1881.no/?Query=" + encodeURIComponent(value);
                    scraper.scrape(url, '.listing h3 a', "utf-8", function (result) {
                        callback(null, result, url);
                    });
                },
                "rgoogle": function (callback) {
                    var url = "https://www.google.no/search?q=" + encodeURIComponent(value);
                    scraper.scrape(url, ".g h3 a", "binary", function (result) {
                        callback(null, result, url);
                    });
                }
            },
            function (err, result) {
                if (!err) {
                    res.render('index',
                            {
                                rgsi: {
                                    data: result.rgsi[0],
                                    url: result.rgsi[1]
                                },
                                r1881: {
                                    data: result.r1881[0],
                                    url: result.r1881[1]
                                },
                                rgoogle: {
                                    data: result.rgoogle[0],
                                    url: result.rgoogle[1]
                                },
                                query: value
                            });

                } else {
                    res.send("ERROR " + err);
                }
            }
    );
});

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
