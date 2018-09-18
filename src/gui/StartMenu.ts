/**
 * This is the first menu the user interacts with
 * allows them to start the game and shows them the controls.
 *
 */
///<reference path="../Settings.ts" />
///<reference path="../system/Controls.ts"/>
///<reference path="SettingsMenu.ts"/>
declare var $;

class StartMenu
{

    controlsView;
    settingsMenu: SettingsMenu;
    static callback;

    constructor()
    {
        //<img style="width:80%" src="data/images/menu/xbox360controls.png"><h2>Or</h2>
        this.controlsView = '<div style="text-align:center">' +
            ' <p>Just incase you have never played the original worms armageddon, its a turn base deathmatch game. Where you control a team of worms. Use whatever weapons you have to destroy the enemy. <p><br>' +
            '<p><kbd> Space' +
            '</kbd>  <kbd> ' + String.fromCharCode(Controls.walkLeft.keyboard) +
            '</kbd> <kbd> ' + String.fromCharCode(Controls.walkRight.keyboard) +
            '</kbd> - Jump, Left, Right. <br> <br>' +
             ' <kbd>' + String.fromCharCode(Controls.aimUp.keyboard) + '</kbd> ' +
             ' <kbd>' + String.fromCharCode(Controls.aimDown.keyboard) + '</kbd> ' +
             ' - Aim up and down. </p><br>' +
            ' <kbd>' + String.fromCharCode(Controls.toggleWeaponMenu.keyboard) + '</kbd> or right mouse - Weapon Menu. </p><br>' +
            ' <kbd>Enter</kbd> - Fire weapon. </p><p></p><br>' +
            '<a class="btn btn-primary btn-large" id="startLocal" style="text-align:center">Lets play!</a></div>';
    }

    hide()
    {
        $('#startMenu').remove();
    }
    
    onGameReady(callback)
    {
        StartMenu.callback = callback;
        if (!Settings.DEVELOPMENT_MODE)
        {
            this.setLoadingInterval();
            $('#startLocal').click(() => this.startLocalGame(callback));
            $('#startTutorial').click(() => this.startTutorialGame(callback));

            $('#firstScreen').click(() => { });
            $('#nextFase').click(() => { });
        } else
        {
            this.setLoadingIntervalForDevelopmentMode(callback);
        }
    }

    setLoadingIntervalForDevelopmentMode(callback: any) {
        var loading = setInterval(() => {
            if (AssetManager.getPerAssetsLoaded() == 100) {
                clearInterval(loading);
                callback();
            }
        }, 2)
    }

    setLoadingInterval() {
        var loading = setInterval(() => {

            $('#notice').empty();
            if (AssetManager.getPerAssetsLoaded() >= 100) {
                clearInterval(loading);
                this.settingsMenu = new SettingsMenu();
                $('#startLocal').removeAttr("disabled");

                $('#startTutorial').removeAttr("disabled");
                
                if ($.browser.msie) {
                    this.informInternetExplorerProblems();
                }
                else {
                    this.informAssetsLoaded();
                }

            } else {
                this.informAssetsAreBeingLoaded();
            }

        }, 500);
    }

    startTutorialGame(callback: any) {
        if (AssetManager.isReady()) {

            $('#startTutorial').off('click');
            AssetManager.getSound("CursorSelect").play();

            //Initalizse the tutorial object so its used in the game
            GameInstance.tutorial = new Tutorial();

            this.changeToControlsMenu(callback);
        }
    }
    
    startLocalGame(callback: any) {
        if (AssetManager.isReady()) {

            $('#startLocal').unbind();
            AssetManager.getSound("CursorSelect").play();

            this.setMapMenu(callback);
        }
    }

    changeToControlsMenu(callback)
    {
        $('.slide').fadeOut('normal', () => {

            this.cleanAndFadeSlideDiv();

            $('#startLocal').click(() =>
            {
                $('#startLocal').unbind();
                $('#startMenu').fadeOut('normal');

                AssetManager.getSound("CursorSelect").play();
                AssetManager.getSound("StartRound").play(1, 0.5);
                callback();
            })
        });
    }


    informAssetsAreBeingLoaded(): any {
        $('#notice').append('<div class="alert alert-info" style="text-align:center"> <strong> Stand back! I\'m loading game assets! </strong>' +
            '<div class="progress progress-striped active"><div class="bar" style="width: ' + AssetManager.getPerAssetsLoaded() + '%;"></div></div></div> ');
    }

    informAssetsLoaded(): any {
        $('#notice').append('<div class="alert alert-success" style="text-align:center"> <strong> Games loaded and your ready to play!! </strong> ');
    }

    informInternetExplorerProblems(): any {
        $('#notice').append('<div class="alert alert-error" style="text-align:center">' +
            '<strong>Bad news :( </strong> Your using Internet explorer, the game preformance will be hurt. For best preformance use ' +
            '<a href="https://www.google.com/intl/en/chrome/browser/">Chrome</a> or <a href="http://www.mozilla.org/en-US/firefox/new/">FireFox</a>. </div> ');
    }
    
    setMapMenu(callback: any): any {
        $('.slide').empty();
        $('.slide').append(this.settingsMenu.getView());
        
        this.settingsMenu.bind(() => {
            AssetManager.getSound("CursorSelect").play();
            this.changeToControlsMenu(callback);
        });
    }

    cleanAndFadeSlideDiv(): any {
        $('.slide').empty();
        $('.slide').append(this.controlsView);
        $('.slide').fadeIn('slow');
    }
}