/**
 * This is the menu which slides out from the right side
 * Its shows the player all the infomation from their teams weapon manager.
 * It displays all the weapons + ammo and allows the user to select a weapon.
 *
 */
///<reference path="../Main.ts"/>
///<reference path="../Game.ts"/>
///<reference path="../system/AssetManager.ts"/>
///<reference path="../system/Controls.ts"/>
class WeaponsMenu
{
    htmlElement;
    isVisable;
    cssId;
    toggleButtonCssId;

    constructor()
    {
        this.cssId = "weaponsMenu";
        this.toggleButtonCssId = "weaponsMenuBtn";

        $('body').append("<div id=" + this.cssId + "><div id=" + this.toggleButtonCssId + ">Weapons Menu</div><div id=content></div></div>");


        this.htmlElement = $("#" + this.cssId);


         $('#'+this.toggleButtonCssId).click(() => this.toggle() );
        
        $(window).keypress((event) =>
        {
            if (Controls.checkControls(Controls.toggleWeaponMenu, event.which))
            {
                this.toggle();
            }
        });

        $('body').mousedown((event) =>
        {
            if (Controls.checkControls(Controls.toggleWeaponMenu, event.which))
            {
                this.toggle();
            }
        });

        $('body').on('contextmenu', "#" + this.cssId, (e) => { return false; });

        this.isVisable = false;
    }


    selectWeapon(weaponId)
    {
        var weaponMgmt = GameInstance.state.getCurrentPlayer().getTeam().getWeaponManager();

        //Checks if the weapon has ammo to provide the html been hacked and a weaponid passed that doesn't have ammo
        if (weaponMgmt.checkWeaponHasAmmo(weaponId))
        {
            weaponMgmt.setCurrentWeapon(weaponId);
        }
    }


    show()
    {
        this.htmlElement.show();
    }

    refresh()
    {
        var weaponMgmt = GameInstance.state.getCurrentPlayer().getTeam().getWeaponManager();
        this.populateMenu(weaponMgmt.getListOfWeapons());
    }

    toggle()
    {

        // populate
        this.refresh();
        var moveAmountInPx;

        if (this.isVisable)
        {
            moveAmountInPx = "0px";
            this.isVisable = false;
        } else
        {
            moveAmountInPx = "-275px";
            this.isVisable = true;
        }


        this.htmlElement.animate({
            marginLeft: moveAmountInPx,
        }, 400);

    }

    //Fills the menu up with the various weapon items
    populateMenu(listOfWeapons: BaseWeapon[])
    {
        var html = "<ul class = \"thumbnails\" >"

        for (var weapon in listOfWeapons)
        {
            var currentWeapon: BaseWeapon = listOfWeapons[weapon];
            var cssClassType = "ammo";

            if (currentWeapon.OutOfAmmo())
            {
                cssClassType = "noAmmo";
                weapon = "-1";
            }

            html += "<li class=span1 id=" + weapon + ">";
            html += "<a  class=\"thumbnail " + cssClassType + "\" id=" + weapon + " value=" + currentWeapon.name + "  title= " + currentWeapon.name +"><span class=ammoCount> " + currentWeapon.ammo + "</span><img title= " + currentWeapon.name +" src=" + currentWeapon.iconImage.src + " alt=" + currentWeapon.name + "></a>";
            html += "</li>";
        }
        html += "</ul>";

        //Should of just used a CSS class and then an ID selector, oh well fuck it, it works!
        $($(this.htmlElement).children().get(1)).empty();
        $($(this.htmlElement).children().get(1)).append(html);

        
        $("#" + this.cssId + " li").click( (event) =>
        {

            var weaponId = parseInt($(event.currentTarget).attr('id'));

            if (weaponId == -1)
            {
                AssetManager.getSound("cantclickhere").play();
                return;
            }

            AssetManager.getSound("CursorSelect").play();
            this.selectWeapon(weaponId);
            this.toggle();
        });

    }


}
