/**
 * Each Team has a load of weapons that are managed by this class. 
 * It sotires the weapons, allow simple controlled accsse to the weapons.
 *
 */
///<reference path="../system/Graphics.ts"/>
///<reference path="../system/AssetManager.ts"/>
///<reference path="../system/Physics.ts"/>
///<reference path="../animation/Sprite.ts"/>
///<reference path="../weapons/Drill.ts"/>
///<reference path="../weapons/HolyGrenade.ts"/>
///<reference path="../weapons/HandGrenade.ts"/>
///<reference path="../weapons/Dynamite.ts"/>
///<reference path="../weapons/NinjaRope.ts"/>
///<reference path="../weapons/JetPack.ts"/>
///<reference path="../weapons/RayWeapon.ts"/>
///<reference path="../weapons/Shotgun.ts"/>
///<reference path="../weapons/Minigun.ts"/>
///<reference path="../weapons/ProjectileWeapon.ts"/>

class WeaponManager
{

    private weaponsAndTools: BaseWeapon[];
    private currentWeaponIndex;

    constructor ()
    {
        this.weaponsAndTools = 
        [
            new Shotgun(99),           
            new HandGrenade(20),
            new HolyGrenade(2),
            new Dynamite(5),
            new JetPack(5), 
            new Minigun(4),   //Bug: might take out for final demo          
            new NinjaRope(50),
            new Drill(3),
            new Bazzoka(15)
               
                       
        ];

        this.currentWeaponIndex = 1;
    }

 
    checkWeaponHasAmmo(weaponIndex)
    {
        return this.weaponsAndTools[weaponIndex].ammo != null;
    }

    getCurrentWeapon()
    {
        return this.weaponsAndTools[this.currentWeaponIndex];
    }

    setCurrentWeapon(index)
    {
        var currentWeapon = this.getCurrentWeapon();
        //Allows the user to switch weapon once its active if its a jetpack or ninjia rope
        if (!currentWeapon.getIsActive() || currentWeapon.IsAJetPack() || currentWeapon.IsANinjaRope())
        {

            if (currentWeapon.IsANinjaRope())
            {
                currentWeapon.deactivate();
            }

            this.currentWeaponIndex = index;
        }
    }

    getListOfWeapons()
    {
        return this.weaponsAndTools;
    }


}