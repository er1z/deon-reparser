var request = require('request');
var cheerio = require('cheerio');
var url = require('url');

var express = require('express'),
    app = express();

var router = express.Router();

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
    url: 'http://deon.pl/rss/pl/29.xml',
    headers:
    {
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:31.0) Gecko/20100101 Firefox/31.0'
    }
}, function(error, response, body){

    if(response.statusCode==200){

        var $ = cheerio.load(body, {
            xmlMode: true
        });

        var contents = $('content');

        contents.each(function(i){
            var content = contents.eq(i).html();

            content = content.replace(/<!\[CDATA\[([^\]]+)\]\]>/ig, "$1");

            var sub = cheerio.load(content);
            var subs = sub('a');


        });


        res.header("Content-Type", "application/rss+xml");
        res.status(200).send($.html());

    }else{
        res.status(response.statusCode);
    }

});