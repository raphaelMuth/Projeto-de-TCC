/**
 * The player class contains a team objects, which is the team of worms. 
 * It also defines the controls for the worms movements.
 *
 */
///<reference path="APlayer.ts"/>
///<reference path="../Team.ts"/>
///<reference path="../system/Utilies.ts"/>
///<reference path="../system/Timer.ts"/>
///<reference path="../system/Controls.ts"/>

class Player extends APlayer
{
    constructor(playerId?)
    {
        super(playerId);
        $(window).keyup((e) => this.FireOnKeyUp(e) );
        
    }
    
    update()
    {
        this.timer.update();
                
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
                this.team.getCurrentWorm().aimUp();
            }

            if (this.HasAimedDown())
            {
                this.team.getCurrentWorm().aimDown();
            }

            // While holding the
            if (this.HasFired())
            {
                this.weaponFireOrCharge();
            }
            // end of player controls
        }

        this.MoveCameraToFastestWorm();

        if (GameInstance.state.hasNextTurnBeenTiggered() == false) {
            this.CameraMovements()
        }

        this.team.update();

    }
    
    FireOnKeyUp(e: any) {
        // Dectects keyup on fire button
        if (e.which == Controls.fire.keyboard) {
            // If the weapon in use is a force charge sytle weapon we will fire otherwise do nothing
            if (this.CanFireChargable())
                this.fire();
        }
    }
    
    // verifications

    HasJumped(): boolean {
        return keyboard.isKeyDown(Controls.jump.keyboard, true);
    }

    HasBackfliped(): boolean {
        return keyboard.isKeyDown(Controls.backFlip.keyboard, true);
    }

    HasWalkedRight(): boolean {
        return keyboard.isKeyDown(Controls.walkRight.keyboard);
    }

    HasWalkedLeft(): boolean {
        return keyboard.isKeyDown(Controls.walkLeft.keyboard);
    }

    HasAimedUp(): boolean {
        return keyboard.isKeyDown(Controls.aimUp.keyboard);
    }

    HasAimedDown(): boolean {
        return keyboard.isKeyDown(Controls.aimDown.keyboard);
    }

    HasFired(): boolean {
        return keyboard.isKeyDown(Controls.fire.keyboard, true);
    }
}