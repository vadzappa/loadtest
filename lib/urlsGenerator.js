/**
 * Author: Vadim
 * Date: 11/11/2015
 */
var urlLib = require('url'),
    _ = require('lodash'),
    cheerio = require('cheerio');

var URLS_ARRAY = [],
    parseHtmlToArray = function (html) {
        process.nextTick(function () {
            var $ = cheerio.load(html),
                internalUrls = $('a[href^="/"]').map(function () {
                    return $(this).attr('href');
                });
            URLS_ARRAY = _.union(URLS_ARRAY, internalUrls);
            console.log(URLS_ARRAY.length);
        });
    };

module.exports = {
    initiate: function initiate() {
        return urlLib.parse.apply(null, _.toArray(arguments));
    },
    nextPath: function nextPath() {
        var randomUrlIndex = _.random(URLS_ARRAY.length - 1);
        if (URLS_ARRAY.length > 0) {
            return URLS_ARRAY[randomUrlIndex];
        }
        return '/';
    },
    consumeResponse: function consumeResponse(request) {
        var dataChunk = '';
        request.on('data', function (chunk) {
            dataChunk += chunk;
        });
        request.on('end', function () {
            parseHtmlToArray(dataChunk);
        });
    }
};