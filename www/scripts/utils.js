//I'm not even sure if this file is named correctly.

define( ["fs"], function(fs) {
    var proto;
    function Utilities() {}
    proto = Utilities.prototype;
    proto.loadFile = loadFile;
    function loadFile(url,callback) {
        fs.exists(url, function(exists){
            if (exists) {
                fs.readFile(url, function(err, data){
                    if (err) {
                        callback(500);
                        return;
                    }
                    callback(404, data);
                });
            } else {
                callback(404);
            }
        });
    }
    return new Utilities();
});
