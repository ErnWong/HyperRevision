define( function(){
    var port = typeof process !== "undefined" && process.env.PORT,
        IP = typeof process !== "undefined" && process.env.IP,
        baseUrl = (typeof document === "object" && document.baseURI) || "";
        
    return ({
        "baseUrl": "http://localhost:8080/",
        "port": typeof port === "number"? port : 8080,//80,
        "IP": IP,
        "HCards": {
            index: "www/hcards.html",
            folder: "hcards",
            cardBaseUrl: "/cards/",
            cardIndex: "/index",
            actions: {
                "edit": "edit"
            },
            editor: "www/editor.html",
            respErrors: {
                404: function($, url, res) {
                    res.writeHead(404);
                    res.end();
                },
                500: function($, url, res) {
                    res.writeHead(500);
                    res.end();
                }
            }
        },
        "editor": {
            container: "editor-content-epic",
            textarea: "editor-content",
            basePath: baseUrl + "scripts/lib/EpicEditor",
            clientSideStorage: false,
            theme: {
                editor: "/themes/editor/epic-light.css"
            }
        },
        "trimSlash": /^\/+|\/+$/g,
        "fileTypes": {
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
        "maxPostSize": 1e6,
        "respErrors": {
            404: function(url, res) {
                res.writeHead(404);
                res.end();
            },
            500: function(url, res) {
                res.writeHead(500);
                res.end();
            }
        },
        "index":[
            "index.html",
            "index.htm",
        ]
    });

});
