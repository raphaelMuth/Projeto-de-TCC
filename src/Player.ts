/**
 * The player class contains a team objects, which is the team of worms. 
 * It also defines the controls for the worms movements.
 *
 */
///<reference path="Team.ts"/>
///<reference path="system/Utilies.ts"/>
///<reference path="system/Timer.ts"/>
///<reference path="system/GamePad.ts"/>
///<reference path="system/Controls.ts"/>

class Player
{
    private team: Team;
    id: string;
    timer: Timer;
    gamePad: GamePad;

    constructor(playerId = Utilies.pickUnqine([1, 2, 3, 4], "playerids"))
    {
        this.id = playerId;
        this.team = new Team(playerId);

        // Global window keyup event
        $(window).keyup((e) => this.FireOnKeyUp(e) );

        this.timer = new Timer(10);
        this.gamePad = new GamePad();
    }
        

    getTeam()
    {
        return this.team;
    }

    weaponFireOrCharge()
    {
        var wormWeapon = this.team.getCurrentWorm().getWeapon()
        //If this weapons use a force, then we charge the force.
        if (wormWeapon.getForceIndicator().isRequired() && wormWeapon.getIsActive() == false)
        {

            // The charge returns true if the charge has reached maxium
            if (wormWeapon.ammo > 0 && this.team.getCurrentWorm().getWeapon().getForceIndicator().charge(3))
            {
                this.team.getCurrentWorm().fire();
                GameInstance.weaponMenu.refresh();

            } else if(wormWeapon.ammo <= 0)
            {
                Notify.display("Out of Ammo", "No more ammo left in your " + wormWeapon.name + " Select a new weapon ",5000);
                AssetManager.getSound("cantclickhere").play();
            }
        }
        else
        {
            this.team.getCurrentWorm().fire();
            GameInstance.weaponMenu.refresh();
        }

    }
    
    update()
    {
        this.timer.update();

        this.gamePad.connect();
        this.gamePad.update();
        
        if (GameInstance.state.getCurrentPlayer() == this && GameInstance.state.hasNextTurnBeenTiggered() == false)
        {
            if (this.HasJumped())
            {
                this.team.getCurrentWorm().jump();
            }

            if (this.HasBackfliped())
            {
                this.team.getCurrentWorm().backFlip();
            }

            if (this.HasWalkedLeft())
            {
                this.team.getCurrentWorm().walkLeft();
            }

            if (this.HasWalkedRight())
            {
                this.team.getCurrentWorm().walkRight();
            }

            if (this.HasAimedUp())
            {
                var currentWrom = this.team.getCurrentWorm();
                currentWrom.target.aim(-0.8);
            }

            if (this.HasAimedDown())
            {
                var currentWrom = this.team.getCurrentWorm();
                currentWrom.target.aim(0.8);           
            }

            // While holding the
            if (this.HasFired())
            {
                this.weaponFireOrCharge();
            }
            // end of player controls
        }
        
         //Finds the worm traveling at the highest velocity and if its over a therosold
         // the camera will then pan to the position of that worm. 
         // So when their is an explosion it gives the player somthing interesting and fun to look at

        var fastestWorm = GameInstance.wormManager.findFastestMovingWorm();
        if (this.MayCameraFollowFastestWorm(fastestWorm))
         {
                GameInstance.camera.panToPosition(Physics.vectorMetersToPixels(fastestWorm.body.GetPosition()));
         }

        if (GameInstance.state.hasNextTurnBeenTiggered() == false)
        {

            if (keyboard.isKeyDown(38)) //up
            {
                GameInstance.camera.cancelPan();
                GameInstance.camera.incrementY(-15)
            }

            if (keyboard.isKeyDown(40)) //down
            {
                GameInstance.camera.cancelPan();
                GameInstance.camera.incrementY(15)
            }


            if (keyboard.isKeyDown(37)) //left
            {
                GameInstance.camera.cancelPan();
                GameInstance.camera.incrementX(-15)
            }


            if (keyboard.isKeyDown(39)) //right
            {
                GameInstance.camera.cancelPan();
                GameInstance.camera.incrementX(15)
            }

            //The camera tracks the player while they move
            let currentWorm = this.team.getCurrentWorm();
            let currentWeapon = this.getTeam().getWeaponManager().getCurrentWeapon();
            if (this.MayCameraFollowCurrentWorm(currentWorm))
            {
                GameInstance.camera.panToPosition(Physics.vectorMetersToPixels(currentWorm.body.GetPosition()));
            }          
                //if the players weapon is active and is a throwable then track it with the camera
            else if (this.MayCameraFollowProjectile(currentWeapon))
            {
                var weapon: ThrowableWeapon = <ThrowableWeapon>this.getTeam().getWeaponManager().getCurrentWeapon();
                GameInstance.camera.panToPosition(Physics.vectorMetersToPixels(weapon.body.GetPosition()));
            }

        }

        this.team.update();

    }

    draw(ctx)
    {
        this.team.draw(ctx);
    }

    FireOnKeyUp(e: any) {
        // Dectects keyup on fire button
        if (e.which == Controls.fire.keyboard) {
            var wormWeapon = this.team.getCurrentWorm().getWeapon()

            // If the weapon in use is a force charge sytle weapon we will fire otherwise do nothing
            if (this.CanFireChargable()) {
                this.team.getCurrentWorm().fire();
                GameInstance.weaponMenu.refresh();
            }
        }
    }

    // verifications
    MayCameraFollowProjectile(currentWeapon: BaseWeapon): boolean {
        let isProjectile = currentWeapon.IsAThrowableWeapon() ||
            currentWeapon.IsAProjectileWeapon();

        return GameInstance.state.physicsWorldSettled &&
               isProjectile &&
               currentWeapon.getIsActive();
    }

    MayCameraFollowFastestWorm(fastestWorm: Worm): boolean {

        return fastestWorm != null &&
            fastestWorm.body.GetLinearVelocity().Length() > 3 &&
            GameInstance.state.physicsWorldSettled;

    }
    
    MayCameraFollowCurrentWorm(currentWorm: Worm): boolean {
        return currentWorm.body.GetLinearVelocity().Length() >= 0.1 &&
            GameInstance.state.physicsWorldSettled;
    }

    HasJumped(): boolean {
        return keyboard.isKeyDown(Controls.jump.keyboard, true) ||
            this.gamePad.isButtonPressed(0);
    }

    HasBackfliped(): boolean {
        return keyboard.isKeyDown(Controls.backFlip.keyboard, true) ||
            this.gamePad.isButtonPressed(0);
    }

    HasWalkedRight(): boolean {
        return keyboard.isKeyDown(Controls.walkRight.keyboard) ||
            this.gamePad.isButtonPressed(15) ||
            this.gamePad.getAxis(0) > 0.5 ||
            GameInstance.sticks.getNormal(0).x > 0.5;
    }

    HasWalkedLeft(): boolean {
        return keyboard.isKeyDown(Controls.walkLeft.keyboard) ||
            this.gamePad.isButtonPressed(14) ||
            this.gamePad.getAxis(0) > 0.5 ||
            GameInstance.sticks.getNormal(0).x < -0.5;
    }

    HasAimedUp(): boolean {
        return keyboard.isKeyDown(Controls.aimUp.keyboard) ||
            this.gamePad.getAxis(2) >= 0.2 ||
            this.gamePad.getAxis(3) >= 0.2 ||
            GameInstance.sticks.getNormal(0).y < -0.6;
    }

    HasAimedDown(): boolean {
        return keyboard.isKeyDown(Controls.aimDown.keyboard) ||
            this.gamePad.getAxis(2) <= -0.2 ||
            this.gamePad.getAxis(3) <= -0.2 ||
            GameInstance.sticks.getNormal(0).y > 0.6;
    }

    HasFired(): boolean {
        return keyboard.isKeyDown(Controls.fire.keyboard, true) ||
            this.gamePad.isButtonPressed(7);
    }


    CanFireChargable() {
        var wormWeapon = this.team.getCurrentWorm().getWeapon();
        return wormWeapon.getForceIndicator().isRequired() &&
            wormWeapon.getForceIndicator().getForce() > 1 &&
            wormWeapon.getIsActive() == false;
    }
}