//I'm not even sure if this file is named correctly.

define( ["fs"], function(fs) {
    var proto;
    function Utilities() {}
    proto = Utilities.prototype;
    proto.loadFile = loadFile;
    proto.trimSlash= /^\/|\/$/g;
    
    function loadFile(url,callback) {
        fs.exists(url, function(exists){
            if (exists) {
                fs.readFile(url, function(err, data){
                    if (err) {
                        callback(500);
                        return;
                    }
                    callback(200, data);
                });
            } else {
                callback(404);
            }
        });
    }
    return new Utilities();
});
