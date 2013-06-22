// server

var requirejs = require("requirejs");

requirejs.config({
    nodeRequire: require,
    baseUrl: "www/scripts/lib/",
    paths: {
        "scripts": "..",
        "hcards": "../hcards",
        "server":  "../../../"
    }
});

requirejs([
        "http",
        "path",
        "url",
        "scripts/config",
        "scripts/utils",
        "hcards/server"
    ], function(http, path, url, config, utils, hcards) {
        
    var loadFile = utils.loadFile,
        respErrors = config.respErrors,
        fileTypes = config.fileTypes,
        indexFiles = config.index,
        trimSlash = config.trimSlash,
        indexFilesLen = indexFiles.length,
        subSites = {};
    subSites[config.HCards.folder] = hcards;//require("hcards/server");
    
    console.log("Port: " + config.port);
    console.log("IP:   " + process.env.IP);
    
    http.createServer(function( req, res ) {
        var reqUrl = req.url,
            reqPath = url.parse(reqUrl).pathname.replace(trimSlash,"").split("/"),
            loadUrl;
        
        console.log("Got request for \t" + reqUrl);
        console.log("Request path: \t" + reqPath);
        
        if ( typeof subSites[reqPath[0]] === "function") {
            console.log("Redirecting to " + reqPath[0] +"'s server");
            subSites[reqPath[0]](req, res);
            return;
        }
        
        reqUrl = ["./www"].concat(reqPath).join("/");
        loadUrl = reqUrl;
        console.log("Loading " + reqUrl);
        loadFile(reqUrl, (function createCallback(index) {
            return function(status, file) {
                if (status >= 400) {
                    if (/*status === 400 &&*/ ++index < indexFilesLen) {
                        loadUrl = [reqUrl,indexFiles[index]].join("/");
                        console.log("Loading index " + loadUrl);
                        loadFile(loadUrl, createCallback(index));
                        return;
                    }
                    console.log("Failed to load (" + status + ") \t" + reqUrl);
                    respErrors[status](reqUrl ,res);
                    return;
                }
                console.log("successfully loaded \t" + reqUrl);
                res.writeHead(status, {
                    "Content-Type": fileTypes[path.extname(loadUrl)] || "text/plain",
                    "Content-Length": file.length
                });
                res.end(file);
            };
        })(-1));
    }).listen(config.port, config.IP);
    
});
