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
    opts.defaults.fingerColour = 'black';
    opts.defaults.barColour = '#8B0000';
    opts.defaults.fingerNumberColour = 'white';
    opts.defaults.fretColour = '#D2B48C';
    opts.defaults.fretNumberColour = 'white';
    opts.defaults.fingerSize = 30;
    opts.defaults.openStringColour = 'black';
    opts.defaults.backgroundColour = '#fff';
    opts.defaults.x = 50;
    opts.defaults.y = 10;
    opts.fingerSize = opts.fingerSize || opts.defaults.fingerSize;
    opts.fretColour = opts.fretColour || opts.defaults.fretColour;
    opts.openStringColour = opts.openStringColour || opts.defaults.openStringColour;
    opts.backgroundColour = opts.backgroundColour || opts.defaults.backgroundColour;
    opts.fretNumberColour = opts.fretNumberColour || opts.defaults.fretNumberColour;
    opts.stringColour = opts.stringColour || opts.defaults.stringColour;
    opts.fingerColour = opts.fingerColour || opts.defaults.fingerColour;
    opts.barColour = opts.barColour || opts.defaults.barColour;
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
        fret = new Fret(this.svg, this.opts, this.x - 20, this.y, this);
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
    var fretMaskVertical = this.svg.rect(0, this.y, originalXpos - 20, fret.fretHeight)
        .attr({
            id: 'fret-mask-vertical',
            fill: this.opts.fretColour,
            stroke: '#000',
            strokeDasharray: '2 2'
        });
    $('#open-notes').prepend($('#fret-mask-vertical'));
    $('#open-notes').insertAfter($('#fret2toN'));
}

Guitar.prototype.drawChord = function(chord) {
    this.fretBoard.drawChord(chord);
    var delayTime = 0;
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
    $('.chord-indicator-bar').animate({
        opacity: 1
    }, 500);
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

    $('.chord-indicator-bar').fadeOut(200);

}

Guitar.prototype.slide = function(chord) {
    // slides arg fretNum to butt up against fret 1
    var self = this;
    $('.fret-number').show();

    self.svg.select('#fret1')
        .attr({
            filter: null // todo: fade out?
        });

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
            //?
        }
    );

    // prevent fret number overlaying fret number of fret 1
    // and hide fret number before it
    var fretNum = leftMostFretForChord;
    if (fretNum > 3) {
        $('#fret-number-' + (fretNum - 2)).hide();
        $('#fret-number-' + (fretNum - 3)).hide();

        // todo: low down z-index - make higher copy?
        // add first fret drop shadow
        self.svg.select('#fret1')
            .attr({
                filter: self.svg.filter(Snap.filter.shadow(2, 2, 10, "#000"))
            });
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
        // calculate fret height
        this.fretHeight += this.opts.fingerSize * 2;
    }

    var fretGroup = this.svg.group();
    fretGroup.attr({ id: 'fret' + fretNumber })

    // draw fret
    var fret = this.svg.rect(this.fretx, this.frety, this.opts.fingerSize * 6, this.fretHeight);
    fret.attr({
        fill: this.opts.fretColour,
        stroke: "#000",
        strokeDasharray: '2 2'
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
        var frety = this.calcFretY(i);
        var guitarString = new GuitarString(this.svg, this.opts);
        guitarString.draw(this.fretx, frety, this.opts.fingerSize * 6, i, fretGroup);

        if (fretNumber == 1) {
            this.addOpenNotesReference(i, this.fretx, frety, this.guitar.openNotesReferenceGroup);
        }
    }
}

Fret.prototype.removeChordShape = function(fretNumber, shape) {}

Fret.prototype.addOpenNotesReference = function(stringNumber, x, y, openNotesReferenceGroup) {
    fretRef = ['e', 'B', 'G', 'D', 'A', 'E'];
    var eNoteRef = this.svg.text(x - (this.opts.fingerSize - 2.5), y + (this.opts.fingerSize / 5), fretRef[stringNumber - 1]);
    eNoteRef.attr({
        'font-size': this.opts.fingerSize * .6,
        fill: this.opts.fretNumberColour
    });
    openNotesReferenceGroup.add(eNoteRef);

}

Fret.prototype.drawChordShape = function(fretNumber, shape) {
    var barredFret = 0;
    for (var i = 1; i <= 6; i++) {
        var fretGroupRef = this.svg.select('#fret' + fretNumber);
        var shapeData = this.extractShapeData(i, shape);
        var frety = this.calcFretY(i);
        if (shapeData.shapeDataFinger == -2) {
            barredFret = shapeData.shapeDataFret;
        }
        // should we draw a finger on this string?
        if ((shapeData.shapeDataFret == fretNumber) && (shapeData.shapeDataString == i) && (shapeData.shapeDataFinger > 0)) {
            var finger = new Finger(this.svg, this.opts);
            finger.draw(this.fretx + (this.opts.fingerSize * 3), frety, this.opts.fingerSize, shapeData.shapeDataFinger, fretGroupRef);
        } else if ((shapeData.shapeDataFret == fretNumber) && (shapeData.shapeDataString == i) && (shapeData.shapeDataFinger == 0) && barredFret == 0) {
            var open = this.svg.circle(this.opts.fret1x - 20, frety, this.opts.fingerSize / 4);
            open.attr({
                'class': 'chord-indicator chord-indicator-open',
                fill: this.opts.openStringColour
            });
        } else if ((shapeData.shapeDataFret == fretNumber) && (shapeData.shapeDataString == i) && (shapeData.shapeDataFinger == -1) && barredFret == 0) {
            // must be a 'no play' indicator
            // todo: make an 'x' shape as per TAB notation  
            var doNotPlay = this.svg.circle(this.opts.fret1x - 20, frety, this.opts.fingerSize / 4);
            doNotPlay.attr({
                'class': 'chord-indicator chord-indicator-noplay',
                fill: 'red'
            });
        } else if (barredFret > 0) {
            // it must be a barred chord 
            var fretWidth = this.opts.fingerSize * 6;
            if (i == 1 && shapeData.shapeDataFret == fretNumber) {
                var bar = this.svg.rect(this.fretx + (fretWidth / 2.5), this.y, this.opts.fingerSize * 1.5, this.opts.fingerSize * 12);
                bar.attr({
                    'class': 'chord-indicator-bar',
                    fill: this.opts.barColour,
                    opacity: 0
                });
                fretGroupRef.add(bar);
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
    var stringThickness = (this.opts.fingerSize / 12);
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
        'font-size': fingersize * 1.4,
        fill: this.opts.fingerNumberColour
    });

    fretGroupRef.add(text);

}