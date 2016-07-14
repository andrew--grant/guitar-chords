/* Guitar class */
var Guitar = function (svg, opts) {
    var s = Snap(svg);
    this.svg = s;
    this.opts = opts;
}

Guitar.prototype.draw = function () {
    var fret = new Fret(this.svg, this.opts);
    fret.draw();
}


/* Fret class */
var Fret = function (svg, opts) {
    this.svg = svg;
    this.opts = opts;
    this.fretx = 50;
    this.frety = 50;
    this.spacer = this.fretHeight / 6;
    this.fretbg = opts.fretColour || 'brown';
    this.stringbg = this.opts.stringColour || 'black';
    this.fingersize = opts.fingerSize || 15;
}

Fret.prototype.draw = function () {
    var fretHeight = 0;
    for (i = 1; i <= 6; i++) {

        var frety = this.frety + (i * (this.fingersize * 2) - this.fingersize);

        var finger = new Finger(this.svg, this.opts);
        finger.draw(this.fretx + (this.fingersize * 3), frety, this.fingersize);

        var guitarString = new GuitarString(this.svg, this.opts);
        guitarString.draw(this.fretx, frety, this.fingersize * 6);

        fretHeight += this.fingersize * 2;
    }

    var fret = this.svg.rect(this.fretx, this.frety, this.fingersize * 6, fretHeight);
    fret.attr({
        fill: this.fretbg,
        opacity: .2
    });
}

/* GuitarString class */
var GuitarString = function (svg, opts) {
    this.svg = svg;
    this.stringbg = opts.stringColour;
}

GuitarString.prototype.draw = function (guitarStringx, guitarStringy, width) {
    var guitarString = this.svg.rect(guitarStringx, guitarStringy, width, 3);
    guitarString.attr({
        fill: this.stringbg
    });
}

/* Finger class */
var Finger = function (svg, opts) {
    this.svg = svg;
    this.fingerbg = opts.fingerColour || 'blue';
}

Finger.prototype.draw = function (fingerx, fingery, fingersize) {
    var finger = this.svg.circle(fingerx, fingery, fingersize);
    finger.attr({
        fill: this.fingerbg
    });
}

/* Entry point */
window.onload = function () {
    // finger size is a base ratio
    var guitar = new Guitar("#svg", { stringColour: 'black', fingerColour: 'red' });
    guitar.draw();
}