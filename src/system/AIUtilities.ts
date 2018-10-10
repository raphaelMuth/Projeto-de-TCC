
///<reference path="../Game.ts"/>
///<reference path="../Main.ts"/>
///<reference path="Physics.ts"/>
///<reference path="../Helpers/AssociatedDistance.ts"/>

class AIUtilities {

    constructor() {

    }
     
    static getOtherPlayers(playerId: string): Player[] {

        return GameInstance
            .players
            .filter (x => x.id != playerId); 

    }

    static getPlayersWorms(players: Player[]) : Worm[]{
        
        var temp = players.map(x => x.getTeam().worms);

        return [].concat.apply([], temp);
    
    }

    static getNearestEnemy(player: Player): Worm {

        var otherPlayers = AIUtilities.getOtherPlayers(player.id);
        
        var distances = this.getDistances(player.getCurrentWorm(), AIUtilities.getPlayersWorms(otherPlayers));

        var min = Math.min(...distances.map(x => x.rawDist));

        return distances.filter(c => c.rawDist == min)[0].to;
    }

    static getDistances(worm: Worm, enemies: Worm[]): AssociatedDistance[] {
        return enemies.map(enemy => new AssociatedDistance(worm, enemy));
    }

}

