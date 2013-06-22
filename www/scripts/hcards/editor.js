requirejs.config( {
    "baseUrl": "scripts/lib/",
    "paths": {
		"hcards": "../hcards",
        "scripts": "..",
	}
} );

requirejs(["scripts/config", "hcards/loader"], function(config, loader){
    
    
    
    if (typeof EpicEditor === "function") {
        new EpicEditor(config.editor).load();
    }
    
});
