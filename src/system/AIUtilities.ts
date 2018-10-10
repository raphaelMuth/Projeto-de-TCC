
///<reference path="../Game.ts"/>
///<reference path="../Main.ts"/>
///<reference path="Physics.ts"/>
///<reference path="../Helpers/AssociatedDistance.ts"/>

module AIUtilities {
     
    export const getOtherPlayers = (playerId: string): Player[] => {

        return GameInstance
            .players
            .filter (x => x.id != playerId); 

    }

    export const getPlayersWorms = (players: Player[]) : Worm[] => {
        
        var temp = players.map(x => x.getTeam().worms);

        return [].concat.apply([], temp);
    
    }

    export const getNearestEnemy = (player: Player): Worm => {

        var otherPlayers = AIUtilities.getOtherPlayers(player.id);
        
        var distances = AIUtilities.getDistances(player.getCurrentWorm(), AIUtilities.getPlayersWorms(otherPlayers));

        var min = Math.min(...distances.map(x => x.rawDist));

        return distances.filter(c => c.rawDist == min)[0].to;
    }

    export const getDistances = (worm: Worm, enemies: Worm[]): AssociatedDistance[] => {
        return enemies.map(enemy => new AssociatedDistance(worm, enemy));
    }

}

