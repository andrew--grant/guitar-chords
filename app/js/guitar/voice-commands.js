VoiceCommands = function(chordCallback, noteCallback) {
    this.chordCallback = chordCallback;
    this.noteCallback = noteCallback;
}

VoiceCommands.prototype.listen = function() {
    var self = this;
    var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
    var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
    // todo: what is the current stuatus of specification and how
    // exactly are grammars supposed to be utilised?
    //var grammar = '#JSGF V1.0; grammar phrase; public <g chord> = g chord | G chord | g code | G code;';
    var recognition = new SpeechRecognition();
    //var speechRecognitionList = new SpeechGrammarList();
    //speechRecognitionList.addFromString(grammar, 1);
    //recognition.grammars = speechRecognitionList;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 10;
    recognition.start();

    recognition.onresult = function(event) {
        var speechResult = null;
        // todo: use thsi list of alternatives
        // todo: consider training option - mapping
        // users intentions/words to the required commands
        var arrPossiblities = event.results[0];
        for (var i = 0; i < arrPossiblities.length; i++) {
            console.log(arrPossiblities[i]);
            var transcript = arrPossiblities[i].transcript.toLowerCase();
            if (transcript.indexOf('chord') > -1) {
                // this alt at least contains the word 'chord'
                // lets get what came prior to that word, ideally
                // it will be a chord term ('a', 'f sharp' 'e minor' etc) 
                console.log('found term \'chord\' on pass ' + i);
                speechResult = transcript;
                break;



            }
            // speechResult = event.results[0][0].transcript;
            console.log(arrPossiblities[i]);
        }
        if (speechResult != null) {
            self.onChord(speechResult);
        } else {
            // todo: handle case
            // alert('no luck identifying command');
        }
        recognition.stop();
    }

    recognition.onspeechend = function(e) {
        recognition.stop();
        self.listen();
    }

    recognition.onnomatch = function(event) {
        console.log('onnomatch');
    }

    recognition.onerror = function(event) {
        console.log('onerror');
        if (event.error == 'no-speech') {
            self.listen();
        }
    }


}


VoiceCommands.prototype.onChord = function(chord) {
    // what is the chord/letter?
    console.log('onChord: ' + chord);
    chord = chord.replace('chord', '').replace(' ', '');
    // pass it to the callback
    this.chordCallback(chord.toLowerCase());
}