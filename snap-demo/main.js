/* Guitar class */
var Guitar = function(svg, opts) {
    // cant go without a mdel
    if (!opts.model) {
        throw Error('\'model\' is a required option');
    }
    var s = Snap(svg);
    this.svg = s;
    this.opts = opts == null ? {} : opts;
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

    this.x = this.opts.x || opts.defaults.x;
    this.y = this.opts.y || opts.defaults.y;
}

Guitar.prototype.draw = function() {
    for (var i = 1; i <= this.opts.model.frets.length; i++) {
        var fret = new Fret(this.svg, this.opts, this.x, this.y);
        fret.draw(i); // todo: pass the chords in from here!!
        this.x += (this.opts.fingerSize * 6) + this.fretLineWidth;
    }
}

/* Fret class */
var Fret = function(svg, opts, x, y) {
    this.svg = svg;
    this.opts = opts;
    this.fretx = x;
    this.frety = y;
    this.spacer = this.fretHeight / 6;
}

Fret.prototype.draw = function(fretNumber) {

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
        stroke: "#000",
        strokeDasharray: '1 1'
    });

    // draw strings and fingers
    this.drawChord(fretNumber);
}

Fret.prototype.drawChord = function(fretNumber) {


    // todo: debugging only, see comment above "todo: pass the chords in from here!!"
    for (var i = 1; i <= 6; i++) {

        var frety = this.frety + (i * (this.opts.fingerSize * 2) - this.opts.fingerSize);

        for (var j = 0; j < this.opts.model.chords.length; j++) {
            console.log('Fret Number: ' + fretNumber + ', Chord: ' + this.opts.model.chords[j].name.toUpperCase());

            for (var k = 0; k < this.opts.model.chords[j].shape.length; k++) {
                console.log(this.opts.model.chords[j].shape[k]);
            }

        }

        var finger = new Finger(this.svg, this.opts);
        finger.draw(this.fretx + (this.opts.fingerSize * 3), frety, this.opts.fingerSize);
        var guitarString = new GuitarString(this.svg, this.opts);
        guitarString.draw(this.fretx, frety, this.opts.fingerSize * 6);

    }
}


/* GuitarString class */
var GuitarString = function(svg, opts) {
    this.svg = svg;
    this.opts = opts;
}

GuitarString.prototype.draw = function(guitarStringx, guitarStringy, width) {
    // todo: proportional string widths 
    var guitarString = this.svg.rect(guitarStringx, guitarStringy, width, this.opts.fingerSize / 12);
    guitarString.attr({
        fill: this.opts.stringColour
    });
}

/* Finger class */
var Finger = function(svg, opts) {
    this.svg = svg;
    this.opts = opts;
}

Finger.prototype.draw = function(fingerx, fingery, fingersize) {
    var finger = this.svg.circle(fingerx, fingery, fingersize * .9);
    finger.attr({
        fill: this.opts.fingerColour
    });
}

/* Entry point */
window.onload = function() {
    // finger size is a base ratio
    var theGuitar = new Guitar("#svg", {
        model: guitar(),
        x: 20,
        y: 20,
        fingerSize: 23,
        fingerColour: 'black',
        stringColour: 'black',
        fretColor: '#FFB775' // #CD853F #B57E1D #8F4401 #683200 #DB8C44 #FFB775
    });
    theGuitar.draw();
}