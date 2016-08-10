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

Guitar.prototype.drawFretBoard = function () {
    // create a reference to 
    // the entire fretboard
    this.fretBoard = new FretBoard();
    var originalXpos = this.x;
    var fret = null;
    for (var i = 1; i <= this.opts.model.frets.length; i++) {
        fret = new Fret(this.svg, this.opts, this.x - 20, this.y, this);
        var fretGroup = fret.draw(i, this.opts.model.frets[i - 1][1]);
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

Guitar.prototype.drawChord = function (chord) {
    this.fretBoard.drawChord(chord);
    var delayTime = 0;
    $('.chord-indicator-finger,.chord-indicator-finger-text')
        .each(function (evt) {
            $(this).delay(delayTime).animate({
                opacity: 1
            }, 200);
            delayTime += 70;
        });
    $('.chord-indicator-noplay,.chord-indicator-open')
        .each(function () {
            $(this).delay(delayTime).animate({
                opacity: 1
            }, 200);
            delayTime += 70;
        });
    $('.chord-indicator-bar').animate({
        opacity: 1
    }, 500);

    $('.chord-button').removeClass('chord-button-active');
    var elsToMakeActive = $('.chord-button').filter(
        function (index) {
            return $(this).text() === chord.name;
        });
    if (elsToMakeActive) {
        // todo: only caters to 1 menu item, but we could 
        // have multiple elements that need updating
        // todo: animate/fade etc
        $(elsToMakeActive[0]).addClass('chord-button-active');
    }
    console.log(elsToMakeActive[0].innerText);
    this.slide(chord);
}

Guitar.prototype.playChordCategory = function (chordCategory) {
    var self = this;
    _.forEach(chordCategory, function (value, index) {
        var interval = 7000;
        // todo: allow for interupting, clear all timeouts
        // todo: set a 'time to grab guitar' delay
        setTimeout(function () {
            // todo: timer as per Chris idea (need to set a fixed size for
            // chord menu items)
            // todo: highlight currently playing chord (on the menu item)
            // todo: need to allow looping? A setting?
            // todo: photo library, optional setting?
            self.removeChord();
            self.drawChord(value);
        }, interval * index);
    });
}

Guitar.prototype.removeChord = function (chord) {
    var delayTime = 0;
    var animationTime = 35;
    $($('.chord-indicator-finger,.chord-indicator-finger-text,.chord-indicator-open,.chord-indicator-noplay').get().reverse())
        .each(function () {
            $(this).delay(delayTime).animate({
                opacity: 0
            }, animationTime, function () {
                $(this).remove();
            });
            delayTime += animationTime;
        });
    $('.chord-indicator-bar').fadeOut(200);
}

Guitar.prototype.slide = function (chord) {
    var self = this;
    $('.fret-number').show();
    $('#fret1shadow').fadeOut(function () {
        $('#fret1shadow').remove();
    });

    self.svg.select('#fret1')
        .attr({
            filter: null // todo: fade out? is this even required anymore?
        });

    // todo: remove any unused vars
    // todo: look for any optmisations 

    var fretArr = [];
    for (var i = 0; i < 6; i++) {
        if (chord.shape[i][0] > 0) {
            fretArr.push(chord.shape[i][0]);
        }
    }

    var leftMostFretForChord = _.min(fretArr, function (o) {
        return o.val;
    });

    var fretWidth = self.opts.fingerSize * 6;
    var moveToX = (fretWidth * (leftMostFretForChord - 3));

    // slide the fretboard
    moveToX = moveToX >= 0 ? moveToX : 0;
    self.fret2toNGroup.animate({ 'transform': 'translate(-' + moveToX + ',0)' }, 1200, mina.easeinout,
        function () {
            // todo: remove if no longer needed, test!
        }
    );

    // prevent fret number overlaying fret number of fret 1
    // and hide fret number before it
    var fretNum = leftMostFretForChord;
    if (fretNum > 3) {
        $('#fret-number-' + (fretNum - 2)).hide();
        $('#fret-number-' + (fretNum - 3)).hide();

        var gradient = self.svg.gradient("l(0, 0, 1, 0)-rgba(55,55,55,.7)-rgba(0,0,0,.3)-rgba(0,0,0,0)");

        var fretWidth = self.opts.fingerSize * 6;
        var fretHeight = self.fretBoard.frets[0].fretHeight
        var shadowx = parseInt(self.svg.select('#fret1').attr('x'));
        // todo: bug here - dbl clicking will cause multiple shadows, and remove only
        // removes one of them. Solve via a boroader dbl click prevention solution?
        var fret1Shadow = this.svg.rect(shadowx + fretWidth, self.y, fretWidth / 12, fretHeight);
        fret1Shadow.attr({
            fill: gradient,
            id: 'fret1shadow'
        });
        $('#fret1shadow').hide().insertAfter($('#fret2toN')).fadeIn();
    }
}

Guitar.prototype.barFret = function (fretNum) {
    // todo: refactor to use this func?
    // todo: review barred fret visuals alongside the fretmarkers
    // (z-index issue / centering issue)
}

var FretBoard = function () {
    this.frets = [];
}

FretBoard.prototype.addFret = function (fret) {
    this.frets.push(fret);
}

FretBoard.prototype.drawChord = function (chord) {
    for (var i = 0; i < this.frets.length; i++) {
        this.frets[i].drawChordShape(i + 1, chord.shape);
    }
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
    this.x = x;
    this.y = y;
}

Fret.prototype.draw = function (fretNumber, markers) {
    var fretWidth = this.opts.fingerSize * 6;
    for (var i = 1; i <= 6; i++) {
        // calculate fret height
        this.fretHeight += this.opts.fingerSize * 2;
    }

    var fretGroup = this.svg.group();
    fretGroup.attr({ id: 'fret' + fretNumber })

    // draw fret
    var fret = this.svg.rect(this.fretx, this.frety, fretWidth, this.fretHeight);
    fret.attr({
        fill: this.opts.fretColour,
        stroke: "#000",
        strokeDasharray: '2 2'
    });
    fretGroup.add(fret);
    fretGroup.attr({ x: this.fretx });

    // draw fret number
    var text = this.svg.text(this.fretx + (fretWidth / 2), this.frety + this.fretHeight + this.opts.fingerSize * 1.6, fretNumber);
    text.attr({
        'font-size': this.opts.fingerSize,
        fill: this.opts.fretNumberColour,
        id: 'fret-number-' + fretNumber,
        'class': 'fret-number'
    });
    fretGroup.add(text);

    // draw marker(s) 
    var markerOpacity = .2;
    var markerClassName = 'fret-marker';
    var markerFillColor = '#eee'; // todo: better color/shape??
    var markerSize = 14;
    var markerx = this.fretx - (fretWidth / 2);
    switch (markers) {

        case 1:
            var marker = this.svg.circle(markerx, this.frety + (this.fretHeight / 2), markerSize);
            marker.attr({
                fill: markerFillColor,
                //filter: this.svg.filter(Snap.filter.hueRotate(122)),
                opacity: markerOpacity,
                'class': markerClassName
            });
            fretGroup.add(marker);
            break;

        case 2:
            var marker1 = this.svg.circle(markerx, this.frety + (this.fretHeight - 50), markerSize);
            marker1.attr({
                fill: markerFillColor,
                opacity: markerOpacity,
                'class': markerClassName
            });
            fretGroup.add(marker1);
            var marker2 = this.svg.circle(markerx, this.frety + (this.fretHeight - (this.fretHeight - 50)), markerSize);
            marker2.attr({
                fill: markerFillColor,
                opacity: markerOpacity,
                'class': markerClassName
            });
            fretGroup.add(marker2);
            break;
    }

    // draw strings and fingers on this fret
    this.drawStrings(fretNumber, fretGroup);
    return fretGroup;
}

Fret.prototype.extractShapeData = function (stringNumber, shape) {
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
        var frety = this.calcFretY(i);
        var guitarString = new GuitarString(this.svg, this.opts);
        guitarString.draw(this.fretx, frety, this.opts.fingerSize * 6, i, fretGroup);

        if (fretNumber == 1) {
            this.addOpenNotesReference(i, this.fretx, frety, this.guitar.openNotesReferenceGroup);
        }
    }
}

Fret.prototype.addOpenNotesReference = function (stringNumber, x, y, openNotesReferenceGroup) {
    // todo: option to show numbers instead of 'EADGBe'
    fretRef = ['e', 'B', 'G', 'D', 'A', 'E'];
    var eNoteRef = this.svg.text(x - (this.opts.fingerSize - 2.5), y + (this.opts.fingerSize / 5), fretRef[stringNumber - 1]);
    eNoteRef.attr({
        'font-size': this.opts.fingerSize * .5,
        fill: this.opts.fretNumberColour
    });
    openNotesReferenceGroup.add(eNoteRef);

}

Fret.prototype.drawChordMarker = function (fretNumber, markers) {
    if (markers) {
        for (var i = 0; i < markers.length; i++) {
            var marker = this.svg.circle(this.opts.fret1x + 100, 40, this.opts.fingerSize / 4);
            marker.attr({
                'class': 'chord-indicator chord-indicator-marker',
                fill: 'green'
            });
        }
    }
}

Fret.prototype.drawChordShape = function (fretNumber, shape) {

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
var GuitarString = function (svg, opts) {
    this.svg = svg;
    this.opts = opts;
}

GuitarString.prototype.draw = function (guitarStringx, guitarStringy, width, stringNumber, fretGroup) {
    var stringThickness = (this.opts.fingerSize / 12);
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
        'font-size': fingersize * 1.4,
        fill: this.opts.fingerNumberColour
    });

    fretGroupRef.add(text);

}