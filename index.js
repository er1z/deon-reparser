var request = require('request');
var cheerio = require('cheerio');
var url = require('url');

var express = require('express'),
    app = express();

var router = express.Router();

var Q = require('q');

/*var port = require('./package.json').options.port;

 app.use(router);

 app.get('/reparse', function(req,res){


 if(!req.query.id){
 res.status(404);
 return;
 }


 });

 app.listen(port);
 console.log('Listening on: '+port);*/

var getPageDate = function (url) {

    var defer = Q.defer();

    request({
        url: url,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:31.0) Gecko/20100101 Firefox/31.0'
        }
    }, function (error, response, body) {

        if (response.statusCode == 200) {

            var $ = cheerio.load(body);

            var date = $('.aktualnosc .data')[0];

            var re = /([0-9]{2})\.([0-9]{2})\.([0-9]{4})\s+([0-9]{2}):([0-9]{2})/g;

            var p = re.exec(cheerio(date).toString());

            var dateObject = new Date(p[3] + '-' + p[2] + '-' + p[1] + ' ' + p[4] + ':' + p[5]);

            defer.resolve(dateObject);

        }else{
            defer.reject(error);
        }

    });


    return defer.promise;

}

var callback = function(node){
    var defer = Q.defer();

    var link = cheerio('guid', node).text();

    getPageDate(link).then(function(date){
        cheerio(node).append('<pubDate>'+date.toUTCString()+'</pubDate>');

        defer.resolve();
    });

    return defer.promise;
}

var source = request({
    url: 'http://deon.pl/rss/pl/29.xml',
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:31.0) Gecko/20100101 Firefox/31.0'
    }
}, function (error, response, body) {

    if (response.statusCode == 200) {

        var $ = cheerio.load(body, {
            xmlMode: true,
            lowerCaseTags: false
        });

        var contents = $('item');

        var callbacks = [];

        contents.each(function (i) {
            callbacks.push(callback(contents[i]));
        });

        Q.all(callbacks).then(function(){
            console.log($.html());
        });

        //res.header("Content-Type", "application/rss+xml");
        //res.status(200).send($.html());

    } else {
        //res.status(response.statusCode);
    }

});