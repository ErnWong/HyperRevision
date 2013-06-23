requirejs.config( {
    "baseUrl": "scripts/lib/",
    "paths": {
		"hcards": "../hcards",
        "scripts": "..",
	}
} );

requirejs(["scripts/config", "hcards/loader"], function(config, loader){
    
    loader.getCard(location.pathname, function(status,file) {
        
    }, function(data, callback) {
        //show JSON correction dialog, with retrymand cancel buttons
        //then callback(corrected data, cancel?)
    });
    
    if (typeof EpicEditor === "function") {
        new EpicEditor(config.editor).load();
    }
    
});
