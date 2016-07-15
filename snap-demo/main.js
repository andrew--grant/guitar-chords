/* Guitar class */
var Guitar = function (svg, opts) {
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

Guitar.prototype.draw = function () {
    for (var i = 1; i <= this.opts.model.frets.length; i++) {
        var fret = new Fret(this.svg, this.opts, this.x, this.y);
        fret.draw(i, 'g'); // todo: pass the chords from UI (selector)
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

Fret.prototype.draw = function (fretNumber, chord) {

    // given a chord, say 'a', need to get shape
    //  of that chord from data model
    var chordObj = _.find(this.opts.model.chords,
        function (o) { return o.name == chord; });
    var shape = chordObj.shape;

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

    // todo: show fret number on screen (below fret?)
    // todo: test 'no play' x strings
    // draw strings and fingers
    this.drawChord(fretNumber, shape);
}

Fret.prototype.drawChord = function (fretNumber, shape) {


    for (var i = 1; i <= 6; i++) {

        // Shape Data:
        // Eg: [3,3,2]  Place finger 2 on string 3 at fret 3
        // Eg: [2,6,0]  Place no finger on string 6 at fret 2
        // Play open string = 0 | Dont play string = x

        var shapeData = shape[i - 1];
        var shapeDataFret = shapeData[0];
        var shapeDataString = shapeData[1];
        var shapeDataFinger = shapeData[2];

        var frety = this.frety + (i * (this.opts.fingerSize * 2) - this.opts.fingerSize); //todo: weird expression. shorten it??

        // We always draw the string on the fret, but...
        var guitarString = new GuitarString(this.svg, this.opts);
        guitarString.draw(this.fretx, frety, this.opts.fingerSize * 6, shapeDataString);

        // ...should we draw a finger on the string?
        if ((shapeDataFret == fretNumber) && (shapeDataString == i) && (shapeDataFinger != 0)) {
            var finger = new Finger(this.svg, this.opts);
            finger.draw(this.fretx + (this.opts.fingerSize * 3), frety, this.opts.fingerSize, shapeDataFinger);
        }

    }

    // for (var i = 1; i <= 6; i++) {

    //     var frety = this.frety + (i * (this.opts.fingerSize * 2) - this.opts.fingerSize);

    //     for (var j = 0; j < this.opts.model.chords.length; j++) {
    //         console.log('Fret Number: ' + fretNumber + ', Chord: ' + this.opts.model.chords[j].name.toUpperCase());

    //         for (var k = 0; k < this.opts.model.chords[j].shape.length; k++) {
    //             console.log(this.opts.model.chords[j].shape[k]);
    //         }

    //     } 

    // }

}


/* GuitarString class */
var GuitarString = function (svg, opts) {
    this.svg = svg;
    this.opts = opts;
}

GuitarString.prototype.draw = function (guitarStringx, guitarStringy, width, stringNumber) {
    // todo: proportional string 
    // widths, or stick with this?
    var stringThickness = (this.opts.fingerSize / 12);
    if (6 / stringNumber == 1) {
        // thin
        stringThickness = stringThickness * .85;
    }
    if (6 / stringNumber == 6) {
        // thick
        stringThickness = stringThickness / .55;
    }

    var guitarString = this.svg.rect(guitarStringx, guitarStringy, width, stringThickness); // todo: better factorial? (this.opts.fingerSize / 12) + (6 / stringNumber)
    guitarString.attr({
        fill: this.opts.stringColour
    });
}

/* Finger class */
var Finger = function (svg, opts) {
    this.svg = svg;
    this.opts = opts;
}

Finger.prototype.draw = function (fingerx, fingery, fingersize, fingerNumber) {

    // finger
    var finger = this.svg.circle(fingerx, fingery, fingersize * .9);
    finger.attr({
        fill: this.opts.fingerColour
    });

    // finger number
    var text = this.svg.text(fingerx - (fingersize / 2.5), fingery + (fingersize / 2), fingerNumber);
    text.attr({
        'font-size': fingersize * 1.6,
        fill: 'white'
    });
}

/* Entry point */
window.onload = function () {

    // fingerSize is the base ratio forall propertions

    var theGuitar = new Guitar("#svg", {
        model: guitar(),
        x: 20,
        y: 20,
        fingerSize: 50,
        fingerColour: 'black',
        stringColour: 'black',
        fretColor: '#D2B48C' // #CD853F #B57E1D #8F4401 #683200 #DB8C44 #FFB775 #D2B48C
    });

    theGuitar.draw();
}