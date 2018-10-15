
///<reference path="APlayer.ts"/>

class AIPlayer extends APlayer {

    distTreshold = 6;
    associatedTargetDistance: AssociatedDistance;


    constructor(playerId?) {
        super(playerId);
        this.IAmAMachine = true;
    }

    AimTheEnemy() {
        var targetWorm = this.associatedTargetDistance.to;
        var currentWorm = this.associatedTargetDistance.from;

        var targetAimY = currentWorm.target.position.y

        var aimIsAboveTheTarget = targetAimY < targetWorm.body.GetPosition().y - 0.4;
        var aimIsUnderTheTarget = targetAimY > targetWorm.body.GetPosition().y + 0.4;
        console.log(aimIsAboveTheTarget, "aimIsAboveTheTarget", aimIsUnderTheTarget, "aimIsUnderTheTarget");
        if (aimIsAboveTheTarget) {
            //currentWorm.aimDown();
        } else if (aimIsUnderTheTarget) {
            //currentWorm.aimUp();
        }
    }

    ShootTarget() {
        //this.getCurrentWorm().fire();
    }

    InitAIRound(): any {
        this.associatedTargetDistance = AIUtilities.getNearestEnemyDistance(this);
    }

    FinishAIRound(): any {
        this.associatedTargetDistance = null;
    }
    
    WalkNearTarget() {
        try {
            this.associatedTargetDistance.UpdateRawDistance();
            var targetWorm = this.associatedTargetDistance.to;
            var currentWorm = this.associatedTargetDistance.from;

            var itsBehindTheTarget = currentWorm.body.GetPosition().x < targetWorm.body.GetPosition().x;
            var itsInFrontOfTheTarget = currentWorm.body.GetPosition().x > targetWorm.body.GetPosition().x;

            if (itsBehindTheTarget) {
                currentWorm.walkRight();
            } else if (itsInFrontOfTheTarget) {
                currentWorm.walkLeft();
            }
        } catch (e) {
            Logger.error(e);
        }
        
    }

    update() {
        this.timer.update();

        if (GameInstance.state.getCurrentPlayer() == this && GameInstance.state.hasNextTurnBeenTiggered() == false) {

            var mayWalkNearTarget = this.AIDecidedToMoveNearTarget() && !this.HasReachedLimitDistanceFromTarget();

            if (mayWalkNearTarget) {
                this.WalkNearTarget();
            }

            if (!mayWalkNearTarget && this.AIDecidedToShootTarget()) {
                this.ShootTarget();
            }

            this.AimTheEnemy();

            //if (this.HasJumped()) {
            //    this.team.getCurrentWorm().jump();
            //}

            //if (this.HasBackfliped()) {
            //    this.team.getCurrentWorm().backFlip();
            //}

            //if (this.HasWalkedLeft()) {
            //    this.team.getCurrentWorm().walkLeft();
            //}

            //if (this.HasWalkedRight()) {
            //    this.team.getCurrentWorm().walkRight();
            //}

            //if (this.HasAimedUp()) {
            //    var currentWrom = this.team.getCurrentWorm();
            //    currentWrom.target.aim(-0.8);
            //}

            //if (this.HasAimedDown()) {
            //    var currentWrom = this.team.getCurrentWorm();
            //    currentWrom.target.aim(0.8);
            //}

            //// While holding the
            //if (this.HasFired()) {
            //    this.weaponFireOrCharge();
            //}
            // end of player controls
        }

        this.MoveCameraToFastestWorm();

        if (GameInstance.state.hasNextTurnBeenTiggered() == false) {
            this.CameraMovements()
        }

        this.team.update();

    }

    //verifications

    // TODO PRECISA SER FEITA AINDA
    AIDecidedToMoveNearTarget() {
        return true;
    }

    AIDecidedToShootTarget() {
        return true;
    }

    HasReachedLimitDistanceFromTarget() {
        if (this.associatedTargetDistance) {
            return this.associatedTargetDistance.rawDist <= this.distTreshold;
        }

        return false;
    }
}