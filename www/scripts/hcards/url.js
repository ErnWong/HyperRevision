
(function(global){
    var deps = ["scripts/config"];
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
        trimSlash = config.trimSlash,
        HCardsFolder = config.HCards.folder.replace(trimSlash, "");
        
        return function urlToCard(url) {
            console.log("HCards: Converting url " + url);
            var cardUrl = parseUrl(url).pathname.replace(trimSlash, "").split("/");
            console.log("HCards: Converting path " + cardUrl);
            if (cardUrl.shift() !== HCardsFolder) {
                console.log("HCards: path ***/" + cardUrl.join("/") + " did not start with " + HCardsFolder);
                return false;
            }
            cardUrl.unshift(config.HCards.cardBaseUrl.replace(trimSlash,""));
            return cardUrl.join("/");// leave out the +".json"
        };
    });
})(this);
