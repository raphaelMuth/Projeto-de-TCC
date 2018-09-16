/**
 * This is encpluates the count down timer position in the bottom left hand couter
 * It also handles the switching of players when their time runs out. 
 *
 */
///<reference path="../Main.ts"/>
///<reference path="../Game.ts"/>
///<reference path="../system/Timer.ts" />
///<reference path="../Settings.ts" />

class CountDownTimer
{

    timer: Timer;
    previousSecound: number;

    constructor()
    {

        this.timer = new Timer(Settings.PLAYER_TURN_TIME);


        this.previousSecound = this.timer.timePeriod;
        $('#turnTimeCounter').hide();
    }

    show()
    {
        $('#turnTimeCounter').show();
    }

    update()
    {

        if (Settings.DEVELOPMENT_MODE)
            this.timer.pause();

        this.timer.update();
        var timeLeft = Math.floor(this.timer.getTimeLeft() / 1000);

        // Dont update the HTML element while 
        if (timeLeft != this.previousSecound && timeLeft >= 0)
        {
            if (timeLeft == 5)
            {
                AssetManager.getSound("hurry").play();
            }


            this.previousSecound = timeLeft;
            $('#turnTimeCounter').html(timeLeft);

            if (timeLeft < Settings.TURN_TIME_WARING && timeLeft >= 0)
            {
                $('#turnTimeCounter').css("background", "red");
                AssetManager.getSound("TIMERTICK").play(0.3);

            } else
            {
                $('#turnTimeCounter').css("background", "black");
            }

        }

        if (this.timer.hasTimePeriodPassed(false))
        {
            this.timer.pause();
            GameInstance.state.timerTiggerNextTurn();
        }

    }

}