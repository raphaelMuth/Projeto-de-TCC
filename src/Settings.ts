///<reference path="system/Utilies.ts" />

module Settings
{

    //Game vars
    export var PLAYER_TURN_TIME = 45 * 1000; // 60 secounds
    export var TURN_TIME_WARING = 5; // after 10 secounds warn player they are running out of time
   
    //General game settings
    export var SOUND = false;
    
    // development vars
    export var DEVELOPMENT_MODE = false; 
    export var LOG = true;
    
    export var PAUSED = false;
    export const PauseGame = (value = true) => {
        Settings.PAUSED = value;
        //if (value)
        //    setTimeout(() => Settings.PAUSED = value, 1000);
        //else
        //    Settings.PAUSED = value;
    };
    
    export var REMOTE_ASSERT_SERVER = "../";

    export var PHYSICS_DEBUG_MODE = false;
    export var RUN_UNIT_TEST_ONLY = !true;
    
    //Pasers commandline type arguments from the page url like this ?argName=value
    export const getSettingsFromUrl = () =>
    {
        var argv = getUrlVars();
        var commands = ["physicsDebugDraw","devMode","unitTest","sound"]

        if (argv[commands[0]] == "true")
        {
            PHYSICS_DEBUG_MODE = true;
        }

        if (argv[commands[1]] == "true")
        {
            DEVELOPMENT_MODE = true;
        }

        if (argv[commands[2]] == "true")
        {
           var testWindow = window.open('test.html', '|UnitTests', 'height=1000,width=700,top:100%');
           testWindow.location.reload();
            
        }

        if (argv[commands[3]] == "false")
        {
            SOUND = false;
        }

        Logger.log(" Notice: argv are as follows " + commands);
    }

    export const getUrlVars = () => {
        var vars = {};
        var localVars = new URL(window.location.href).search.substring(1).split('&');
        localVars.forEach(pair => { vars[pair.split('=')[0]] = pair.split('=')[1] })
        return vars;
    }
}