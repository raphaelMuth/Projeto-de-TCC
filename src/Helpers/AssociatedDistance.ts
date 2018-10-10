///<reference path="../system/Physics.ts"/>
class AssociatedDistance {

    /**
    * Is the x and y distance calculate from an euclidean function, excluding any AI method
    */
    rawDist: number;

    from: Worm;
    to: Worm;

    constructor(from: Worm, to: Worm) {
        this.from = from;
        this.to = to;
        this.UpdateRawDistance();
    }

    /**
    * Get raw distance with euclidean function in math, where calculates x and y from 2 coordinates
    * @returns returns a number representing the calculated distance
    */ 
    public GetRawDistance() {
        var fromPos = this.from.body.GetPosition();
        var toPos = this.to.body.GetPosition();
        return Physics.euclideanDistance(fromPos, toPos);
    }

    /**
    * Update raw distance with euclidean function in math
    * @returns void
    */
    public UpdateRawDistance(): void{
        this.rawDist = this.GetRawDistance();
    }
}