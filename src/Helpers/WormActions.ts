
///<reference path="../Worm.ts" />

module WormActions{
    export const hasToFlip = (wormX: number, targetX: number, direction: number) => {
            
        //if (Worm.DIRECTION.left == direction) {
        //    if (wormX < targetX) {
        //        return false;
        //    } else {
        //        return true;
        //    }
        //} else {
        //    if (wormX > targetX) {
        //        return false;
        //    } else {
        //        return true;
        //    }
        //}
        var itsLookingLeft = Worm.DIRECTION.left == direction;
        var itsLookingRight = Worm.DIRECTION.right == direction;
        
        var itsBehindTheTarget = wormX < targetX;
        var itsInFrontOfTheTarget = wormX > targetX;

        if ((itsLookingRight && itsInFrontOfTheTarget) ||
            (itsLookingLeft && itsBehindTheTarget )) {
            return false;
        }

        return true;
            

    }


    export const DoBackflip = (worm: Worm, target: { x: number, y: number }) => {
        var pos = worm.body.GetPosition();

        if (hasToFlip(pos.x, target.x, worm.direction))
            worm.flip();

        worm.backFlip();
        

    }

    export const DoJump = (worm: Worm, target: { x: number, y: number }) => {
        var pos = worm.body.GetPosition();

        if (hasToFlip(pos.x, target.x, worm.direction * -1))
            worm.flip();

        worm.jump();
        
    }



}