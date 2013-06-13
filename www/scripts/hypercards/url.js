define(document===undefined?["url","scripts/config"]:["scripts/config"],function(Url,config) {
    var parseUrl = Url.parse || function(href) {
        var url = document.createElement("a");
        url.href = href;
        return url;
    };
    return function urlToCard(url) {
        var cardUrl = parseUrl(url).pathname.replace(config.trimSlash, "").split("/");
        if (cardUrl.shift() !== config.HyperCards.index.replace(config.trimSlash, "")) {
            return false;
        }
        return cardUrl.join("/") + ".json";
    };
});
