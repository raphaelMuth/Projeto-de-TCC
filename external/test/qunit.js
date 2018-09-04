(function (global$1) {
    'use strict';

    global$1 = global$1 && global$1.hasOwnProperty('default') ? global$1['default'] : global$1;

    var window = global$1.window;
    var self$1 = global$1.self;
    var console = global$1.console;
    var setTimeout = global$1.setTimeout;
    var clearTimeout = global$1.clearTimeout;

    var document = window && window.document;
    var navigator = window && window.navigator;

    var localSessionStorage = function () {
        var x = "qunit-test-string";
        try {
            global$1.sessionStorage.setItem(x, x);
            global$1.sessionStorage.removeItem(x);
            return global$1.sessionStorage;
        } catch (e) {
            return undefined;
        }
    }();

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
    } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
})