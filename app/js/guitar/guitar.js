/* Guitar class */
// todo: rename from 'main.js' to something better
var Guitar = function(svg, opts) {
    // cant do anything without a guitar 
    // and chords data model or...
    if (!opts.model) {
        throw Error('\'model\' is a required option');
    }
    // ... an SVG element
    if (!svg) {
        throw Error('\'svg\' is a required argument');
    }
    // options and defaults
    this.svg = Snap(svg);
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
    this.fretBoard = null;
}

Guitar.prototype.drawFretBoard = function() {

    // create a reference to the entire fretboard
    this.fretBoard = new FretBoard();

    for (var i = 1; i <= this.opts.model.frets.length; i++) {
        var fret = new Fret(this.svg, this.opts, this.x, this.y);
        fret.draw(i, 'g'); // todo: pass the chords from UI (selector)
        this.x += (this.opts.fingerSize * 6);
        this.fretBoard.addFret(fret);
    }


}

Guitar.prototype.drawChord = function(chord) {
    // display any given chords' shape on fretboard 
    this.fretBoard.drawChord(chord);
    var delayTime = 0;
    // todo: animate text seprately/later
    $('.chord-indicator-finger,.chord-indicator-open,.chord-indicator-finger-text,.chord-indicator-noplay,.chord-indicator')
        .each(function() {
            $(this).delay(delayTime).animate({
                opacity: 1
            }, 50, function() {
                //$(this).remove();
            });
            delayTime += 50;
        });
}

Guitar.prototype.removeChord = function(chord) {
    // todo: grouping text and finger, or leave separate?
    // todo: remove in reverse order?
    var delayTime = 0;
    $('.chord-indicator-finger,.chord-indicator').each(function() {
        $(this).delay(delayTime).animate({
            opacity: 0
        }, 50, function() {
            $(this).remove();
        });
        delayTime += 50;
    });
}

Guitar.prototype.drawNotes = function(note) {
    // todo: draw any given notes' multiple 
    // positions across the fretboard 
}

var FretBoard = function() {
    this.frets = [];
}

FretBoard.prototype.addFret = function(fret) {
    this.frets.push(fret);
}

FretBoard.prototype.drawChord = function(chord) {
    for (var i = 0; i < this.frets.length; i++) {
        this.frets[i].drawChordShape(i + 1, chord.shape)
    }
}

FretBoard.prototype.removeChord = function(chord) {
    // find all fingers, x, o, etc
    // delete them. add a class - .chord-inidcator - to
    // all svg els relting to chord, then here, query and
    // remove them.

    // for (var i = 0; i < this.frets.length; i++) {
    //     this.frets[i].removeChordShape(i + 1, chord.shape)
    // }
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

    // todo: store ref to passed fret and draw chord when ready?
    // given the chord of, say 'a', we need to 
    // get the shape of that chord from data model
    // var chordObj = _.find(this.opts.model.chords,
    //     function(o) {
    //         return o.name == chord;
    //     });
    // var shape = chordObj.shape;

    var fretHeight = 0;
    for (var i = 1; i <= 6; i++) {
        // get calculated height for use earlier
        // in the source code order (no z-index 
        // in this SVG version)
        fretHeight += this.opts.fingerSize * 2;
    }

    // draw a fret
    var fret = this.svg.rect(this.fretx, this.frety, this.opts.fingerSize * 6, fretHeight);
    fret.attr({
        fill: this.opts.fretColour,
        stroke: "#000",
        strokeDasharray: '1 1'
    });

    // draw fret number
    var text = this.svg.text(this.fretx + this.opts.fingerSize * 3, this.frety + fretHeight + this.opts.fingerSize * 1.6, fretNumber);
    text.attr({
        'font-size': this.opts.fingerSize,
        fill: this.opts.fretNumberColour
    });

    // draw strings and fingers on this fret
    this.drawStrings(fretNumber);
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
    return this.frety + (stringNumber * (this.opts.fingerSize * 2) - this.opts.fingerSize);
}

Fret.prototype.drawStrings = function(fretNumber) {

    for (var i = 1; i <= 6; i++) {
        //var shapeData = this.extractShapeData(i, shape);
        var frety = this.calcFretY(i);
        // draw string on to the fret
        var guitarString = new GuitarString(this.svg, this.opts);
        guitarString.draw(this.fretx, frety, this.opts.fingerSize * 6, i);

        if (fretNumber == 1) {
            this.addOpenNotesReference(i, this.fretx, frety);
        }
    }
}

Fret.prototype.removeChordShape = function(fretNumber, shape) {}

Fret.prototype.addOpenNotesReference = function(stringNumber, x, y) {
    console.log('EADGBe notation ' + stringNumber);
    fretRef = ['E', 'A', 'D', 'G', 'B', 'e'];
    var eNoteRef = this.svg.text(x - this.opts.fingerSize, y + (this.opts.fingerSize / 2), fretRef[stringNumber - 1]); //todo: tweak centring and distance
    eNoteRef.attr({
        'font-size': this.opts.fingerSize * .9,
        fill: this.opts.fretNumberColour
    });
}


Fret.prototype.drawChordShape = function(fretNumber, shape) {
    // todo: draw new fingers each time, or 'slide' a prepared set
    // in as chord changes? Eg; create a 'fingers' collection that
    // can be repositioned? Either way, conide performance and if
    // clean up of any continually generated SVG shapes is required.

    // todo: when fingers move, animate the fret numbers they land on??
    // or simply make darker/empahasised

    // todo: add 'EADGBe' notation near first fret (make option)

    for (var i = 1; i <= 6; i++) {
        var shapeData = this.extractShapeData(i, shape);
        var frety = this.calcFretY(i);
        // should we draw a finger on this string?
        if ((shapeData.shapeDataFret == fretNumber) && (shapeData.shapeDataString == i) && (shapeData.shapeDataFinger > 0)) {
            var finger = new Finger(this.svg, this.opts);
            finger.draw(this.fretx + (this.opts.fingerSize * 3), frety, this.opts.fingerSize, shapeData.shapeDataFinger);
        } else if ((shapeData.shapeDataFret == fretNumber - 1) && (shapeData.shapeDataString == i) && (shapeData.shapeDataFinger == 0)) {
            var open = this.svg.circle(this.opts.x, frety, this.opts.fingerSize / 2);
            open.attr({
                'class': 'chord-indicator chord-indicator-open',
                fill: this.opts.openStringColour
            });
        } else if ((shapeData.shapeDataFret == fretNumber - 1) && (shapeData.shapeDataString == i) && (shapeData.shapeDataFinger == -1)) {
            // must be a 'no play'
            // todo: make an 'x' shape (text)?
            var doNotPlay = this.svg.circle(this.opts.x, frety, this.opts.fingerSize / 2);
            doNotPlay.attr({
                'class': 'chord-indicator chord-indicator-noplay',
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
        stringThickness = stringThickness / .55; // todo: reduce opacity (as in, make grey)
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
        'class': 'chord-indicator chord-indicator-finger',
        fill: this.opts.fingerColour
    });

    // finger number
    var text = this.svg.text(fingerx - (fingersize / 2.5), fingery + (fingersize / 2), fingerNumber);
    text.attr({
        'class': 'chord-indicator chord-indicator-finger-text',
        'font-size': fingersize * 1.6,
        fill: this.opts.fingerNumberColour
    });

}