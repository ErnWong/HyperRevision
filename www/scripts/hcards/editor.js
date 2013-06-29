requirejs.config( {
    "baseUrl": "scripts/lib/",
    "paths": {
		"hcards": "../hcards",
        "scripts": "..",
	}
} );

requirejs(["scripts/config", "hcards/loader", "hcards/list"], function(config, loader, InputList){
    
    var editor, textarea = document.getElementById("editor-content"),
        manualEditor = document.getElementById("manual-editor-wrap"),
        manualRetry = document.getElementById("manual-editor-retry"),
        manualCancel = document.getElementById("manual-editor-cancel"),
        manualTextarea = document.getElementById("manual-editor-textarea"),
        
        manualData, manualCallback,
        
        seeAlsoList, sideLinksList;
        
    function escapeStr(str){
        return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }
    function unescapeStr(str){
        return str.replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">");
    }
    
    manualRetry.addEventListener("click",function() {
        manualEditor.classList.add("hidden");
        manualCallback(unescapeStr(manualTextarea.value));
    });
    manualCancel.addEventListener("click",function() {
        manualEditor.classList.add("hidden");
        manualCallback(manualData, true);
    });
    
    loader.getCard(location.pathname, function(status,data) {
        
        var i = 0, len;
        
        document.getElementById("editor-id").value = data.id;
        document.getElementById("editor-title").value = data.title;
        
        if (status !== 404) {
        
            document.getElementById("editor-authors").value = data.authors.join(", ");
            document.getElementById("editor-content").innerHTML = escapeStr(data.content);
            //console.log(escapeStr(data.content));
            
            seeAlsoList = new InputList("editor-seeAlso-list", "editor-seeAlso", 2);
            len = data.seeAlso.length;
            if (len === 0) {
                seeAlsoList.addRow();
            } else for ( ; i < len; i++ ) {
                seeAlsoList.addRow(data.seeAlso[i]);
            }
            sideLinksList = new InputList("editor-sideLinks-list", "editor-sideLinks", 2);
            len = data.sideLinks.length;
            if (len === 0) {
                sideLinksList.addRow();
            } else for ( ; i < len; i++ ) {
                sideLinksList.addRow(data.sideLinks[i]);
            }
        
        }//TODO: message to editor ui, e.g. "creating new card ..." "failed to load..." "editing card ..." "saving..." "saved successfully" "failed to save" etc.
        
        new EpicEditor(config.editor).load();
        document.getElementById("editor-content").classList.add("hidden");
        
    }, function(data, callback) {
        
        manualTextarea.innerHTML = escapeStr(data);
        manualData = data;
        manualCallback = callback;
        manualEditor.classList.remove("hidden");
        
    });
    
    //if (typeof EpicEditor === "function") {
    //}
    /*if (typeof ace !== "undefined") {
        editor = ace.edit("editor-content-ace");
        //editor.setTheme("ace/theme/monokai");
        editor.setTheme("ace/theme/twilight");
        editor.getSession().setMode("ace/mode/javascript");
        editor.getSession().setValue("{works:true}");
        editor.getSession().on('change', function(){
            textarea.innerHTML = editor.getSession().getValue();
        });
    }*/
    
});
