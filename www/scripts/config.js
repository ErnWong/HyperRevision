define( {
	"baseUrl": "http://localhost:8080/",
	"HyperCards": {
		index: "/hypercards.html",
        folder: "hypercards",
		cardBaseUrl: "/cards/",
        respErrors: {
            
        }
	},
    "trimSlash": /^\/|\/$/g,
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
            res.writeHead(404);
            res.end();
        }
    },
} );
