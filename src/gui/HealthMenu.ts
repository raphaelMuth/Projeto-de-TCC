
///<reference path="../Main.ts"/>
///<reference path="../Game.ts"/>
///<reference path="../Settings.ts"/>
///<reference path="../system/AssetManager.ts"/>
///<reference path="../system/Controls.ts"/>
class HealthMenu
{

    constructor (players)
    {
        var html = "";

        for (var p in players)
        {
            var team : Team = players[p].getTeam();

            html += ` <li><span> ${team.name} </span>
                    <img src= ${Settings.REMOTE_ASSERT_SERVER}/data/images/Ireland.png>
                    <span id='${team.teamId}' class=health style='width: ${team.getPercentageHealth()}%; background:${team.color}' ></span>
                    </li> `;
        }
        $(Constants.CSS_CLASS_HEALTH_MENU + ' ul').html(html);
        this.hide();

    }

    show()
    {
        $(Constants.CSS_CLASS_HEALTH_MENU).show();
    }

    hide()
    {
        $(Constants.CSS_CLASS_HEALTH_MENU).hide();
    }
    
    cleanAndHide() {
        $(Constants.CSS_CLASS_HEALTH_MENU).empty();
        this.hide()
    }

    update(teamRef : Team)
    {       
        $('#' + teamRef.teamId).animate({
            width: teamRef.getPercentageHealth() + "%",
        }, 300);
    }

}