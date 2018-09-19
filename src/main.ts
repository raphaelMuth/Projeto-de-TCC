
///<reference path="Game.ts"/>
///<reference path="system/Graphics.ts"/>
///<reference path="gui/StartMenu.ts" />
///<reference path="gui/DrawStartMenu.ts" />
var GameInstance: Game;
$(document).ready( () => {

    Settings.getSettingsFromUrl();
    Settings.PauseGame(false);

    if (!Settings.RUN_UNIT_TEST_ONLY)
    {
        DrawStartMenu.initMainScreen();

        var startMenu = new StartMenu();

        GameInstance = new Game();
        AssetManager.loadAssets();

        startMenu.onGameReady(() => { Main.afterInit() });
    }

});

module Main {

    export const afterInit = () => {
        Settings.PauseGame(false);
        DrawStartMenu.removeStartMenu();
        if (GameInstance.state.isStarted == false) {
            GameInstance.start();
        }

        Main.gameloop();
    }

    export const gameloop = () => {

        if (Settings.DEVELOPMENT_MODE)
            Graphics.stats.update();

        if (!Settings.PAUSED) { //deveria continuar desenhando so nao dando update, kd a modal nesta caralha
            GameInstance.step();
            GameInstance.update();
            GameInstance.draw();
        }

        window.requestAnimationFrame(gameloop);
    }
}