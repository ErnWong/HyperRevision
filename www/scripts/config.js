define( {
	"baseUrl": "http://localhost:8080/",
    "port": typeof process.env.PORT === "undefind"? 8080 : process.env.PORT,//80,
    "IP": process.env.IP,
	"HyperCards": {
		index: "www/hypercards.html",
        folder: "hypercards",
		cardBaseUrl: "www/cards/",
        respErrors: {
            404: function(url, res) {
                res.writeHead(404);
                res.end();
            },
            500: function(url, res) {
                res.writeHead(500);
                res.end();
            }
        }
	},
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
} );
