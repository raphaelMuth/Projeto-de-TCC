/**
 * This is the main game object which controls gameloop and basically everything in the game
 *
 */
///<reference path="system/Camera.ts"/>
///<reference path="system/Graphics.ts"/>
///<reference path="system/AssetManager.ts"/>
///<reference path="system/Physics.ts"/>
///<reference path="Helpers/WormActions.ts"/>
///<reference path="environment/Terrain.ts"/>
///<reference path="Worm.ts"/>
///<reference path="system/Utilies.ts"/>
///<reference path="system/AIUtilities.ts"/>
///<reference path="gui/WeaponsMenu.ts" />
///<reference path="players/Player.ts" />
///<reference path="players/AIPlayer.ts" />
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
    grid: Grid;
    worldBorderHeight = 2290;
    worldBorderWidth = 7475;
    worldBorderInitX = 11;
    worldBorderInitY = 3;
    clickedPos = { x: 0, y: 0 };

    actionCanvas: HTMLCanvasElement;
    actionCanvasContext: CanvasRenderingContext2D;

    terrain: Terrain;
    players: APlayer[];
    
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

    static map: GameMap = new GameMap(Maps.recta);

    camera: Camera;

    //Using in dev mode to collect spawn positions
    spawns;

    tutorial: Tutorial;
    
    constructor()
    {
        Graphics.init();

        //Create action canvas
        this.actionCanvas = Graphics.createCanvas("action");
        this.actionCanvasContext = this.actionCanvas.getContext("2d");

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

    setClickedPos(x: number, y: number) {
        this.clickedPos.x = x;
        this.clickedPos.y = y;
        this.grid.mouseClicked = { x: this.clickedPos.x, y: this.clickedPos.y };
    }

    addCanvasListeners() {

        this.actionCanvas.addEventListener('click', (evt) => {
            var x = this.camera.getX() + evt.clientX;
            var y = this.camera.getY() + evt.clientY;
            this.setClickedPos(x, y);
            console.log("clickedPos pixels x:", this.clickedPos.x, "y:", this.clickedPos.y, "; meters x:", Physics.pixelToMeters(this.clickedPos.x), "y:", Physics.pixelToMeters(this.clickedPos.y));
        }, false);

        //this.actionCanvas.addEventListener('mousemove', (evt) => {
        //    this.camera.levelHeight;
        //    var rect = this.actionCanvas.getBoundingClientRect();
        //    var mousePos =  {
        //        x: evt.clientX - rect.left,
        //        y: evt.clientY - rect.top
        //    };
            
        //    var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
        //    console.log(message)
        //}, false);


        //if (Settings.LOG == true) {
        //    this.actionCanvas.addEventListener('click', event => {

        //        console.log(event, "event");
        //        let bound = this.actionCanvas.getBoundingClientRect();
        //        var worm = Physics.vectorMetersToPixels(Physics.fastAcessList[0].GetPosition());
        //        console.log(event.clientX, "event.clientX", event.clientY, "event.clientY");
        //        console.log("this.terrain.Offset.x", this.terrain.Offset.x, "this.terrain.Offset.y", this.terrain.Offset.y);
        //        console.log("this.camera.position.x", this.camera.position.x, "this.camera.position.y", this.camera.position.y);
        //        console.log("worm.x", worm.x, "worm.y", worm.y);

        //        console.log("offseted y", this.terrain.Offset.x + event.clientX, "offseted y", this.terrain.Offset.y + event.clientY )
                
        //    });
        //}

        //If the window gets resize, resize the canvas
        $(window).resize(() => this.setupCanvas());

        //If we go full screen also resize
        document.addEventListener("fullscreenchange", () => this.setupCanvas(), false);

        document.addEventListener("mozfullscreenchange", () => this.setupCanvas(), false);

        document.addEventListener("webkitfullscreenchange", () => this.setupCanvas(), false);
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
        this.grid = new Grid((this.terrain.terrainImage.width * 1.5), (this.terrain.terrainImage.height * 1.5 ), this.terrain.Offset.x, this.terrain.Offset.y);

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

        this.drawLines(this.actionCanvasContext);
        //this.drawCamera(this.actionCanvasContext);
        //this.drawBorder(this.actionCanvasContext);
        this.grid.draw(this.actionCanvasContext);
        //this.drawOffset(this.actionCanvasContext);

        //this.terrain.wave.drawBackgroundWaves(this.actionCanvasContext, 0, this.terrain.bufferCanvas.height, this.terrain.getWidth());
        this.actionCanvasContext.restore();

        this.terrain.draw(this.actionCanvasContext);

        this.actionCanvasContext.save();
        this.actionCanvasContext.translate(-this.camera.getX(), -this.camera.getY());

        //this.terrain.wave.draw(this.actionCanvasContext, this.camera.getX(), this.terrain.bufferCanvas.height, this.terrain.getWidth());

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
        
    }

    createPlayers() {
        //this.players.push(new Player());
        //this.players.push(new AIPlayer());
        for (var i = 0; i < 2; i++) 
            this.players.push(new Player());
    }


    drawLines(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();

        ctx.moveTo(0, this.clickedPos.y);
        ctx.lineTo(this.clickedPos.x, this.clickedPos.y);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(this.clickedPos.x, 0);
        ctx.lineTo(this.clickedPos.x, this.clickedPos.y);
        ctx.stroke();

    }

    drawBorder(ctx: CanvasRenderingContext2D) {
        ctx.strokeStyle = "yellow";
        ctx.rect(this.worldBorderInitX, this.worldBorderInitY, this.worldBorderWidth, this.worldBorderHeight);
        ctx.stroke();
    }

    drawCamera(ctx: CanvasRenderingContext2D) {
        ctx.strokeStyle = "white";
        ctx.rect(this.camera.getX(), this.camera.getY(), 10, 10);
        ctx.stroke();
    }

    drawOffset(ctx: CanvasRenderingContext2D) {
        ctx.strokeStyle = "yellow";
        ctx.strokeRect(this.terrain.Offset.x, this.terrain.Offset.y, (this.worldBorderWidth - this.terrain.Offset.x), (this.worldBorderHeight - this.terrain.Offset.y));
    }
    
}