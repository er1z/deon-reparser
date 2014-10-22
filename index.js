var request = require('request');
var cheerio = require('cheerio');
var url = require('url');

var express = require('express'),
    app = express();

var router = express.Router();

var q = require('q');

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

var source = request({
    url: 'http://www.deon.pl/wiadomosci/biznes-gospodarka/art,4357,czy-gaz-na-slowacje-poplynie-przez-polske.html',
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:31.0) Gecko/20100101 Firefox/31.0'
    }
}, function (error, response, body) {

    if(response.statusCode==200){

        var $ = cheerio.load(body);

        var date = $('.aktualnosc .data')[0];

        var re = /([0-9]{2}\.[0-9]{2}\.[0-9]{4}\s+[0-9]{2}:[0-9]{2})/g;

        var parsedDate = re.exec(cheerio(date).toString());

        console.log(date[0]);

    }

});

return;

var source = request({
    url: 'http://deon.pl/rss/pl/29.xml',
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:31.0) Gecko/20100101 Firefox/31.0'
    }
}, function (error, response, body) {

    if (response.statusCode == 200) {

        var $ = cheerio.load(body, {
            xmlMode: true
        });

        var contents = $('item');

        contents.each(function (i) {
            var link = cheerio('guid', contents[i]).toString();

            cheerio(contents[i]).append('<dupa />');

            if (i == contents.length - 1) {
                console.log($.toString());
            }
        });


        //res.header("Content-Type", "application/rss+xml");
        //res.status(200).send($.html());

    } else {
        //res.status(response.statusCode);
    }

});