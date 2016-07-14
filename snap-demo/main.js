/* Guitar class */
var Guitar = function (svg, opts) {
    var s = Snap(svg);
    this.svg = s;
    opts = opts == null ? {} : opts;
    opts.defaults = {};
    opts.defaults.stringColour = 'red';
    opts.defaults.fingerColour = 'green';
    opts.defaults.fretColour = 'purple';
    opts.defaults.fingerSize = 40;
    opts.defaults.x = 0;
    opts.defaults.y = 0;
    opts.fingerSize = opts.fingerSize || opts.defaults.fingerSize;
    opts.fretColor = opts.fretColor || opts.defaults.fretColor;
    opts.stringColour = opts.stringColour || opts.defaults.stringColour;
    opts.fingerColour = opts.fingerColour || opts.defaults.fingerColour;
    this.fretLineWidth = 0; // this.fingerSize / 12; // todo: remove if not end up using
    this.opts = opts;
    this.x = this.opts.x || opts.defaults.x;
    this.y = this.opts.y || opts.defaults.y;
}

Guitar.prototype.draw = function () {
    for (var i = 1; i <= 29; i++) {
        var fret = new Fret(this.svg, this.opts, this.x, this.y);
        fret.draw();
        this.x += (this.opts.fingerSize * 6) + this.fretLineWidth;
    }
}

/* Fret class */
var Fret = function (svg, opts, x, y) {
    this.svg = svg;
    this.opts = opts;
    this.fretx = x;
    this.frety = y;
    this.spacer = this.fretHeight / 6;
}

Fret.prototype.draw = function () {

    var fretHeight = 0;
    for (var i = 1; i <= 6; i++) {
        // get calcualted height for use earlier
        // in the source code order (no z-index)
        fretHeight += this.opts.fingerSize * 2;
    }

    // draw a fret
    var fret = this.svg.rect(this.fretx, this.frety, this.opts.fingerSize * 6, fretHeight);
    fret.attr({
        fill: this.opts.fretColor,
        opacity: 1
    });

    // draw strings and fingers
    for (var i = 1; i <= 6; i++) {
        var frety = this.frety + (i * (this.opts.fingerSize * 2) - this.opts.fingerSize);
        var finger = new Finger(this.svg, this.opts);
        finger.draw(this.fretx + (this.opts.fingerSize * 3), frety, this.opts.fingerSize);
        var guitarString = new GuitarString(this.svg, this.opts);
        guitarString.draw(this.fretx, frety, this.opts.fingerSize * 6);
    }
}

/* GuitarString class */
var GuitarString = function (svg, opts) {
    this.svg = svg;
    this.opts = opts;
}

GuitarString.prototype.draw = function (guitarStringx, guitarStringy, width) {
    // todo: proportional string widths 
    var guitarString = this.svg.rect(guitarStringx, guitarStringy, width, this.opts.fingerSize / 12);
    guitarString.attr({
        fill: this.opts.stringColour
    });
}

/* Finger class */
var Finger = function (svg, opts) {
    this.svg = svg;
    this.opts = opts;
}

Finger.prototype.draw = function (fingerx, fingery, fingersize) {
    var finger = this.svg.circle(fingerx, fingery, fingersize);
    finger.attr({
        fill: this.opts.fingerColour
    });
}

/* Entry point */
window.onload = function () {
    // finger size is a base ratio
    var guitar = new Guitar("#svg", {
        x: 20,
        y: 20,
        fingerSize: 20,
        fingerColour: 'black',
        stringColour: 'black',
        fretColor: '#8F4401' // #CD853F #B57E1D #8F4401 #683200 #DB8C44 #FFB775
    });
    guitar.draw();
}