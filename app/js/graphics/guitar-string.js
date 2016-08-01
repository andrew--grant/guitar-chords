function GuitarString(position) {
    this.stringColor = "#000";
}

GuitarString.prototype.draw = function(x, y) {
    var line = new createjs.Shape();
    line.graphics.setStrokeStyle(1);
    line.graphics.beginStroke(this.stringColor);
    line.graphics.moveTo(position, position);
    line.graphics.lineTo(250, 250);
    line.graphics.endStroke(); //zxcvs
    return line;
}