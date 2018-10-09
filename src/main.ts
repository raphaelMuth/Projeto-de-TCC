
///<reference path="Game.ts"/>
///<reference path="system/Graphics.ts"/>
///<reference path="gui/StartMenu.ts" />

var GameInstance: Game;
var ngraph: any;
var CreateGraph: any;
var GraphPath: any;


$(document).ready(() => {

    console.log(ngraph);
    console.log(ngraph.graph());


    Settings.getSettingsFromUrl();

    if (!Settings.RUN_UNIT_TEST_ONLY)
    {
        var startMenu = new StartMenu();

        GameInstance = new Game();
        AssetManager.loadAssets();
        
        startMenu.onGameReady(() =>
        {
            startMenu.hide();
            if (GameInstance.state.isStarted == false)
            {
                GameInstance.start();
            }

            function gameloop()
            {
               if(Settings.DEVELOPMENT_MODE)
                Graphics.stats.update();

                GameInstance.step();
                GameInstance.update();
                GameInstance.draw();
                window.requestAnimationFrame(gameloop);
            }
            gameloop();

        });
    }

});