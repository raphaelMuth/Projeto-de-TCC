/**
 *  
 * Centrialized location for controls and input
 *
 *
 */
module Controls
{
    export var toggleWeaponMenu =
    {
        keyboard: 101
    }

    export var walkLeft =
    {
        keyboard: 65
    }

    export var walkRight =
    {
        keyboard: 68
    }

    export var jump =
    {
        keyboard: 32
    }

    export var backFlip =
    {
        keyboard: keyboard.keyCodes.Backspace
    }

    export var aimUp =
    {
        keyboard: 87
    }

    export var aimDown =
    {
        keyboard: 83
    }

    export var fire =
    {
        keyboard: 13
    }

    export const checkControls = (control, key)  =>
    {
        return (key == control.keyboard);
    }


}