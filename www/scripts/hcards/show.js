define( ["marked", "scripts/config"], function (marked, config) {
    
    var trimSlash = config.trimSlash,
        proto;
    
    ////
    function show() {}
    proto = show.prototype;
    proto.display = display;
    proto.dataToHTML = dataToHTML;
    ////
    
    marked.setOptions({
        gfm: false
    });
    
    function display(data,container) {
        if (typeof container === "string") {
            container = document.getElementById("container");
        }
        container.innerHTML = dataToHTML(data);
    }
    
    function idToHTML(id) {
        /*if (id.charAt(0) === "/") {
            id = id.slice(1);
        }
        if (id.slice(-1) === "/")*/
        id = id.replace(trimSlash, "");
        var path = id.split("/"),
            i = path.length,
            out = [];
        while (--i >= 0) {
            out.unshift([
                "<a href=\"",
                path.join("/"),
                "/\">",
                path[i],
                "</a>\n"].join(""));
                path.pop();
        }
        return out.join(" &gt; "); //replace with separating character
    }
    
    function linkListToHTML(list) {
        var i = 0,
            len = list.length,
            out = ["<ul>\n"];
        
        for ( ; i < len; i++ ) {
            out = out.concat( [
                "\n<li>\n<a href=\"",
                list[i][1],
                "\">",
                list[i][0],
                "</a>\n</li>\n"] );
        }
        out.push("\n</ul>");
        return out.join("");
    }
    
    function listToHTML(list) {
        var len = list.length;
        return len > 1? [
                list.slice(0, len - 1).join(", "),
                list[len - 1]
            ].join(" and ") : ( len? "" + list[0] : "");
    }
    
    function dataToHTML(data) {
        return ["<article>\n<header>\n<div class=\"Hyper-Heading\">\n",
        
                data.id && ["<div class=\"Hyper-Path\">\n",
                        idToHTML(data.id),
                        "\n</div>\n"
                    ].join(""),
                
                data.title && [
                        "<h1 class=\"Hyper-Title\">\n",
                        data.title,
                        "\n</h1>\n"
                    ].join(""),
                
                "</div>\n</header>\n",
                
                data.content && [
                        "\n<div class=\"Hyper-Content\">\n",
                        marked(data.content),
                        "\n</div>\n"
                    ].join(""),
                
                data.seeAlso && [
                        "\n<section>\n<h2>See Also</h2>\n<div class=\"Hyper-SeeAlso\">\n",
                        linkListToHTML(data.seeAlso),
                        "\n</div>\n</section>\n"
                    ].join(""),
                    
                data.sideLinks && [
                        "\n<div class=\"Hyper-SideLinks\">\n",
                        linkListToHTML(data.sideLinks),
                        "\n</div>\n"
                    ].join(""),
                
                "\n<footer>\n<div class=\"Hyper-Footer\">\n",
                
                data.authors && [
                        "\n<div class=\"left\">\nWritten by <span class=\"Hyper-Author\">",
                        listToHTML(data.authors),
                        "</span>.\n</div>\n"
                    ].join(""),
                
                data.lastModified && [
                        "\n<div class=\"right\">\nLast Modified: <time class=\"Hyper-Date\">",
                        data.lastModified,
                        "</time>\n</div>\n"
                    ].join(""),
                
                data.url && [
                        "\n<div class=\"url\">\nJSON: <a class=\"Hyper-Url\" href=\"",
                        data.url,
                        "\">",
                        data.url,
                        "</a>\n</div>\n"
                    ].join(""),
                
                "\n</div>\n</footer>"
                
            ].join("");
    }
    
    /* Format
    <div id="HyperCard-0" class="Hyper-Container">
			<article>

				<header>
					<div class="Hyper-Heading">
						<div class="Hyper-Path">&nbsp;</div>
						<h1 class="Hyper-Title">&nbsp;</h1>
					</div>
				</header>

				<div class="Hyper-Content">&nbsp;</div>

				<section>
					<h2>See Also</h2>
					<div class="Hyper-SeeAlso">&nbsp;</div>
				</section>

				<div class="Hyper-SideLinks">&nbsp;</div>

				<footer>
					<div class="Hyper-Footer">
						<div class="left">Written by <span class="Hyper-Author"></span>.<div>
						<div class="right">Last Modified: <time class="Hyper-Date"></time></div>
						<div class="url">JSON: <a class="Hyper-Url" href=""></a></div>
					</div>
				</footer>

			</article>
		</div>
    */
    return new show();
});
