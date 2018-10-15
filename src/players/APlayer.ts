///<reference path="../Team.ts"/>
///<reference path="../system/Utilies.ts"/>
///<reference path="../system/Timer.ts"/>
///<reference path="../system/Controls.ts"/>

abstract class APlayer {
    InitAIRound(): any {
        throw new Error("Method not implemented.");
    }
    team: Team;
    id: string;
    timer: Timer;
    IAmAMachine: boolean;

    constructor(playerId = Utilies.pickUnqine([1, 2, 3, 4], "playerids")) {
        this.id = playerId;
        this.team = new Team(playerId);
        this.timer = new Timer(10);
        this.IAmAMachine = false;
    }


    getTeam() {
        return this.team;
    }

    weaponFireOrCharge() {
        var wormWeapon = this.getCurrentWorm().getWeapon();

        if (this.HoldingInactiveChargableWeapon(wormWeapon)) {

            var hasAmmoAndChargedFully =
                !wormWeapon.OutOfAmmo() &&
                wormWeapon.getForceIndicator().charge(3);

            if (hasAmmoAndChargedFully) 
                this.fire();
            else if (wormWeapon.OutOfAmmo()) 
                this.notifyOutOfAmmo();
            
        }
        else {
            this.fire();
        }

    }

    abstract update();

    draw(ctx) {
        this.team.draw(ctx);
    }
    
    fire() {
        this.team.getCurrentWorm().fire();
        GameInstance.weaponMenu.refresh();
    }

    getCurrentWorm() {
        return this.team.getCurrentWorm();
    }

    notifyOutOfAmmo() {
        var wormWeapon = this.getCurrentWorm().getWeapon();
        Notify.display("Out of Ammo", "No more ammo left in your " + wormWeapon.name + " Select a new weapon ", 5000);
        AssetManager.getSound("cantclickhere").play();
    }

    CameraMovements() {

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
        if (this.MayCameraFollowCurrentWorm(currentWorm)) {
            GameInstance.camera.panToPosition(Physics.vectorMetersToPixels(currentWorm.body.GetPosition()));
        }
        //if the players weapon is active and is a throwable then track it with the camera
        else if (this.MayCameraFollowProjectile(currentWeapon)) {
            var weapon: ThrowableWeapon = <ThrowableWeapon>this.getTeam().getWeaponManager().getCurrentWeapon();
            GameInstance.camera.panToPosition(Physics.vectorMetersToPixels(weapon.body.GetPosition()));
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
    
    CanFireChargable(): boolean {
        var wormWeapon = this.getCurrentWorm().getWeapon();

        return this.HoldingInactiveChargableWeapon(wormWeapon) &&
            wormWeapon.getForceIndicator().getForce() > 1;
    }

    HoldingInactiveChargableWeapon(wormWeapon = this.team.getCurrentWorm().getWeapon()): boolean {
        return wormWeapon.getForceIndicator().isRequired() && wormWeapon.getIsActive() == false;
    }



    //// deveria tar em outro lugar qualquer sei la onde
    MoveCameraToFastestWorm() {

        //Finds the worm traveling at the highest velocity and if its over a therosold
        // the camera will then pan to the position of that worm. 
        // So when their is an explosion it gives the player somthing interesting and fun to look at

        var fastestWorm = GameInstance.wormManager.findFastestMovingWorm();
        if (this.MayCameraFollowFastestWorm(fastestWorm)) {
            GameInstance.camera.panToPosition(Physics.vectorMetersToPixels(fastestWorm.body.GetPosition()));
        }
    }
}