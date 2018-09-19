/**
 * This is the first menu the user interacts with
 * allows them to start the game and shows them the controls.
 *
 */
///<reference path="../Settings.ts" />
///<reference path="../system/Controls.ts"/>
///<reference path="../system/Constants.ts"/>
///<reference path="SettingsMenu.ts"/>
///<reference path="DrawStartMenu.ts" />
declare var $;

class StartMenu
{
    settingsMenu: SettingsMenu;
    static callback;

    constructor()
    {
    }
    
    // mode intervals
    setLoadingIntervalForDevelopmentMode() {
        var loading = setInterval(() => {
            if (AssetManager.isReady()) {
                clearInterval(loading);
                StartMenu.callback();
            }
        }, 2)
    }

    setLoadingInterval() {
        var loading = setInterval(() => {
            $('#notice').empty();
            if (AssetManager.isReady()) {
                clearInterval(loading);

                this.settingsMenu = new SettingsMenu();
                this.setStartMenuButtons();
                this.setModalButtons();
                this.enableStartMenuButtons();

                if ($.browser.msie) DrawStartMenu.informInternetExplorerProblems();
                else DrawStartMenu.informAssetsLoaded();
            } else DrawStartMenu.informAssetsAreBeingLoaded();

        }, 500);
    }

    // game initialization
    onGameReady(callback)
    {
        StartMenu.callback = callback;
        if (!Settings.DEVELOPMENT_MODE)
            this.setLoadingInterval();
         else
            this.setLoadingIntervalForDevelopmentMode();
    }
    
    playAndStart(tutorial: Tutorial = null) {
        AssetManager.getSound("CursorSelect").play();
        this.startGame(tutorial);
    }

    startGame(tutorial: Tutorial = null) {

        if (tutorial) {
            GameInstance.tutorial = tutorial;
            this.changeToControlsMenu();
        } else {
            this.setMapMenu();
        }
    }

    // screen flows
    setMapMenu() {
        DrawStartMenu.refreshSlideDiv(this.settingsMenu.getView())
        this.settingsMenu.instantiateSelectedMap(() => this.changeToControlsMenu() );
    }

    changeToControlsMenu() {
        $(Constants.CSS_CLASS_SLIDE).fadeOut('normal', () => {
            DrawStartMenu.refreshSlideDiv(DrawStartMenu.controlsView);
            this.setLetsPlayButton();
        });
    }
    
    // buttons
    setLetsPlayButton() {
        $(Constants.CSS_ID_LETS_PLAY).click(() => {
            AssetManager.getSound("CursorSelect").play();
            AssetManager.getSound("StartRound").play(1, 0.5);
            StartMenu.callback();
        })
    }

    enableStartMenuButtons() {
        $(Constants.CSS_ID_START_LOCAL).removeAttr("disabled");
        $(Constants.CSS_ID_START_TUTORIAL).removeAttr("disabled");
    }

    setStartMenuButtons() {
        $(Constants.CSS_ID_START_LOCAL).click(() => this.playAndStart());
        $(Constants.CSS_ID_START_TUTORIAL).click(() => this.playAndStart(new Tutorial()));
    }

    setModalButtons() {
        $(Constants.CSS_ID_FIRST_SCREEN).click(() => this.resetScreen());
        $(Constants.CSS_ID_NEXT_PHASE).click(() => { });
    }

    resetScreen() {
        Notify.cleanHide();
    }

    unsetModalButtons() {
        $(Constants.CSS_ID_FIRST_SCREEN).unbind();
        $(Constants.CSS_ID_NEXT_PHASE).unbind();
    }
}

/* TODO
 * 1 - Fazer a index ser desenhada em runtime inclui modal e tela inicial, #####OK
 * 2 - Fazer toda a tela ser removida (canvas e modal), #####incompleto
 * 2.5 - Pausar o jogo
 * 3 - Assegurar que os dados do ultimo jogo foram limpados
 * 4 - Passar metodo (restart game) para botao tela inicial da modal que ira aparecer no momento que finalizar o tutorial (no tutorial nao tera proxima fase),
 * 5 - Passar metodo (restart game) para botao tela inicial da modal que ira aparecer no momento que ganhar um jogo (tera o botão proxima fase),
 * 6 - Ao clicar no botão proxima fase (next phase) iniciar um novo jogo local onde os dados serão zerados como no item 3 porem nao ira para a tela inicial (primeiro passo)
 * ??? pensar sobre ia, pensar sobre rede neural, pensar sobre player modelling, 
 */