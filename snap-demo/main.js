/* Guitar class */
var Guitar = function(svg) {
    var s = Snap(svg);
    this.svg = s;
}

Guitar.prototype.draw = function() {
    var fret = new Fret(this.svg);
    fret.draw();
}

/* Fret class */
var Fret = function(svg) {
    this.svg = svg;
    this.fretWidth = 300;
    this.fretHeight = 325;
    this.fretx = 50;
    this.frety = 45;
    this.fretbg = 'brown';
    this.stringbg = 'red';
    this.fingersize = ((this.fretHeight - 30) / 12) - 4;
    this.spacer = 55;
}

Fret.prototype.draw = function() {
    var fret = this.svg.rect(this.fretx, this.frety + 30, this.fretWidth, this.fretHeight);
    fret.attr({
        fill: this.fretbg
    });
    for (i = 1; i <= 6; i++) {
        var finger = new Finger(this.svg);
        finger.draw(this.fretx, this.frety + (i * this.spacer), this.fingersize);
    }
}

/* GuitarString class */
var GuitarString = function(svg) {
    this.svg = svg;
}

GuitarString.prototype.draw = function(fretx, frety, fingersize) {}

var Finger = function(svg) {
    this.svg = svg;
    this.fingerbg = 'blue';
}

Finger.prototype.draw = function(fretx, frety, fingersize) {
    var finger = this.svg.circle(fretx, frety, fingersize);
    finger.attr({
        fill: this.fingerbg
    });
}

/* Entry point */
window.onload = function() {
    var guitar = new Guitar("#svg");
    guitar.draw();
}