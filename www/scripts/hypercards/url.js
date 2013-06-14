
(function(global){
    var deps = ["scripts/config","scripts/utils"];
    if (typeof global.document !== "object") {
        deps.unshift("url");
    }
    define(deps,function(Url) {
        var parseUrl = Url.parse || (global.document && function(href) {
            var url = document.createElement("a");
            url.href = href;
            return url;
        }),
        config = require("scripts/config"),
        utils = require("scripts/utils");
        
        return function urlToCard(url) {
            console.log("HyperCards: Converting url " + url);
            var cardUrl = parseUrl(url).pathname.replace(utils.trimSlash, "").split("/");
            console.log("HyperCards: Converting path " + cardUrl);
            if (cardUrl.shift() !== config.HyperCards.folder.replace(utils.trimSlash, "")) {
                console.log("HyperCards: path ***/" + cardUrl.join("/") + " did not start with " + config.HyperCards.folder.replace(utils.trimSlash, ""));
                return false;
            }
            cardUrl.unshift(config.HyperCards.cardBaseUrl.replace(utils.trimSlash,""));
            return cardUrl.join("/");// leave out the +".json"
        };
    });
})(this);
