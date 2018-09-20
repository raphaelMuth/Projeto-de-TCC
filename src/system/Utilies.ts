/**
 * This namespace contains helper functions that I use a lot around the code base
 * or encapluate snippets of code I use a lot in the codebase though by naming it 
 * asa function gives the code more readablity.
 *
 * Logger
 * Just wraps the console.log functions alloing me to switch them on and off easily
 *
 * Keyboard
 * Keeps track of which keys are pressed and allows for polling in gameloop
 * which is faster then event based input.
 *
 */
///<reference path="../Settings.ts" />
///<reference path="Physics.ts" />
declare var $;
interface String
{
    format(...numbers: String[]);
}

String.prototype.format = function (...numbers: String[])
{
    var args = arguments;
    return this.replace(/{(\d+)}/g, function (match, number)
    {
        return typeof args[number] != 'undefined'
          ? args[number]
          : match
            ;
    });
};

module Notify
{
    export var locked = false;
    export var levels = {
        sucess: "alert-success",
        warn: "alert-warn",
        error: "alert-error"
    };

    export const getNotificationHeight = () => {
        return parseInt( $(Constants.CSS_ID_NOTIFICATION).css("height") );
    }

    export const display = (header: string, message: string, autoHideTime = 2800, cssStyle = Notify.levels.sucess,doNotOverWrite = false) =>
    {
        if (!locked)
        {
            locked = doNotOverWrite;
            $(Constants.CSS_ID_NOTIFICATION).removeClass(levels.warn);
            $(Constants.CSS_ID_NOTIFICATION).removeClass(levels.error);
            $(Constants.CSS_ID_NOTIFICATION).removeClass(levels.sucess);
            $(Constants.CSS_ID_NOTIFICATION).addClass(cssStyle);

            $(Constants.CSS_ID_NOTIFICATION + " strong").empty();
            $(Constants.CSS_ID_NOTIFICATION + " strong").html(header);

            $(Constants.CSS_ID_NOTIFICATION + " p").empty();
            $(Constants.CSS_ID_NOTIFICATION + " p").html(message);

            $(Constants.CSS_ID_NOTIFICATION)
                .animate({ top: getNotificationHeight() + "px" }, 400, () =>
                {
                    if (autoHideTime > 0)
                    {
                        setTimeout(hide, autoHideTime);
                    }
                });


        }


    }

    export const cleanHide = (callback = null) => {
        Notify.hide();
        $(Constants.CSS_ID_NOTIFICATION + " strong").empty();
        $(Constants.CSS_ID_NOTIFICATION + " p").empty();
    }

    export const hide = (callback = null) =>
    {
        if (!locked)
        {
            $(Constants.CSS_ID_NOTIFICATION)
                .animate({ top: (-getNotificationHeight()) - 100 + "px" }, 400, () => {
                locked = false;
                if (callback != null) 
                    callback(); 
            });
        }
    }

}

module Utilies
{

    //Allows for the copying of Object types into their proper types, used for copy constructer
    //for objects that are sent over the network. I have intergrated this function, into
    // the constructor of the Person object so it acts like C-style copy construction
    // WARNING: This creates a deep copy, so reference are not preserved
    export const copy = (newObject, oldObject) =>
    {
        for (var member in oldObject)
        {
            if (typeof (oldObject[member]) == "object")
            {   
                try { newObject[member] = copy(newObject[member], oldObject[member]) }
                catch (e) { }
            } else
            {
                try { newObject[member] = oldObject[member]; }
                catch (e) { }
            }
        }

        return newObject;
    };

    export const sign = (x) => { return x > 0 ? 1 : x < 0 ? -1 : 0; }

    export const findByValue = (needle, haystack, haystackProperity, ) =>
    {

        for (var i = 0; i < haystack.length; i++)
        {
            if (haystack[i][haystackProperity] === needle)
            {
                return haystack[i];
            }
        }
        throw "Couldn't find object with proerpty " + haystackProperity + " equal to " + needle;
    }

    export const random = (min, max) =>
    {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    export const pickRandom = (collection) =>
    {
        return collection[random(0, collection.length - 1)];
    }

    var pickUnqineCollection = [];
    export const pickUnqine = (collection, stringId: string) =>
    {
        if (pickUnqineCollection[stringId])
        {
            var items = pickUnqineCollection[stringId];

            if (items.length <= 0)
            {
                Logger.error("Out of unqine items in collection " + stringId);
                return;
            }

            var index = random(0, items.length - 1)
            var unqineItem = items[index];
            deleteFromCollection(items, index);
            return unqineItem;

        } else
        {
            pickUnqineCollection[stringId] = collection;
            return pickUnqine(collection, stringId);
        }
    }


    export const pickRandomSound = (collection: string[]) =>
    {
        var sound: Sound = AssetManager.getSound(collection[random(0, collection.length - 1)]);

        if (!sound.play)
        {
            Logger.warn(" Somthing looks dogoy with the sound object " + sound);
        }

        return sound;
    }


    export const deleteFromCollection = (collection, indexToRemove) =>
    {
        delete collection[indexToRemove];
        collection.splice(indexToRemove, 1);
    }

    export const isBetweenRange = (value, rangeMax, rangeMin) =>
    {
        return value >= rangeMin && value <= rangeMax;
    }

    export const angleToVector = (angle: number) =>
    {
        return new b2Vec2(Math.cos(angle), Math.sin(angle));
    }

    export const vectorToAngle = (vector) =>
    {
        return Math.atan2(vector.y, vector.x);
    }

    export const toRadians = (angleInDegrees: number) =>
    {
        return angleInDegrees * (Math.PI / 180);
    }

    export const toDegrees = (angleInRdains: number) =>
    {
        return angleInRdains * (180 / Math.PI);
    }

    //export function isBetweenRangeTest()
    //{
    //    var t1 = isBetweenRange(3.3, 10, -10);
    //    var t2 = isBetweenRange(-2.3, 40, -3);
    //    var t3 = isBetweenRange(-25.3, 40, -3);

    //    if ( t1 == false || t2 == false || t3 == true)
    //    {
    //        Logger.error(" isBetweenRangeTestFailed ");
    //    } else
    //    {
    //        Logger.log("isBetweenTestPassed");
    //    }
    //};

    
    export const compress = (s) => {
		var dict = {};
	    var data = (s + "").split("");
	    var out = [];
	    var currChar;
	    var phrase = data[0];
	    var code = 256;
	    for (var i=1; i<data.length; i++) {
	        currChar=data[i];
	        if (dict[phrase + currChar] != null) {
	            phrase += currChar;
	        }
	        else {
	            out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
	            dict[phrase + currChar] = code;
	            code++;
	            phrase=currChar;
	        }
	    }
	    out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
	    for (var i=0; i<out.length; i++) {
	        out[i] = String.fromCharCode(out[i]);
	    }
	    return out.join("");
	}

    export const decompress = (s) =>
	{

	    var dict = {};
	    var data = (s + "").split("");
	    var currChar = data[0];
	    var oldPhrase = currChar;
	    var out = [currChar];
	    var code = 256;
	    var phrase;
	    for (var i = 1; i < data.length; i++)
	    {
	        var currCode = data[i].charCodeAt(0);
	        if (currCode < 256)
	        {
	            phrase = data[i];
	        }
	        else
	        {
	            phrase = dict[currCode] ? dict[currCode] : (oldPhrase + currChar);
	        }
	        out.push(phrase);
	        currChar = phrase.charAt(0);
	        dict[code] = oldPhrase + currChar;
	        code++;
	        oldPhrase = phrase;
	    }
	    return out.join("");

	}

    export const isNumber = (n) => {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

}

module Logger
{

    export const log = (message) =>
    {
        if (Settings.DEVELOPMENT_MODE || Settings.LOG)
            console.info(message);
    }

    export const warn = (message) =>
    {
        if (Settings.DEVELOPMENT_MODE || Settings.LOG)
         console.warn(message);
    }

    export const debug = (message) =>
    {
        if (Settings.DEVELOPMENT_MODE || Settings.LOG )
            console.log(message);
    }

    export const error = (message) =>
    {
        if (Settings.DEVELOPMENT_MODE || Settings.LOG)
            console.error(message);
    }
}

module keyboard
{

    export var keys = [];

    (function ()
    {

        $(window).keydown((e) =>
        {
            keys[e.which] = true;
        });

        $(window).keyup((e) =>
        {          
            delete keys[e.which];
        });

    })();


    export const isKeyDown = (keyCode, actLikeKeyPress = false) =>
    {
        for (var key in keys)
        {
            if (key == keyCode)
            {
                if (actLikeKeyPress)
                {
                    delete keys[key]
                }

                return true;
            }
        }

        return false;
    }

    export const getKeyName = (keycode: number) =>
    {
        for (var i in keyCodes)
        {
            if (keyCodes[i] == keycode)
            {
                return i;
            }
        }
    }

    export var keyCodes =  {
    'Backspace': 8,
    'Tab': 9,
    'Enter': 13,
    'Shift': 16,
    'Ctrl': 17,
    'Alt': 18,
    'Pause': 19,
    'Capslock': 20,
    'Esc': 27,
    'Pageup': 33,
        'Space': 32,
    'Pagedown': 34,
    'End': 35,
    'Home': 36,
    'Leftarrow': 37,
    'Uparrow': 38,
    'Rightarrow': 39,
    'Downarrow': 40,
    'Insert': 45,
    'Delete': 46,
    '0': 48,
    '1': 49,
    '2': 50,
    '3': 51,
    '4': 52,
    '5': 53,
    '6': 54,
    '7': 55,
    '8': 56,
    '9': 57,
    'a': 65,
    'b': 66,
    'c': 67,
    'd': 68,
    'e': 101,
    'f': 70,
    'g': 71,
    'h': 72,
    'i': 73,
    'j': 74,
    'k': 75,
    'l': 76,
    'm': 77,
    'n': 78,
    'o': 79,
    'p': 80,
    'q': 81,
    'r': 82,
    's': 83,
    't': 84,
    'u': 85,
    'v': 86,
    'w': 87,
    'x': 88,
    'y': 89,
    'z': 90,
    'numpad0': 96,
    'numpad1': 97,
    'numpad2': 98,
    'numpad3': 99,
    'numpad4': 100,
    'numpad6': 102,
    'numpad7': 103,
    'numpad8': 104,
    'numpad9': 105,
    'Multiply': 106,
    'Plus': 107,
    'Minut': 109,
    'Dot': 110,
    'Slash1': 111,
    'F1': 112,
    'F2': 113,
    'F3': 114,
    'F4': 115,
    'F5': 116,
    'F6': 117,
    'F7': 118,
    'F8': 119,
    'F9': 120,
    'F10': 121,
    'F11': 122,
    'F12': 123,
    'equal': 187,
    'Coma': 188,
    'Slash': 191,
    'Backslash': 220
    }


}
