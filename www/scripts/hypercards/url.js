define(this.document===undefined?["url","scripts/config"]:["scripts/config"],function(Url) {
    var parseUrl = Url.parse || (this.document && function(href) {
        var url = document.createElement("a");
        url.href = href;
        return url;
    }),
    config = require("scripts/config");
    
    return function urlToCard(url) {
        var cardUrl = parseUrl(url).pathname.replace(config.trimSlash, "").split("/");
        if (cardUrl.shift() !== config.HyperCards.index.replace(config.trimSlash, "")) {
            return false;
        }
        return cardUrl.join("/") + ".json";
    };
});
