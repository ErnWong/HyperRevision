define( [
        "hcards/loader",
        "hcards/show"
    ], function(loader, show){

    var protocol = location.protocol,
        sameHost = RegExp("//"+location.host+"($|/)"),
        cardFirstCurrent = true,
        cards = {
                true: document.getElementById("HCard-0"),
                false: document.getElementById("HCard-1")
            },
        primaryCard,
        secondaryCard,
        //baseUrl = document.baseURI,
        loadCard = loader.getCard,
        proto;
    
    ////
    function Navigation() {}
    proto = Navigation.prototype;
    proto.isCard = isCard;
    proto.go = go;
    proto.updateLinks = updateLinks;
    ////
    
    function getPathname(url) {
        var a = document.createElement("a");
        a.href = url;
        return a.pathname;
    }
    
    function go(path) {
        
        cardFirstCurrent = !cardFirstCurrent;
        primaryCard = cards[cardFirstCurrent];
        secondaryCard = cards[!cardFirstCurrent];
        
        primaryCard.parentNode.classList.remove("Secondary-Card");
        primaryCard.parentNode.classList.add("Primary-Card");
        primaryCard.parentNode.classList.remove("Secondary-Card-Animate");
        primaryCard.parentNode.classList.add("Primary-Card-Animate");
        
        secondaryCard.parentNode.classList.remove("Primary-Card");
        secondaryCard.parentNode.classList.add("Secondary-Card");
        secondaryCard.parentNode.classList.remove("Primary-Card-Animate");
        secondaryCard.parentNode.classList.add("Secondary-Card-Animate");
        
        
        loadCard(getPathname(path), function(status, data) {
            if (status >= 400) {
                //do stuff
                return;
            }
            show.display(data, primaryCard);
            updateLinks(primaryCard);
        });
        
    }
    
    function isCard(url) {
        
        var path = url.split("/");
        
        if (url.substring(0,protocol.length) === protocol && !sameHost.test(url)) {
            return  false;
        }
        
        return path[path.length-1].indexOf(".") === -1 || url.slice(-1) === ("/");
        
    }
    
    function createLinkListener(href) {
        
        return function( evt ) {
            go(href);
            history.pushState( null, null, href );
            evt.preventDefault();
        };
        
    }
    
    function updateLinks(container) {
        if (typeof container === "string") {
            container = document.getElementById(container);
        }
        var hyperlinks = container.getElementsByTagName("a"),
            i = 0,
            len = hyperlinks.length,
            node;
            //urlTree;
            
        for ( ; i < len ; i++ ) {
            node = hyperlinks[i];
            if ( isCard(node.href) ) {
                //if ( urlTree[urlTree.length-1].indexOf(".") === -1 ) {
                    node.addEventListener( "click", createLinkListener(node.href) );
                //}
            }
        }
        
    }
    
    window.addEventListener("popstate", function (evt) {
        go(location.href);
    });
    
    return new Navigation();

} );
