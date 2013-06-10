define( ["hypercards/loader"], function(loader){

    var protocol = location.protocol,
        sameHost = RegExp("//"+location.host+"($|/)"),
        //currentCard = 0,
        //cards = [],
        //baseUrl = document.baseURI,
        proto;
    
    ////
    function Navigation() {}
    proto = Navigation.prototype;
    proto.isInternal = isInternal;
    proto.go = go;
    proto.updateLinks = updateLinks;
    ////
    
    function go(url) {
        
    }
    
    function isInternal(url) {
        if (url.substring(0,protocol.length) === protocol) {
            return sameHost.test(url);
        } else {
            return url.charAt(0) === ("/") || !url.split("/")[0].contains(".");
        }
    }
    
    function createLinkListener(href) {
        return function( evt ) {
            go(href);
            history.pushState( null, null, href );
            evt.preventDefault();
        };
    }
    
    function updateLinks(container) {
        
        var hyperlinks = container.getElementsByTagName("a"),
            i = 0,
            len = hyperlinks.length,
            node,
            urlTree;
            
        for ( ; i < len ; i++ ) {
            node = hyperlinks[i];
            if ( isInternal(node.href) ) {
                if ( urlTree[urlTree.length-1].indexOf(".") === -1 ) {
                    node.addEventListener( "click", createLinkListener(node.href) );
                }
            }
        }
        
    }
    
    return new Navigation();

} );
