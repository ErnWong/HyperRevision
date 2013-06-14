define([
        "fs",
        "url",
        "cheerio",
        "scripts/config",
        "scripts/utils",
        "hypercards/url",
        "hypercards/show"
    ], function(fs, url, cheerio, config) {
    
    var urlToCard = require("hypercards/url"),
        dataToHTML = require("hypercards/show").dataToHTML,
        loadFile = require("scripts/utils").loadFile,
        trimSlash = require("scripts/utils").trimSlash,
        fileTypes = config.fileTypes,
        respErrors = config.respErrors,
        cardsConfig = config.HyperCards,
        cardRespErr = cardsConfig.respErrors,
        index = cardsConfig.index,
        cardIndex = cardsConfig.cardIndex;
    
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
    
    function serveCard( req, res ) {
        
        var $, cardUrl, resBody, loadUrl;
        
        loadFile(index, function(status, file) {
            
            if (status >= 400) {
                console.log("HyperCards: Failed to load ("+status+"): " + index);
                respErrors[status](index, res);
                return;
            }
            
            loadUrl = "www/" + (cardUrl = urlToCard(req.url)) + ".json";
            
            console.log("HyperCards: Loading card: " + loadUrl);
            
            loadFile(loadUrl, (function createCallback(tryIndex) {
                
                return function(cardStatus, data) {
                    
                    $ = cheerio.load(file);
                    if (cardStatus >= 400) {
                        
                        if (cardStatus === 404 && !tryIndex) {
                            loadUrl = "www/" + cardUrl + cardIndex + ".json";
                            console.log("HyperCards: Loading card: " + loadUrl);
                            loadFile(loadUrl, createCallback(true));
                            return;
                        }
                        console.log("HyperCards: Failed to load card ("+cardStatus+"): " + loadUrl);
                        cardRespErr[cardStatus]($,cardUrl,res);
                        
                    } else {
                        
                        try {
                            data = JSON.parse(data);
                        } catch( err ) {
                            console.log("HyperCards: Failed to parse card " + cardUrl);
                            cardRespErr[500]($,cardUrl,res);
                        }
                        
                        data.url = cardUrl + ".json";
                        data.id = req.url;
                        
                        $("#HyperCard-0").append(dataToHTML(data));
                        resBody = $.html();
                        
                        res.writeHead(cardStatus, { //cardStatus should be 200, but may be other, so be aware...
                            "Content-Type": fileTypes[".html"],
                            "Content-Length": resBody.length
                        });
                        res.end(resBody);
                        
                    }
                };
            })(false));
        });
    }
    
    return function(req, res) {
        console.log("HyperCards: got request for " + req.url);
        console.log("HyperCards: loading " + index);
        var reqUrl = req.url,
            path = url.parse(req.url).pathname.replace(trimSlash, "").split("/"),
            last = path[path.length-1];
        reqUrl = ["./www"].concat(path).join("/");
        
        if ( req.url.slice(-1) !== "/" && last.indexOf(".") !== -1 ) {
            //serve as normal file
            
            reqUrl = "." + reqUrl;
            
            console.log("Loading " + reqUrl);
            loadFile(reqUrl, function(status, file) {
                if (status >= 400) {
                    console.log("HyperCards: Failed to load (" + status + ") " + reqUrl);
                    config.respErrors[status](reqUrl ,res);
                    return;
                }
                console.log("HyperCards: Successfully loaded " + reqUrl);
                res.writeHead(status, {
                    "Content-Type": config.fileTypes[path.extname(reqUrl)] || "text/plain",
                    "Content-Length": file.length
                });
                res.end(file);
            });
            
        } else {
            serveCard( req, res );
        }
    };
});
