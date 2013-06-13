// server

var requirejs = require("requirejs");

requirejs.config({
    nodeRequire: require,
    baseUrl: "www/scripts/lib/",
    paths: {
        "scripts": "../",
        "hypercards": "../hypercards"
    }
});

requirejs(["http", "path", "url", "scripts/config", "scripts/utils", "hypercards/server"], function(http, path, url) {
    var config = require("scripts/config"),
        loadFile = require("scripts/utils").loadFile,
        subSites = {};
    subSites[config.HyperCards.folder] = require("hypercards/server");
    
    http.createServer(function( req, res ) {
        var reqUrl = req.url,
            path = url.parse(reqUrl).pathname.split("/");
        if ( typeof subSites[path[0]] === "function") {
            subSites[path[0]](req, res);
            return;
        }
        reqUrl = "." + reqUrl;
        loadFile(reqUrl, function(status, file) {
            if (status >= 400) {
                config.respErrors[status](reqUrl ,res);
                return;
            }
            res.writeHead(status, {
                "Content-Type": config.fileTypes[path.extname(reqUrl)] || "text/plain",
                "Content-Length": file.length
            });
            res.end(file);
        });
    }, 8080);
});

/*var http = require("http"),
    fs = require("fs"),
    //path = require("path"),
    Url = require("url"),
    
    trimSlash = /^\/|\/$/g,
    
    config = {
        "baseUrl": "http://localhost:8080/",
        "HyperCards": {
            index: "www/hypercards.html",
            url: "/hypercards/",
            cardBaseUrl: "/cards/"
        }
    },
    
    respErrors = {
        404: function(url, res) {
            res.writeHead(404);
            res.end();
        },
        500: function(url, res) {
            res.writeHead(404);
            res.end();
        }
    },
    
    fileTypes = {
        ".html": "text/html",
        ".htm": "text/html",
        ".js": "text/javascript",
        ".json": "application.json",
        ".css": "text/css",
        ".png": "imade/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image.jpeg",
        ".gif": "image/gif",
        ".ico": "image/gif"//icon?
        //xml etc.
    },
    
    subSites = {};

    subSites[config.HyperCards.url] = function(req, res) {
        loadFile(config.HyperCards.index, function(status, file) {
            if (status >= 400) {
                respErrors[status](config.HyperCards.index,res);
                return;
            }
            loadFile(urlToCard(req.url), function(cardStatus, data) {
                data = JSON.parse(data);
                
            });
        });
    };

function urlToCard(url) {
    var cardUrl = Url.parse(url).pathname.replace(trimSlash, "").split("/");//path.resolve(url.parse(req.url).pathname);
    if (cardUrl.shift() !== config.HyperCards.index.replace(trimSlash, "")) {
        return false;
    }
    return cardUrl.join("/") + ".json";
}

function loadFile(url,callback) {
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
}

http.createServer( function(req, res) {
    
    
    
}).listen(8080);

*/
