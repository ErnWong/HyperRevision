define(function() {
    
    var proto;
    
    function InputList(element, textBox, cols) {
        
        if (! (this instanceof InputList) ) {
            return new InputList(element, textBox, cols);
        }
        
        var self = this;
        
        this.element = (typeof element === "string"? document.getElementById(element) : element) || document.createElement("ul");
        this.textBox = (typeof textBox === "string"? document.getElementById(textBox) : textBox) || document.createElement("input");
        
        this.plusBtn = document.createElement("input");
        this.plusBtn.type = "button";
        this.plusBtn.value = "+";
        this.plusBtn.classList.add("controls-plus");
        this.plusBtn.addEventListener("click", function() {
            self.addRow();
        });
        
        this.minusBtn = document.createElement("input");
        this.minusBtn.type = "button";
        this.minusBtn.value = "-";
        this.minusBtn.classList.add("controls-minus");
        this.minusBtn.addEventListener("click", function() {
            self.removeRow();
        });
        
        this.row = [];
        this.dRow = [];
        
        this.cols = cols || 1;
        
        this.rows = 0;
        
    }
    
    proto = InputList.prototype;
    
    proto.cols = 1;
    proto.rows = 0;
    proto.element = null;
    proto.textBox = null;
    proto.plusBtn = null;
    proto.minusBtn = null;
    proto.dRow = [];
    proto.row = [];
    
    proto.addRow = addRow;
    proto.removeRow = removeRow;
    proto.createInput = createInput;
    proto.updateString = updateString;
    
    
    function addRow( data ) {
        
        var row = document.createElement("li"),
            rowArray = [],
            d,
            i = 0,
            len = this.cols;
        
        data = data || [];
        
        row.classList.add("input-list-r");
        for ( ; i < len; i++ ) {
            d = this.createInput(data[i]);
            row.appendChild(d);
            rowArray.push(d);
        }
        
        this.dRow.push(rowArray);
        this.rows++;
        /*if (this.row.length) {
            this.row[this.row.length - 1].removeChild(this.plusBtn);
            row.appendChild(this.minusBtn);
        } else if (this.row.length > 1) {
            this.row[this.row.length - 1].removeChild(this.minusBtn);
        }*/
        this.minusBtn.disabled = this.row.length < 1;
        row.appendChild(this.plusBtn);
        row.appendChild(this.minusBtn);
        this.element.appendChild(row);
        this.row.push(row);
        
        this.updateString();
        
    }
    
    function updateString() {
        
        var str = [],
            rowStr = [],
            row = 0,
            col,
            rows = this.rows,
            cols = this.cols,
            currentRow;
            
        for ( ; row < rows; row++ ) {
            currentRow = this.dRow[row];
            rowStr = [];
            for ( col = 0; col < cols; col++ ) {
                rowStr.push(currentRow[col].value);
            }
            str = str.concat(["[\"",rowStr.join("\",\""),"\"]"].join(""));
        }
        
        return this.textBox.value = str.join(",");
        
    }
    
    function removeRow() {
        
        if (this.rows < 2) {
            return;
        }
        this.row[this.row.length-2].appendChild(this.plusBtn);
        this.row[this.row.length-2].appendChild(this.minusBtn);
        this.element.removeChild(this.row.pop());
        this.dRow.pop();
        this.rows--;
        
    }
    
    function createInput(value) {
        /*var newInput = document.createElement("input");
        newInput.type = "text";
        newInput.value = value || "";
        return newInput;*/
        
        var newInput = document.createElement("input");
        newInput.type = "text";
        newInput.classList.add("input-list-d");
        if (typeof value !== "undefined") {
            newInput.value = value;
        }
        var self = this;
        newInput.addEventListener("input", function() {
            self.updateString();
        });
        return newInput;
    }
    
    return InputList;
    
});
