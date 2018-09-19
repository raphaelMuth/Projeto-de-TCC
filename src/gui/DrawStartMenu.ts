
///<reference path="../system/Constants.ts"/>
class DrawStartMenu {

    constructor() { };

    static controlsView = `<div style="text-align:center">
                        <p>Just incase you have never played the original worms armageddon, its a turn base deathmatch game. Where you control a team of worms. Use whatever weapons you have to destroy the enemy. <p><br>
                        <p><kbd> Space </kbd> 
                        <kbd> ${String.fromCharCode(Controls.walkLeft.keyboard)} </kbd>  
                        <kbd> ${String.fromCharCode(Controls.walkRight.keyboard)} </kbd> 
                         - Jump, Left, Right. <br> <br>
                         <kbd> ${String.fromCharCode(Controls.aimUp.keyboard)}</kbd>
                         <kbd> ${String.fromCharCode(Controls.aimDown.keyboard)}</kbd>
                         - Aim up and down. </p><br>
                         <kbd> ${String.fromCharCode(Controls.toggleWeaponMenu.keyboard)} </kbd> or right mouse - Weapon Menu. </p><br>
                         <kbd>Enter</kbd> - Fire weapon. </p><p></p><br>
                        <a class="btn btn-primary btn-large" id="letsPlay" style="text-align:center">Lets play!</a></div>`;

    //main screen
    static initMainScreen() {
        DrawStartMenu.drawStartMenu();
        DrawStartMenu.drawModalMenu();
    }

    static drawStartMenu() {
        var html = `<div class="hero-unit" id="startMenu">
                        <div class="slide">
                            <h1 style="text-align: center">Worms Armageddon HTML5 Clone</h1>
                            <br />
                            <p>
                                Este é um projeto de tcc para criar uma ia adaptativa
                            </p>
                            <br />

                            <p style="text-align: center">
                                <a class="btn btn-primary btn-large" id="startTutorial" disabled="disabled">Noobs tutorial</a>
                                <a class="btn btn-primary btn-large" id="startLocal" disabled="disabled">Local two player</a>
                            </p>
                            <div id="notice" style="font-size: 14px"></div>
                        </div>
                    </div>`;

        $(Constants.CSS_ID_START_MENU_HOLDER).append(html);
    }

    static removeStartMenu() {
        $(Constants.CSS_ID_START_MENU).fadeOut('normal', () => $(Constants.CSS_ID_START_MENU).remove());
    }
    
    static drawModalMenu() {

        var html = `<div class="modal fade" id="modalMenu">
                        <div class="modal-header">
                            <a class="close" data-dismiss="modal">&times;</a>
                            <h3>Tela de Seleção</h3>
                        </div>
                        <div class="modal-body">
                            <a href="#" class="btn btn-secondary" data-dismiss="modal" id="firstScreen">Tela inicial</a>
                            <a href="#" class="btn btn-primary" data-dismiss="modal" id="nextPhase">Proxima fase</a>
                        </div>
                    </div>`;

        $(Constants.CSS_ID_MODAL_MENU_HOLDER).append(html);
    }

    // start menu elements
    static refreshSlideDiv(append) {
        $(Constants.CSS_CLASS_SLIDE).empty();
        $(Constants.CSS_CLASS_SLIDE).append(append);
        $(Constants.CSS_CLASS_SLIDE).fadeIn('slow');
    }

    //notify
    static informAssetsAreBeingLoaded() {
        var html = `<div class="alert alert-info" style="text-align:center"> <strong> Stand back! I\'m loading game assets! </strong>
                    <div class="progress progress-striped active"><div class="bar" style="width: ${AssetManager.getPerAssetsLoaded()}%;"></div></div></div> `;

        $(Constants.CSS_ID_NOTICE).append(html);
    }

    static informAssetsLoaded() {
        var html = '<div class="alert alert-success" style="text-align:center"> <strong> Games loaded and your ready to play!! </strong> ';
        
        $(Constants.CSS_ID_NOTICE).append(html);
    }
    
    static informInternetExplorerProblems() {
        var html = '<div class="alert alert-error" style="text-align:center">' +
            '<strong>Bad news :( </strong> Your using Internet explorer, the game preformance will be hurt. For best preformance use ' +
            '<a href="https://www.google.com/intl/en/chrome/browser/">Chrome</a> or <a href="http://www.mozilla.org/en-US/firefox/new/">FireFox</a>. </div> '

        $(Constants.CSS_ID_NOTICE).append(html);
    }
}