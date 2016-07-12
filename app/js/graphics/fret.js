function Fret(fretNumber, strings) {
    this.fretNumber = fretNumber;
    this.line = new createjs.Shape();
    this.fingerColour = "DeepSkyBlue";
}

Fret.prototype.draw = function (x, y) {
    this.line.graphics.beginFill("#ff0000").drawRect(0, 0, 100, 100);
    return this.line;
}
