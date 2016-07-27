/* Guitar class */
var Guitar = function (svg, opts) {
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
    this.fret2toNGroup = this.svg.group();
    this.fret2toNGroup.attr({ id: 'fret2toN' });
    this.openNotesReferenceGroup = this.svg.group();
    this.openNotesReferenceGroup.attr({ id: 'open-notes' });

}

Guitar.prototype.drawFretBoard = function () {

    // create a reference to 
    // the entire fretboard
    this.fretBoard = new FretBoard();
    var originalXpos = this.x;
    var fret = null;
    for (var i = 1; i <= this.opts.model.frets.length; i++) {
        fret = new Fret(this.svg, this.opts, this.x, this.y, this);
        var fretGroup = fret.draw(i);
        this.x += (this.opts.fingerSize * 6);
        if (i > 1) {
            this.fret2toNGroup.add(fretGroup);
        }
        this.fretBoard.addFret(fret);
    }

    var fretMask = this.svg.rect(originalXpos, this.y, this.opts.model.frets.length * (this.opts.fingerSize * 6), fret.fretHeight);
    fretMask.attr({
        id: 'fretMask',
        fill: '#666'
    });
    this.fret2toNGroup.add(fretMask);
    // this.fret2toNGroup.attr({
    //     mask:fretMask
    // });

}

Guitar.prototype.drawChord = function (chord) {
    // display any given chords' 
    // shape on to the fretboard 
    this.fretBoard.drawChord(chord);
    var delayTime = 0;
    $('.chord-indicator-finger,.chord-indicator-open,.chord-indicator-finger-text,.chord-indicator-noplay,.chord-indicator')
        .each(function () {
            $(this).delay(delayTime).animate({
                opacity: 1
            }, 50);
            delayTime += 50;
        });
}

Guitar.prototype.removeChord = function (chord) {
    // todo: grouping text and finger, or leave separate?
    var delayTime = 0;
    var animationTime = 35;
    $($(".chord-indicator-finger,.chord-indicator").get().reverse())
        .each(function () {
            $(this).delay(delayTime).animate({
                opacity: 0
            }, animationTime, function () {
                $(this).remove();
            });
            delayTime += animationTime;
        });
}

Guitar.prototype.slide = function () {
    var self = this;
    self.fret2toNGroup.animate({ 'transform': 'translate(-2200,0)' }, 4000, function () {
        self.fret2toNGroup.animate({ 'transform': 'translate(0,0)' }, 4000);
    });

}

Guitar.prototype.drawNotes = function (note) {
    // todo-feature: draw any given notes' multiple 
    // positions across the fretboard 
}

Guitar.prototype.drawCapo = function (note) {
    // todo-feature: draw a capo when required
}

var FretBoard = function () {
    this.frets = [];
}

FretBoard.prototype.addFret = function (fret) {
    this.frets.push(fret);
}

FretBoard.prototype.drawChord = function (chord) {
    for (var i = 0; i < this.frets.length; i++) {
        this.frets[i].drawChordShape(i + 1, chord.shape)
    }
}

FretBoard.prototype.removeChord = function (chord) {
    // find all fingers, x, o, etc
    // delete them. add a class - .chord-inidcator - to
    // all svg els relting to chord, then here, query and
    // remove them.

    // for (var i = 0; i < this.frets.length; i++) {
    //     this.frets[i].removeChordShape(i + 1, chord.shape)
    // }
}

/* Fret class */
var Fret = function (svg, opts, x, y, guitar) {
    this.svg = svg;
    this.opts = opts;
    this.fretx = x;
    this.frety = y;
    this.guitar = guitar;
    this.fretHeight = 0;
    this.spacer = this.fretHeight / 6;
}

Fret.prototype.draw = function (fretNumber) {

    for (var i = 1; i <= 6; i++) {
        // get calculated height for use earlier
        // in the source code order (no z-index 
        // in this SVG version)
        this.fretHeight += this.opts.fingerSize * 2;
    }

    var fretGroup = this.svg.group();
    fretGroup.attr({ id: 'fret' + fretNumber })

    // draw a fret
    var fret = this.svg.rect(this.fretx, this.frety, this.opts.fingerSize * 6, this.fretHeight);
    fret.attr({
        fill: this.opts.fretColour,
        stroke: "#000",
        strokeDasharray: '1 1'
    });
    fretGroup.add(fret);
    fretGroup.attr({ x: this.fretx });

    // draw fret number
    var text = this.svg.text(this.fretx + this.opts.fingerSize * 3, this.frety + this.fretHeight + this.opts.fingerSize * 1.6, fretNumber);
    text.attr({
        'font-size': this.opts.fingerSize,
        fill: this.opts.fretNumberColour
    });
    fretGroup.add(text);

    // draw strings and fingers on this fret
    this.drawStrings(fretNumber, fretGroup);
    return fretGroup;
}

Fret.prototype.extractShapeData = function (stringNumber, shape) {
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

Fret.prototype.calcFretY = function (stringNumber) {
    return this.frety + (stringNumber * (this.opts.fingerSize * 2) - this.opts.fingerSize);
}

Fret.prototype.drawStrings = function (fretNumber, fretGroup) {

    for (var i = 1; i <= 6; i++) {
        //var shapeData = this.extractShapeData(i, shape);
        var frety = this.calcFretY(i);
        // draw string on to the fret
        var guitarString = new GuitarString(this.svg, this.opts);
        guitarString.draw(this.fretx, frety, this.opts.fingerSize * 6, i, fretGroup);

        if (fretNumber == 1) {
            this.addOpenNotesReference(i, this.fretx, frety, this.guitar.openNotesReferenceGroup);
        }

    }
}

Fret.prototype.removeChordShape = function (fretNumber, shape) { }

Fret.prototype.addOpenNotesReference = function (stringNumber, x, y, openNotesReferenceGroup) {
    fretRef = ['E', 'A', 'D', 'G', 'B', 'e'];
    var eNoteRef = this.svg.text(x - (this.opts.fingerSize + 12), y + (this.opts.fingerSize / 2.5), fretRef[stringNumber - 1]);
    eNoteRef.attr({
        'font-size': this.opts.fingerSize * .9,
        fill: this.opts.fretNumberColour
    });
    openNotesReferenceGroup.add(eNoteRef);
}

Fret.prototype.drawChordShape = function (fretNumber, shape) {

    for (var i = 1; i <= 6; i++) {
        var fretGroupRef = this.svg.select('#fret' + fretNumber);
        var shapeData = this.extractShapeData(i, shape);
        var frety = this.calcFretY(i);
        // should we draw a finger on this string?
        if ((shapeData.shapeDataFret == fretNumber) && (shapeData.shapeDataString == i) && (shapeData.shapeDataFinger > 0)) {
            var finger = new Finger(this.svg, this.opts);
            finger.draw(this.fretx + (this.opts.fingerSize * 3), frety, this.opts.fingerSize, shapeData.shapeDataFinger, fretGroupRef);
        } else if ((shapeData.shapeDataFret == fretNumber - 1) && (shapeData.shapeDataString == i) && (shapeData.shapeDataFinger == 0)) {
            var open = this.svg.circle(this.opts.x, frety, this.opts.fingerSize / 4);
            open.attr({
                'class': 'chord-indicator chord-indicator-open',
                fill: this.opts.openStringColour
            });
        } else if ((shapeData.shapeDataFret == fretNumber - 1) && (shapeData.shapeDataString == i) && (shapeData.shapeDataFinger == -1)) {
            // must be a 'no play' indicator
            // todo: make an 'x' shape as per TAB notation
            var doNotPlay = this.svg.circle(this.opts.x, frety, this.opts.fingerSize / 4);
            doNotPlay.attr({
                'class': 'chord-indicator chord-indicator-noplay',
                fill: 'red'
            });
        }

    }

}


/* GuitarString class */
var GuitarString = function (svg, opts) {
    this.svg = svg;
    this.opts = opts;
}

GuitarString.prototype.draw = function (guitarStringx, guitarStringy, width, stringNumber, fretGroup) {
    // proportional string widths 
    var stringThickness = (this.opts.fingerSize / 12);
    if (6 / stringNumber == 1) {
        // thin
        stringThickness = stringThickness * .85;
    }
    if (6 / stringNumber == 6) {
        // thick
        stringThickness = stringThickness / .55;
    }
    var guitarString = this.svg.rect(guitarStringx, guitarStringy, width, stringThickness);
    guitarString.attr({
        fill: this.opts.stringColour
    });
    fretGroup.add(guitarString);
}

/* Finger class */
var Finger = function (svg, opts) {
    this.svg = svg;
    this.opts = opts;
}

Finger.prototype.draw = function (fingerx, fingery, fingersize, fingerNumber, fretGroupRef) {

    // finger
    var finger = this.svg.circle(fingerx, fingery, fingersize * .9);
    finger.attr({
        'class': 'chord-indicator chord-indicator-finger',
        fill: this.opts.fingerColour
    });

    fretGroupRef.add(finger);

    // finger number
    var text = this.svg.text(fingerx - (fingersize / 2.5), fingery + (fingersize / 2), fingerNumber);
    text.attr({
        'class': 'chord-indicator chord-indicator-finger-text',
        'font-size': fingersize * 1.6,
        fill: this.opts.fingerNumberColour
    });

    fretGroupRef.add(text);

}