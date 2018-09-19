
///<reference path="Game.ts"/>
///<reference path="system/Graphics.ts"/>
///<reference path="gui/StartMenu.ts" />
///<reference path="gui/DrawScreens.ts" />
var GameInstance: Game;
$(document).ready( () => {

    Settings.getSettingsFromUrl();

    if (!Settings.RUN_UNIT_TEST_ONLY)
    {
        DrawStartMenu.initMainScreen();

        var startMenu = new StartMenu();

        GameInstance = new Game();
        AssetManager.loadAssets();
        
        startMenu.onGameReady(() =>
        {
            DrawStartMenu.removeStartMenu();
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