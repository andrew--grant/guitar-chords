/* Guitar class */
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
    opts.defaults.backgroundColour = '#fff';
    opts.defaults.x = 75;
    opts.defaults.y = 10;
    opts.fingerSize = opts.fingerSize || opts.defaults.fingerSize;
    opts.fretColour = opts.fretColour || opts.defaults.fretColour;
    opts.openStringColour = opts.openStringColour || opts.defaults.openStringColour;
    opts.backgroundColour = opts.backgroundColour || opts.defaults.backgroundColour;
    opts.fretNumberColour = opts.fretNumberColour || opts.defaults.fretNumberColour;
    opts.stringColour = opts.stringColour || opts.defaults.stringColour;
    opts.fingerColour = opts.fingerColour || opts.defaults.fingerColour;
    opts.fingerNumberColour = opts.fingerNumberColour || opts.defaults.fingerNumberColour;
    this.x = this.opts.x || opts.defaults.x;
    this.y = this.opts.y || opts.defaults.y;
    this.fretBoard = null;
    this.fret2toNGroup = null;
    this.openNotesReferenceGroup = this.svg.group();
    this.openNotesReferenceGroup.attr({ id: 'open-notes' });
    this.slidToFret = 2; // default, fret 2 is butted up against fret 1
    this.lastSlidtoNum = 0; // default, not moved yet
    this.opts.fret1x = this.x;

}

Guitar.prototype.drawFretBoard = function() {

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
            if (!this.fret2toNGroup) {
                this.fret2toNGroup = this.svg.group();
                this.fret2toNGroup.attr({ id: 'fret2toN' });
            }
            this.fret2toNGroup.add(fretGroup);
        }
        this.fretBoard.addFret(fret);
    }

    var fret1x = this.fretBoard.frets[0].fretx;
    var fretHeight = this.fretBoard.frets[0].fretHeight;

    // not a 'real' SVG mask, but blocks the fretboard as it slides left 
    var fretMaskVertical = this.svg.rect(0, this.y - 1, originalXpos, fret.fretHeight + (this.opts.fingerSize * 2))
        .attr({ id: 'fret-mask-vertical', fill: this.opts.backgroundColour });
    // in source order, use DOM to move open-notes above mask
    $('#open-notes').prepend($('#fret-mask-vertical'));

    var fretMaskHorizonontal = this.svg.rect(fret1x, fretHeight + this.opts.fingerSize, fret.fretHeight / 4, (fret.fretHeight / (this.opts.fingerSize * 2)) + (this.opts.fingerSize))
        .attr({ id: 'fret-mask-horizontal', fill: this.opts.backgroundColour });
    $('#open-notes').prepend($('#fret-mask-horizontal'));
    $('#open-notes').insertAfter($('#fret2toN'));


}

Guitar.prototype.drawChord = function(chord) {
    // display any given chords' 
    // shape on to the fretboard 
    this.fretBoard.drawChord(chord);
    var delayTime = 0;
    // todo: relying on source order, which changed when
    // the fretToNGroup approach was adopted - fix or removed
    // stepped/ordered animation? Could just do a step 1, 
    // fingers, then step 2, end fret indicators?

    // $('.chord-indicator-finger,.chord-indicator-finger-text,.chord-indicator-noplay,.chord-indicator-open').animate({
    //     opacity: 1
    // }, 750, function() { console.log('ended'); });

    $('.chord-indicator-finger,.chord-indicator-finger-text')
        .each(function(evt) {
            $(this).delay(delayTime).animate({
                opacity: 1
            }, 200);
            delayTime += 70;
        });

    $('.chord-indicator-noplay,.chord-indicator-open')
        .each(function() {
            $(this).delay(delayTime).animate({
                opacity: 1
            }, 200);
            delayTime += 70;
        });

    // slide chord into view
    this.slide(chord);
}

Guitar.prototype.removeChord = function(chord) {
    var delayTime = 0;
    var animationTime = 35;
    $($('.chord-indicator-finger,.chord-indicator-finger-text,.chord-indicator-open,.chord-indicator-noplay').get().reverse())
        .each(function() {
            $(this).delay(delayTime).animate({
                opacity: 0
            }, animationTime, function() {
                $(this).remove();
            });
            delayTime += animationTime;
        });
}

Guitar.prototype.slide = function(chord) {
    // slides arg fretNum to butt up against fret 1
    var self = this;
    $('.fret-number').show();

    // todo: remove any unused vars
    // todo: look for any optmisations 

    // what is the slide pos
    // required by this chord?  
    var fretArr = [];
    for (var i = 0; i < 6; i++) {
        if (chord.shape[i][0] > 0) {
            fretArr.push(chord.shape[i][0]);
        }
    }

    var leftMostFretForChord = _.min(fretArr, function(o) {
        return o.val;
    });

    var fretWidth = self.opts.fingerSize * 6;
    var moveToX = (fretWidth * (leftMostFretForChord - 3));

    // do the slide 
    moveToX = moveToX >= 0 ? moveToX : 0;
    self.fret2toNGroup.animate({ 'transform': 'translate(-' + moveToX + ',0)' }, 1200, mina.easeinout,
        function() {
            // self.slidToFret = leftMostFretForChord;
            // self.lastSlidtoNum = moveToX;
        }
    );

    // prevent fret number overlaying fret number of fret 1

    var fretNum = leftMostFretForChord;
    if (fretNum > 3) {
        $('#fret-number-' + (fretNum - 2)).hide();
    }

}

Guitar.prototype.drawNotes = function(note) {
    // todo-feature: draw any given notes' multiple 
    // positions across the fretboard 
}

Guitar.prototype.barFret = function(fretNum) {
    // indicate this fret is barred


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


/* Fret class */
var Fret = function(svg, opts, x, y, guitar) {
    this.svg = svg;
    this.opts = opts;
    this.fretx = x;
    this.frety = y;
    this.guitar = guitar;
    this.fretHeight = 0;
    this.spacer = this.fretHeight / 6;
    this.x = x;
    this.y = y;
}

Fret.prototype.draw = function(fretNumber) {

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
        fill: this.opts.fretNumberColour,
        id: 'fret-number-' + fretNumber,
        'class': 'fret-number'
    });
    fretGroup.add(text);

    // draw strings and fingers on this fret
    this.drawStrings(fretNumber, fretGroup);
    return fretGroup;
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

Fret.prototype.drawStrings = function(fretNumber, fretGroup) {

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

Fret.prototype.removeChordShape = function(fretNumber, shape) {}

Fret.prototype.addOpenNotesReference = function(stringNumber, x, y, openNotesReferenceGroup) {
    fretRef = ['E', 'A', 'D', 'G', 'B', 'e'];
    var eNoteRef = this.svg.text(x - (this.opts.fingerSize + 12), y + (this.opts.fingerSize / 2.5), fretRef[stringNumber - 1]);
    eNoteRef.attr({
        'font-size': this.opts.fingerSize * .9,
        fill: this.opts.fretNumberColour
    });
    openNotesReferenceGroup.add(eNoteRef);

}

Fret.prototype.drawChordShape = function(fretNumber, shape) {

    var barredFret = 0; // assume no bar required

    for (var i = 1; i <= 6; i++) {
        var fretGroupRef = this.svg.select('#fret' + fretNumber);
        var shapeData = this.extractShapeData(i, shape);
        var frety = this.calcFretY(i);

        if (shapeData.shapeDataFinger == -2) {
            barredFret = shapeData.shapeDataFret;
            console.log('no need to draw other indicators as its barred anyway at fret ' + barredFret);

        }

        // should we draw a finger on this string?
        if ((shapeData.shapeDataFret == fretNumber) && (shapeData.shapeDataString == i) && (shapeData.shapeDataFinger > 0)) {
            var finger = new Finger(this.svg, this.opts);
            finger.draw(this.fretx + (this.opts.fingerSize * 3), frety, this.opts.fingerSize, shapeData.shapeDataFinger, fretGroupRef);
        } else if ((shapeData.shapeDataFret == fretNumber) && (shapeData.shapeDataString == i) && (shapeData.shapeDataFinger == 0)) {
            var open = this.svg.circle(this.opts.fret1x, frety, this.opts.fingerSize / 4);
            open.attr({
                'class': 'chord-indicator chord-indicator-open',
                fill: this.opts.openStringColour
            });
        } else if ((shapeData.shapeDataFret == fretNumber) && (shapeData.shapeDataString == i) && (shapeData.shapeDataFinger == -1)) {
            // must be a 'no play' indicator
            // todo: make an 'x' shape as per TAB notation  
            var doNotPlay = this.svg.circle(this.opts.fret1x, frety, this.opts.fingerSize / 4);
            doNotPlay.attr({
                'class': 'chord-indicator chord-indicator-noplay',
                fill: 'red'
            });
        } else if (barredFret > 0) {
            // its a barred chord 
            if (i == 1 && shapeData.shapeDataFret == fretNumber) {
                // [7, 1, -2], // fret, string, finger
                var bar = this.svg.rect(this.fretx, frety, 70, 90);
                //todo: look at finger.draw to make it work !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            }

        }

    }

}


/* GuitarString class */
var GuitarString = function(svg, opts) {
    this.svg = svg;
    this.opts = opts;
}

GuitarString.prototype.draw = function(guitarStringx, guitarStringy, width, stringNumber, fretGroup) {
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
var Finger = function(svg, opts) {
    this.svg = svg;
    this.opts = opts;
}

Finger.prototype.draw = function(fingerx, fingery, fingersize, fingerNumber, fretGroupRef) {

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