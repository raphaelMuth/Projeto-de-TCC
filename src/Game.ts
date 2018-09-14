/**
 * Game.js
 * This is the main game object which controls gameloop and basically everything in the game
 *
 *  License: Apache 2.0
 *  author:  Ciarán McCann
 *  url: http://www.ciaranmccann.me/
 */
///<reference path="system/Camera.ts"/>
///<reference path="system/Graphics.ts"/>
///<reference path="system/AssetManager.ts"/>
///<reference path="system/Physics.ts"/>
///<reference path="environment/Terrain.ts"/>
///<reference path="Worm.ts"/>
///<reference path="system/Utilies.ts"/>
///<reference path="gui/WeaponsMenu.ts" />
///<reference path="Player.ts" />
///<reference path="system/Timer.ts" />
///<reference path="Settings.ts" />
///<reference path="gui/CountDownTimer.ts" />
///<reference path="animation/SpriteDefinitions.ts" />
///<reference path="animation/ParticleEffect.ts"/>
///<reference path="animation/EffectsManager.ts"/>
///<reference path="gui/HealthMenu.ts"/>
///<reference path="environment/Maps.ts"/>
///<reference path="GameStateManager.ts"/>
///<reference path="WormManager.ts"/>
///<reference path="Tutorial.ts"/>

class Game
{
    actionCanvas;
    actionCanvasContext;

    terrain: Terrain;
    players: Player[];
    
    weaponMenu: WeaponsMenu;
    healthMenu: HealthMenu;
    gameTimer: CountDownTimer;

    wormManager: WormManager;
    state: GameStateManager;

    particleEffectMgmt: EffectsManager;

    //Manages arrows and generate indicators
    miscellaneousEffects: EffectsManager;

    //Manages things like the clouds
    enviormentEffects: EffectsManager;
    
    winner: Player;

    static map: GameMap = new GameMap(Maps.castle);

    camera: Camera;

    //Using in dev mode to collect spawn positions
    spawns;

    tutorial: Tutorial;

    sticks;


    constructor()
    {
        Graphics.init();

        //Create action canvas
        this.actionCanvas = Graphics.createCanvas("action");
        this.actionCanvasContext = this.actionCanvas.getContext("2d");

        this.sticks = new TwinStickControls(this.actionCanvas);

        this.setupCanvas();

        this.addCanvasListeners();

        Physics.init(this.actionCanvasContext);

        // Manages the state of the game, the player turns etc.
        this.state = new GameStateManager();

        this.players = []; //TODO Make this work as a c-style array(4)

        // Development stuff
        this.spawns = [];
        this.defineSpawnsForDevMode();
    }

    defineSpawnsForDevMode() {
        if (Settings.DEVELOPMENT_MODE &&
            this.particleEffectMgmt != null) {

            window.addEventListener("click", (evt: any) => {
                var particles = new ParticleEffect(this.camera.getX() + evt.pageX, this.camera.getY() + evt.pageY);
                this.particleEffectMgmt.add(particles);

                var box2dVector = new b2Vec2(this.camera.getX() + evt.pageX, this.camera.getY() + evt.pageY);
                this.spawns.push(box2dVector);

                Logger.log(JSON.stringify(this.spawns));

            }, false);
        }
    }

    addCanvasListeners() {
        //If the window gets resize, resize the canvas
        $(window).resize(() => this.setupCanvas());

        //If we go full screen also resize
        document.addEventListener("fullscreenchange", () => this.setupCanvas(), false);

        document.addEventListener("mozfullscreenchange", () => this.setupCanvas(), false);

        document.addEventListener("webkitfullscreenchange", () => this.setupCanvas(), false);
    }

    getGameNetData()
    {
        return new GameDataPacket(this);
    }

    setGameNetData(data)
    {
        var gameDataPacket: GameDataPacket = Utilies.copy(new GameDataPacket(this), data);
        gameDataPacket.override(this);
    }

    setupCanvas()
    {
        //Set canvas font stuff
        this.actionCanvas.width = $(window).width();
        this.actionCanvas.height = $(window).height();
        this.actionCanvasContext.font = 'bold 16px Sans-Serif';
        this.actionCanvasContext.textAlign = 'center';
        this.actionCanvasContext.fillStyle = "#384084"; // Water
    };

    goFullScreen()
    {
        
    }

    start(playerIds = null)
    {
        this.terrain = new Terrain(this.actionCanvas, Game.map.getTerrainImg(), Physics.world, Physics.worldScale);
        this.camera = new Camera(this.terrain.getWidth(), this.terrain.getHeight(), this.actionCanvas.width, this.actionCanvas.height);
        this.camera.setX(this.terrain.getWidth() / 2);
        this.camera.setY(this.terrain.getHeight() / 2);
        
        this.createPlayers();
        
        this.state.init(this.players);

        // Allows for a easily accissble way of asking questions of all worms regardless of team
        this.wormManager = new WormManager(this.players);

        // Initalizes UI elements
        this.weaponMenu = new WeaponsMenu();
        this.healthMenu = new HealthMenu(this.players);
        this.gameTimer = new CountDownTimer();

        // Initalizse the various animations/effect managers
        this.particleEffectMgmt = new EffectsManager();
        this.miscellaneousEffects = new EffectsManager();
        this.enviormentEffects = new EffectsManager();

        //Add some random clouds to the enviorment
        this.createClouds();

        this.healthMenu.show();
        this.gameTimer.show();
        this.weaponMenu.show();
        
        //Diable certain keys
        this.setKeyDisableListeners(keyboard.keyCodes.Backspace);
        
        setTimeout(() =>
        {
            this.state.physicsWorldSettled = true;

        }, 1200);

        this.nextTurn();

    }

    setKeyDisableListeners(...args: number[]) {
        $(document).keydown((e) => {
            if (args.indexOf(e.keyCode) != -1) {
                e.preventDefault();
            }
        });
    }

    createClouds(qtd = 15) {
        for (var i = 0; i < qtd; i++) {
            this.enviormentEffects.add(new Cloud());
        }
    }

    // This method allows for quick use of the instruction chain
    // mechanisim over the network to call nextPlayer.
    nextTurn()
    {
        var id = this.state.nextPlayer();

        // If the id is -1 then the next player is dead
        if (id == null)
        {
            this.nextTurn()
        }
        else
        {
            this.gameTimer.timer.reset();
            AssetManager.getSound("yessir").play();

            if (this.tutorial == null)
            {
                Notify.display("Time's a ticking", "Its your go " + this.state.getCurrentPlayer().getTeam().name, 9000);
            } else if (this.tutorial == null)
            {
                //Quick hack sprint 4 demo in a few hours - All clients are give bouncing arrows over their worms
                // so want to remove all arrows from clients whos go it current isn't
                GameInstance.miscellaneousEffects.stopAll();

                Notify.display(this.state.getCurrentPlayer().getTeam().name + "'s turn", "Sit back relax and enjoy the show", 9000, Notify.levels.warn);
            }
        }

    }

    update()
    {
        if (this.state.isStarted)
        {
            // while no winner, check for one
            if (this.winner == null)
            {
                this.winner = this.state.checkForWinner();

                if (this.winner)
                {
                    this.gameTimer.timer.pause();
                    var team = this.winner.getTeam();
                    team.celebrate();
                    Notify.display("Congratualions", team.name + " you are the winner", 9000);
                }
            }

            // When ready to go to the next player and while no winner
            if (this.state.readyForNextTurn() && this.winner == null)
            {
                this.nextTurn();
            }

            if (this.tutorial != null)
                this.tutorial.update();

            for (var i = this.players.length - 1; i >= 0; --i)
                this.players[i].update();

            this.terrain.update();
            this.camera.update();
            this.particleEffectMgmt.update();
            this.miscellaneousEffects.update();
            this.enviormentEffects.update();
            this.gameTimer.update();
            
            GameInstance.sticks.update();
            
        }
    }

    step()
    {
        if (this.state.isStarted)
        {
            Physics.world.Step(
                  (1 / 60)
                   , 10       //velocity iterations
                   , 10       //position iterations
            );

        }
        //Physics.world.ClearForces();
    }

    draw()
    {
        this.actionCanvasContext.clearRect(0, 0, this.actionCanvas.width, this.actionCanvas.height);

        this.actionCanvasContext.save();
        this.actionCanvasContext.translate(-this.camera.getX(), -this.camera.getY());
        this.enviormentEffects.draw(this.actionCanvasContext);
        this.terrain.wave.drawBackgroundWaves(this.actionCanvasContext, 0, this.terrain.bufferCanvas.height, this.terrain.getWidth());
        this.actionCanvasContext.restore();

        this.terrain.draw(this.actionCanvasContext);

        this.actionCanvasContext.save();
        this.actionCanvasContext.translate(-this.camera.getX(), -this.camera.getY());

        this.terrain.wave.draw(this.actionCanvasContext, this.camera.getX(), this.terrain.bufferCanvas.height, this.terrain.getWidth());

        if (Settings.PHYSICS_DEBUG_MODE)
        {
            Physics.world.DrawDebugData();
        }
        
        for (var i = this.players.length - 1; i >= 0; --i)
        {
            this.players[i].draw(this.actionCanvasContext);
        }

        this.miscellaneousEffects.draw(this.actionCanvasContext);
        this.particleEffectMgmt.draw(this.actionCanvasContext);


        this.actionCanvasContext.restore();
        
        GameInstance.sticks.draw(this.actionCanvasContext);
    }

    createPlayers() {
        for (var i = 0; i < 2; i++) 
            this.players.push(new Player());
    }
}


class GameDataPacket
{
    players: PlayerDataPacket[];

    constructor(game: Game, physics = Physics)
    {
        this.players = [];
        game.players.forEach(player =>
            this.players.push(new PlayerDataPacket(player)))
    }

    override(game: Game, physics = Physics)
    {
        for (var p in this.players)
        {
            this.players[p].override(game.players[p]);
        }

    }
}