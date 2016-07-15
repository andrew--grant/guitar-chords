/* Guitar class */
var Guitar = function(svg, opts) {
    // cant do anything without a
    // guitar and chords data model
    if (!opts.model) {
        throw Error('\'model\' is a required option');
    }
    var s = Snap(svg);
    this.svg = s;
    this.opts = opts == null ? {} : opts;
    opts.defaults = {};
    opts.defaults.stringColour = 'red';
    opts.defaults.fingerColour = 'green';
    opts.defaults.fingerNumberColour = 'white';
    opts.defaults.fretColour = '#D2B48C';
    opts.defaults.fretNumberColour = 'grey';
    opts.defaults.fingerSize = 40;
    opts.defaults.openStringColour = 'black';
    opts.defaults.x = 0;
    opts.defaults.y = 0;
    opts.fingerSize = opts.fingerSize || opts.defaults.fingerSize;
    opts.fretColour = opts.fretColour || opts.defaults.fretColour;
    opts.openStringColour = opts.openStringColour || opts.defaults.openStringColour;
    opts.fretNumberColour = opts.fretNumberColour || opts.defaults.fretNumberColour;
    opts.stringColour = opts.stringColour || opts.defaults.stringColour;
    opts.fingerColour = opts.fingerColour || opts.defaults.fingerColour;
    opts.fingerNumberColour = opts.fingerNumberColour || opts.defaults.fingerNumberColour;

    this.x = this.opts.x || opts.defaults.x;
    this.y = this.opts.y || opts.defaults.y;
}

Guitar.prototype.draw = function() {
    for (var i = 1; i <= this.opts.model.frets.length; i++) {
        var fret = new Fret(this.svg, this.opts, this.x, this.y);
        fret.draw(i, 'g'); // todo: pass the chords from UI (selector)
        this.x += (this.opts.fingerSize * 6);
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

Fret.prototype.draw = function(fretNumber, chord) {

    // given a chord, say 'a', need to get shape
    //  of that chord from data model
    var chordObj = _.find(this.opts.model.chords,
        function(o) {
            return o.name == chord;
        });
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
        fill: this.opts.fretColour,
        stroke: "#000",
        strokeDasharray: '1 1'
    });

    // fret number
    var text = this.svg.text(this.fretx + this.opts.fingerSize * 3, this.frety + fretHeight + this.opts.fingerSize * 1.6, fretNumber);
    text.attr({
        'font-size': this.opts.fingerSize,
        fill: this.opts.fretNumberColour
    });

    // draw strings and fingers on this fret
    this.drawStrings(fretNumber, shape);
}

Fret.prototype.extractShapeData = function(stringNumber, shape) {
    // Shape Data:
    // Eg: [3,3,2]  Place finger 2 on string 3 at fret 3
    // Eg: [2,6,0]  Place no finger on string 6 at fret 2
    // Play open string = 0 | Dont play string = x
    var shapeData = shape[stringNumber - 1];
    return {
        shapeDataFret: shapeData[0],
        shapeDataString: shapeData[1],
        shapeDataFinger: shapeData[2],
    }
}

Fret.prototype.calcFretY = function(stringNumber) {
    return this.frety + (stringNumber * (this.opts.fingerSize * 2) - this.opts.fingerSize); //todo: weird expression. shorten it??
}

Fret.prototype.drawStrings = function(fretNumber, shape) {

    for (var i = 1; i <= 6; i++) {

        var shapeData = this.extractShapeData(i, shape);

        var frety = this.calcFretY(i);

        // We always draw the string on the fret, but...
        var guitarString = new GuitarString(this.svg, this.opts);
        guitarString.draw(this.fretx, frety, this.opts.fingerSize * 6, shapeData.shapeDataString);

        this.drawChordShape(fretNumber, shape);

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

Fret.prototype.drawChordShape = function(fretNumber, shape) {

    for (var i = 1; i <= 6; i++) {

        var shapeData = this.extractShapeData(i, shape);
        var frety = this.calcFretY(i);
        // ...should we draw a finger on the string?
        if ((shapeData.shapeDataFret == fretNumber) && (shapeData.shapeDataString == i) && (shapeData.shapeDataFinger != 0)) {
            var finger = new Finger(this.svg, this.opts);
            finger.draw(this.fretx + (this.opts.fingerSize * 3), frety, this.opts.fingerSize, shapeData.shapeDataFinger);
        } else if ((shapeData.shapeDataFret == fretNumber - 1) && (shapeData.shapeDataString == i) && (shapeData.shapeDataFinger == 0)) {
            var open = this.svg.circle(this.opts.x, frety, this.opts.fingerSize / 7);
            open.attr({
                fill: this.opts.openStringColour
            });
        } else if ((shapeData.shapeDataFret == fretNumber - 1) && (shapeData.shapeDataString == i) && (shapeData.shapeDataFinger == -1)) {
            // must be a 'no play'
            // todo: make an 'x' shape (text)?
            var doNotPlay = this.svg.circle(this.opts.x, frety, this.opts.fingerSize / 7);
            doNotPlay.attr({
                fill: 'red'
            });
        }

    }

}



/* GuitarString class */
var GuitarString = function(svg, opts) {
    this.svg = svg;
    this.opts = opts;
}

GuitarString.prototype.draw = function(guitarStringx, guitarStringy, width, stringNumber) {
    // proportional string widths 
    var stringThickness = (this.opts.fingerSize / 12);
    if (6 / stringNumber == 1) {
        // thin
        stringThickness = stringThickness * .85;
    }
    if (6 / stringNumber == 6) {
        // thick
        stringThickness = stringThickness / .55; // reduce opacity (as in, make grey)
    }

    var guitarString = this.svg.rect(guitarStringx, guitarStringy, width, stringThickness);
    guitarString.attr({
        fill: this.opts.stringColour
    });
}

/* Finger class */
var Finger = function(svg, opts) {
    this.svg = svg;
    this.opts = opts;
}

Finger.prototype.draw = function(fingerx, fingery, fingersize, fingerNumber) {

    // finger
    var finger = this.svg.circle(fingerx, fingery, fingersize * .9);
    finger.attr({
        fill: this.opts.fingerColour
    });

    // finger number
    var text = this.svg.text(fingerx - (fingersize / 2.5), fingery + (fingersize / 2), fingerNumber);
    text.attr({
        'font-size': fingersize * 1.6,
        fill: this.opts.fingerNumberColour
    });

}

/* Entry point */
window.onload = function() {

    // fingerSize is the base ratio for all proportions

    var theGuitar = new Guitar("#svg", {
        model: guitar(),
        x: 20,
        y: 20,
        fingerSize: 45,
        fingerColour: 'black',
        stringColour: 'black',
        fretColour: '#D2B48C'
    });

    theGuitar.draw();
}