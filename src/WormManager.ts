/**
 * WormManager.js
 *
 *  License: Apache 2.0
 *  author:  Ciarán McCann
 *  url: http://www.ciaranmccann.me/
 */
///<reference path="system/Camera.ts"/>
///<reference path="system/Graphics.ts"/>
///<reference path="system/AssetManager.ts"/>
///<reference path="system/Physics.ts"/>
///<reference path="Worm.ts"/>
///<reference path="system/Utilies.ts"/>
///<reference path="system/Timer.ts" />
///<reference path="Settings.ts" />


class WormManager
{
    allWorms: Worm[];

    constructor (players : Player[])
    {
        this.allWorms = [];

        // Get a reference to all the worms from each team
        // for fast acessing, when asking quetions of all them.
        this.getReferencesOfAllWorms(players);
        
        Logger.log( this.allWorms);
    }

    getReferencesOfAllWorms(players: Player[]) {
        players
            .forEach(player => {
                player
                    .getTeam()
                    .getWorms()
                    .forEach(worm => this.allWorms.push(worm) );
        });
    }

    findWormWithName(name: string) {
        var worm = this.allWorms.filter(worm => worm.name == name)[0];
        if (worm)
            return worm

        Logger.error("Unable to find worm with name " + name);
    }

    // are all the worms completely finished, animations, health reduction, actions etc.
    areAllWormsReadyForNextTurn()
    {
        return WormAnimationManger.playerAttentionSemaphore == 0 &&
            this.areAllWormsStationary() &&
            this.areAllWormsDamageTaken() && 
            this.areAllWeaponsDeactived();
    }

    // Are all the worms stop, not moving at all. 
    areAllWormsStationary()
    {
        return this.allWorms.every(worm => worm.isStationary());
    }

    findFastestMovingWorm()
    {

        var highestVecloity = 0;
        var wormWithHighestVelocity : Worm = null;
        var lenght = 0;

        this.allWorms.forEach(worm => {
            lenght = worm.body.GetLinearVelocity().Length();

            if (lenght > highestVecloity) {
                highestVecloity = lenght;
                wormWithHighestVelocity = worm;
            }

        });

        return wormWithHighestVelocity ;
    }


    areAllWeaponsDeactived()
    {
        return this
            .allWorms
            .every(worm => !worm.team.getWeaponManager().getCurrentWeapon().isActive);
    }

    //deactivate all non-time based weapons, such as jetpacks and ropes etc. 
    deactivedAllNonTimeBasedWeapons()
    {
        this.allWorms.forEach(worm => {
            var weapon = worm.team.getWeaponManager().getCurrentWeapon();
            if ((weapon.IsAThrowableWeapon() ||
                weapon.IsAProjectileWeapon()) == false) {
                weapon.deactivate();
            }
        });
    }

    // Are all worm accumlated damage pionts taken from their total health yet?
    areAllWormsDamageTaken()
    {
        for (var i = 0; i < this.allWorms.length; i++)
        {
            let worm = this.allWorms[i];
            if (worm.damageTake != 0)
            {
                return false;
            }

            // May have taken the health away but are now waiting for the death squence to start, so contine to return false
            if (worm.getHealth() == 0 &&
                worm.damageTake == 0 &&
                worm.isDead == false)
            {
                return false;
            }
        }

        return true;
    }

    syncHit(wormName,damage)
    {
        if (Client.isClientsTurn())
        {
            var parameters = [wormName, damage];
            Client.sendImmediately(Events.client.ACTION, new InstructionChain("wormManager.syncHit", parameters));

        } else
        {
            var damage = wormName[1];
            var wormName = wormName[0];

           var worm : Worm =  GameInstance.wormManager.findWormWithName(wormName);

           if (worm)
           {
               worm.damageTake += damage;
               worm.hit(0, null);
           }
               
        }
    }

}