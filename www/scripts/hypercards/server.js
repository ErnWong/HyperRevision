define(["fs", "cheerio", "scripts/config", "scripts/utils", "hypercards/url", "hypercards/show"], function(fs,cheerio,config) {
    
    var urlToCard = require("hypercards/url"),
        dataToHTML = require("hypercards/show").dataToHTML,
        loadFile = require("scripts/utils").loadFile;
    
    /*function loadFile(url,callback) {   //MOVE THIS elsewhere (e.g. utils?)
        fs.exists(url, function(exists){
            if (exists) {
                fs.readFile(url, function(err, data){
                    if (err) {
                        callback(500);
                        return;
                    }
                    callback(404, data);
                });
            } else {
                callback(404);
            }
        });
    }*/
    return function(req, res) {
        var $, cardUrl, resBody;
        loadFile(config.HyperCards.index, function(status, file) {
            if (status >= 400) {
                config.respErrors[status](config.HyperCards.index,res);
                return;
            }
            
            loadFile((cardUrl = urlToCard(req.url)), function(cardStatus, data) {
                $ = cheerio.load(file);
                if (cardStatus >= 400) {
                    config.HyperCards.respErrors[cardStatus]($,cardUrl,res);
                } else {
                    data = JSON.parse(data);
                    $("#HyperCard-0").append(dataToHTML(data));
                    resBody = $.html();
                    res.writeHead(cardStatus, { //cardStatus should be 200, but may be other, so be aware...
                        "Content-Type": config.fileTypes[".html"],
                        "Content-Length": resBody.length
                    });
                    res.end(resBody);
                }
            });
        });
    };
});
