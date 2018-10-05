
///<reference path="../Game.ts"/>
///<reference path="../Main.ts"/>

class AIUtilities {

    constructor() {

    }

    static getAllEnemiesPositions(playerId: string): NamedPosition[] {

        var otherPlayers = AIUtilities.getOtherPlayers(playerId)
        
        var enemyWorms = AIUtilities.getPlayersWorms(otherPlayers)
        
        var namedPositions = enemyWorms.map(x =>
        {
            var pos = x.body.GetPosition();
            return new NamedPosition(pos.x, pos.y, x.name);
        });

        return namedPositions;
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

    static getNearestEnemy(currentPlayerId: string, x: boolean): NamedPosition {
        var posititons = AIUtilities.getAllEnemiesPositions(currentPlayerId);

        if (x) {
            return AIUtilities.getMinX(posititons);
        } else {
            return AIUtilities.getMinY(posititons);
        }
    }

    static getMinX(positions: NamedPosition[]): NamedPosition {
        return positions.reduce((min, p) => p.x < min.x ? p : min, positions[0]);
    }

    static getMaxX(positions: NamedPosition[]): NamedPosition {
        return positions.reduce((max, p) => p.x > max.x ? p : max, positions[0]);
    }

    static getMinY(positions: NamedPosition[]): NamedPosition {
        return positions.reduce((min, p) => p.y < min.y ? p : min, positions[0]);
    }

    static getMaxY(positions: NamedPosition[]): NamedPosition {
        return positions.reduce((max, p) => p.y > max.y ? p : max, positions[0]);
    }
}


class NamedPosition {
    x: number;
    y: number;
    name: string;

    constructor(x: number, y: number, name: string) {
        this.x = x;
        this.y = y;
        this.name = name;
    }
}

