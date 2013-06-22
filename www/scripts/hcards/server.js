define([
        "fs",
        "url",
        "cheerio",
        "querystring",
        "scripts/config",
        "scripts/utils",
        "hcards/url",
        "hcards/show"
    ], function(fs, url, cheerio, qs, config) {
    
    var urlToCard = require("hcards/url"),
        dataToHTML = require("hcards/show").dataToHTML,
        loadFile = require("scripts/utils").loadFile,
        trimSlash = require("scripts/utils").trimSlash,
        fileTypes = config.fileTypes,
        respErrors = config.respErrors,
        maxPostSize = config.maxPostSize,
        cardsConfig = config.HCards,
        actions = cardsConfig.actions,
        editorUrl = cardsConfig.editor,
        cardRespErr = cardsConfig.respErrors,
        index = cardsConfig.index,
        cardIndex = cardsConfig.cardIndex,
        indexFiles = config.index,
        indexFilesLen = indexFiles.length;
    
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
                console.log("HCards: Failed to load ("+status+"): " + index);
                respErrors[status](index, res);
                return;
            }
            
            loadUrl = "www/" + (cardUrl = urlToCard(req.url)) + ".json";
            
            console.log("HCards: Loading card: " + loadUrl);
            
            loadFile(loadUrl, (function createCallback(tryIndex) {
                
                return function(cardStatus, data) {
                    
                    $ = cheerio.load(file);
                    if (cardStatus >= 400) {
                        
                        if (/*cardStatus === 404 &&*/ !tryIndex) {
                            loadUrl = "www/" + cardUrl + cardIndex + ".json";
                            console.log("HCards: Loading card: " + loadUrl);
                            loadFile(loadUrl, createCallback(true));
                            return;
                        }
                        console.log("HCards: Failed to load card ("+cardStatus+"): " + loadUrl);
                        cardRespErr[cardStatus]($,cardUrl,res);
                        
                    } else {
                        
                        try {
                            data = JSON.parse(data);
                        } catch( err ) {
                            console.log("HCards: Failed to parse card " + cardUrl);
                            cardRespErr[500]($,cardUrl,res);
                        }
                        
                        data.url = cardUrl + ".json";
                        data.id = req.url;
                        
                        if (data.authors) {
                            $("head").append("<meta name=\"author\" content=\"" + data.authors.join(", ") + "\" />");
                        }
                        if (data.keywords) {
                            $("head").append("<meta name=\"keywords\" content=\"" + data.keywords.join(",") + "\" />");
                        }
                        if (data.title) {
                            $("head").append("<meta name=\"description\" content=\"Summary of " + data.title + "\" />");
                        }
                        $("#HCard-0").append(dataToHTML(data));
                        //TODO: link, link, link. Link pages/cards with <link>
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
    
    function saveFileRequest(req,res) {
        
        var body = "";
        
        req.on("data",  function(data) {
            body += data;
            if (body.length > maxPostSize) {
                req.connection.destroy();
            }
        });
        
        req.on("end", function() {
            var data = qs.parse( body ), i = 0, len, arr;
            data.lastModified = (new Date()).toJSON();
            data.authors = (data.authors && data.authors.trim().split(/,\s*/)) || [];
            data.keywords = (data.keywords && data.keywords.trim().split(/,\s*/)) || [];
            //deps
            data.seeAlso = (data.seeAlso && data.seeAlso.trim().slice(1,-1).split(/\s*\]\s*,\s*\[\s*/)) || [];
            for ( arr = data.seeAlso, len = arr.length; i < len; i++ ) {
                arr[i] = arr[i].slice(1,-1).split(/\s*["']\s*,\s*["']\s*/);
            }
            data.sideLinks = (data.sideLinks && data.sideLinks.trim().slice(1,-1).split(/\s*\]\s*,\s*\[\s*/)) || [];
            for ( arr = data.sideLinks, len = arr.length; i < len; i++ ) {
                arr[i] = arr[i].slice(1,-1).split(/\s*["']\s*,\s*["']\s*/);
            }
            
            console.log( JSON.stringify(data, null, "    ") );
        });
        
    }
    
    return function(req, res) {
        
        console.log("HCards: got request for " + req.url);
        console.log("HCards: loading " + index);
        var reqUrl = req.url,
            reqUrlObj = url.parse(req.url, true),
            path = reqUrlObj.pathname.replace(trimSlash, "").split("/"),
            last = path[path.length-1],
            loadUrl;
        reqUrl = ["./www"].concat(path).join("/");
        
        if ( req.url.slice(-1) !== "/" && last.indexOf(".") !== -1 ) {
            //serve as normal file
            
            reqUrl = "." + reqUrl;
            loadUrl = reqUrl;
            console.log("Loading " + reqUrl);
            loadFile(reqUrl, (function createCallback(index) {
                return function(status, file) {
                    if (status >= 400) {
                        if (++index < indexFilesLen) {
                            loadUrl = [reqUrl,indexFiles[index]].join("/");
                            console.log("Loading index " + loadUrl);
                            loadFile(loadUrl, createCallback(index));
                            return;
                        }
                        console.log("HCards: Failed to load (" + status + ") " + reqUrl);
                        config.respErrors[status](reqUrl ,res);
                        return;
                    }
                    console.log("HCards: Successfully loaded " + reqUrl);
                    res.writeHead(status, {
                        "Content-Type": fileTypes[path.extname(loadUrl)] || "text/plain",
                        "Content-Length": file.length
                    });
                    res.end(file);
                };
            })(-1));
            
        } else {
            if (reqUrlObj.query["action"] === actions.edit) {
                if (req.method === "POST") {
                    saveFileRequest(req);
                    //return;
                }
                loadFile(editorUrl, function(status, file) {
                    if (status >= 400) {
                        console.log("HCards: Failed to load (" + status + ") " + editorUrl);
                        serveCard( req, res );
                        return;
                    }
                    res.writeHead(status, {
                        "Content-Type": fileTypes[".html"],
                        "Content-Length": file.length
                    });
                    res.end(file);
                });
            } else {
                serveCard( req, res );
            }
        }
        
    };
});
