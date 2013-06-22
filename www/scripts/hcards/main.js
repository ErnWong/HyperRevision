requirejs.config( {
	"baseUrl": "scripts/lib/",
	"paths": {
		"hcards": "../hcards",
        "scripts": "..",
	}
} );

requirejs(["hcards/navigation"], function(navigation) {
    
    navigation.updateLinks("HCard-0");
    
});
