define( ["json", "hypercards/url"], function(JSON, urlToCard){

    var fileRequest = window.XMLHttpRequest? new XMLHttpRequest() : window.ActiveXObject != null ? new ActiveXObject("MicrosoftXMLHTTP") : null,
        //protocol = location.protocol,
        //baseUrl = document.baseURI,
        //lessBaseUrl = baseUrl.substr( protocol.length + 2 ),
        proto;
    
    if (!fileRequest) {
        return false;
    }
    
    ////
    function Loader() {}
    proto = Loader.prototype;
    proto.getCard = getCard;
    proto.loadFile = loadFile;
    ////
    
    /*function getCard(id, callback) {
        var url,
            idStart,
            start,
            end;
        
        if (id.substr(-1) === "/") {
            id = id.slice(0, -1);
        }
        idStart = id.indexOf(lessBaseUrl);
        start = end = idStart === -1? 0 : idStart + lessBaseUrl.length;
        if (id.charAt(end) === "/") {
            end++;
        }
        
        loadFile( url, (function createCallback(index) {
            return function (response) {
                if (response.status === 404 && !index) {
                    url += url.substr(-1) === "/"? "index.json" : "/index.json";
                    loadFile( url, createCallback( true ));
                }
                response.data.id = id;
                response.data.url = url;
                callback(response);
            };
        }));
    }*/
    function getCard(id, callback) {
        var url = urlToCard(id);
        loadFile(url, (function createCallback(index) {
            return function (response) {
                if (response.status === 404 && !index) {
                    url += url.substr(-1) === "/"? "index.json" : "/index.json";
                    loadFile( url, createCallback( true ));
                }
                response.data.id = id;
                response.data.url = url;
                callback(response);
            };
        })(false));
    }
    
    function loadFile(url, callback) {
        fileRequest.open("get", url, true);
        fileRequest.onreadystatechange = function() {
            if (fileRequest.readyState === 4) {
                callback({
                    "data": fileRequest.status === 200? JSON.parse(fileRequest.responseText) : null,
                    "status": fileRequest.status,
                    "statusText": fileRequest.statusText
                });
            }
        };
        fileRequest.send();
    }
    
    return new Loader();

} );
