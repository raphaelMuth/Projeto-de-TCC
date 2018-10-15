///<reference path="../Settings.ts" />
///<reference path="../animation/SpriteDefinitions.ts" />
///<reference path="../system/AssetManager.ts" />
///<reference path="ForceIndicator.ts" />

class BaseWeapon
{
    ammo;
    name;
    iconImage;
    isActive;
    worm: Worm;
    takeOutAnimations: SpriteDefinition;
    takeAimAnimations: SpriteDefinition;
    forceIndicator: ForceIndicator;

    requiresAiming: boolean;

    constructor(name: string, ammo: number, iconSprite, takeOutAnimation: SpriteDefinition, takeAimAnimation: SpriteDefinition)
    {
        this.name = name;
        this.ammo = ammo;

        this.takeOutAnimations = takeOutAnimation;
        this.takeAimAnimations = takeAimAnimation;
        //Setup the icon used in the weapon menu
        this.iconImage = AssetManager.getImage(iconSprite.imageName);

        this.requiresAiming = true;

        this.setIsActive(false);

        this.forceIndicator = new ForceIndicator(0);
    }

    getForceIndicator()
    {
        return this.forceIndicator;
    }

    getIsActive() { return this.isActive; }
    setIsActive(val) { this.isActive = val; }

    deactivate()
    {
    
    }

    activate(worm)
    {

        this.setIsActive(true);
        this.ammo--;
        this.worm = worm;

        Logger.debug(this.name + " was activated ");

    }

    update() { }

    draw(ctx) { }

    IsANinjaRope() {
        return this instanceof NinjaRope;
    }

    IsADrill() {
        return this instanceof Drill;
    }

    IsADynamite() {
        return this instanceof Dynamite;
    }

    IsAHandGrenade() {
        return this instanceof HandGrenade;
    }

    IsAHolyGrenade() {
    return this instanceof HolyGrenade;
    }

    IsAJetPack() {
    return this instanceof JetPack;
    }

    IsAMinigun() {
    return this instanceof Minigun;
    }

    IsAProjectileWeapon() {
    return this instanceof ProjectileWeapon;
    }

    IsARayWeapon() {
    return this instanceof RayWeapon;
    }

    IsAShotgun() {
    return this instanceof Shotgun;
    }

    IsAThrowableWeapon() {
    return this instanceof ThrowableWeapon;
    }

    OutOfAmmo(): boolean {
        return this.ammo <= 0;
    }

}

