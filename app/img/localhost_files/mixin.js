var mixin = {

    debug: function(message) {
        console.debug(message);
    },

    log: function(message) {
        console.log(message);
    },

    logObject: function(obj, objLabel) {
        console.log('----------------' +
            (objLabel ? ' ' + objLabel + ' ----------------' : ' log object -----------'));
        console.log(obj);
    }
}