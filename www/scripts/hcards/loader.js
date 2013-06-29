define( ["json", "scripts/config", "hcards/url"], function(JSON, config, urlToCard){
    
    //TODO: merge with utils.js?

    var fileRequest = window.XMLHttpRequest? new XMLHttpRequest() : window.ActiveXObject != null ? new ActiveXObject("MicrosoftXMLHTTP") : null,
        cardIndex = config.HCards.cardIndex,
        trimSlash = config.trimSlash,
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
    
    function getCard(id, callback, JSONErr) {
        var url = urlToCard(id) + ".json", data;
        loadFile(url, (function createCallback(index) {
            return function (response) {
                if (response.status === 404) {
                    if (!index) {
                        url += (url.substr(-1) === "/"? "" : "/") + cardIndex.replace(trimSlash,"") +".json"; //TODO: I SUSPECT ERROR HERE
                        loadFile( url, createCallback( true ));
                    } else {
                        callback(404);
                    }
                    return;
                }
                tryParseJSON(response.data, function(data) {
                    if (data === false) {
                        callback(500);
                    } else {
                        data.id = id;
                        data.url = url;
                        callback(200, data);
                    }
                    
                }, JSONErr);
            };
        })(false));
    }
    
    function tryParseJSON(data, callback, errCallback) {
        var undefined, JSONdata;
        try {
            JSONdata = JSON.parse(data)
        } catch(err) {
            if (typeof errCallback === "function") {
                errCallback(data, function(corrected, cancel) {
                    tryParseJSON(corrected, callback, cancel? undefined : errCallback);
                });
            } else {
                callback(false);
            }
            return;
        }
        callback(JSONdata);
    }
    
    function loadFile(url, callback) {
        fileRequest.open("get", url, true);
        fileRequest.onreadystatechange = function() {
            if (fileRequest.readyState === 4) {
                callback({
                    //"data": fileRequest.status === 200? JSON.parse(fileRequest.responseText) : null,
                    "data": fileRequest.responseText,
                    "status": fileRequest.status,
                    "statusText": fileRequest.statusText
                });
            }
        };
        fileRequest.send();
    }
    
    return new Loader();

} );
