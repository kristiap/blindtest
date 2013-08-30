var jsdom = require('jsdom');

exports.scrape = function (url, cssSelector, encoding, callback) {
    jsdom.env({
        "url": url,
        "scripts": ["http://code.jquery.com/jquery.js"],
        "encoding": encoding,
        "done": function (errors, window) {
            var $ = window.jQuery;
            callback($(cssSelector));
            window.close();
        }
    });
};
