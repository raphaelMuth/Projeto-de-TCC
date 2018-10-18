/**
 * This controls the viewport
 *
 */
///<reference path="Utilies.ts"/>

class Camera
{

    position;
    levelWidth;
    levelHeight;
    vpWidth;
    vpHeight;

    panPosition;
    panSpeed;
    toPanOrNotToPan;
    /**
    * Construtor da camera
    * @param levelWidth comprimento total do mundo em pixels
    * @param levelHeight altura total do mundo em pixels
    * @param vpWidth comprimento total da parte visivel mundo em pixels
    * @param vpHeight altura total da parte visivel mundo em pixels
    */
    constructor (levelWidth, levelHeight, vpWidth, vpHeight)
    {
        this.levelWidth = levelWidth;
        this.levelHeight = levelHeight;

        this.vpWidth = vpWidth;
        this.vpHeight = vpHeight;

        this.position = new b2Vec2(0, 0);
        this.panPosition = new b2Vec2(0, 0);

        this.panSpeed = 6.1;
        this.toPanOrNotToPan = false;

    }
    /**
    * movimento camera incrementenado a position de acordo com o que esta na panposition
    */
    update()
    {
        //Logger.log("before Update this.panX = " + this.panX + "  this.x = " + this.x);
        //Logger.log("before Update this.panY = " + this.panY + "  this.y = " + this.y);
        if (this.toPanOrNotToPan)
        {
            if (this.panPosition.x > this.position.x)
            {
                this.incrementX(this.panSpeed);
            }

            if (this.panPosition.x < this.position.x)
            {
                this.incrementX(-this.panSpeed);
            }

            if (this.panPosition.y > this.position.y)
            {
                this.incrementY(this.panSpeed);

            }

            if (this.panPosition.y < this.position.y)
            {
                this.incrementY(-this.panSpeed);
            }
        }
        // Logger.log("after Update this.panX = " + this.panX + "  this.x = " + this.x);
        //Logger.log("after Update this.panY = " + this.panY + "  this.y = " + this.y);

    }

    cancelPan()
    {
        this.toPanOrNotToPan = false;
    }

    /**
    * Seta a panposition com o local no mundo especificado em pixels
    * @param vector com a posicao em pixels do local onde se quer movimentar a camera
    */
    panToPosition(vector)
    {
        // Center on said position
        var halfViewSpaceWidth = this.vpWidth / 2;
        var halfViewSpaceHeight = this.vpHeight / 2;
        vector.x -= halfViewSpaceWidth;
        vector.y -= halfViewSpaceHeight;


        //console.log(halfViewSpaceWidth, halfViewSpaceHeight, "<= Subtract half values(w,h), vector positions after Subtract =>", vector.x, vector.y);

        var currentPos = this.position.Copy();
        currentPos.Subtract(vector);

        //console.log(this.position.x, this.position.y, "<= position before Subtract, position after Subtract =>", currentPos.x, currentPos.y);

        var diff = currentPos.Length() / 25;
        this.panSpeed = diff;

        this.panPosition.x = vector.x;
        this.toPanOrNotToPan = true;

        this.panPosition.y = vector.y;
        
    }

    getX() { return this.position.x; }
    getY() { return this.position.y; }

    setX(x: number)
    {
        if (this.vpWidth + x <= this.levelWidth && x >= 0)
        {
            this.position.x = x;
            return true;
        }
        return false;
    }

    setY(y: number)
    {
        if (this.vpHeight + y <= this.levelHeight && y >= 0)
        {
            this.position.y = y;
            return true;
        }

        return false;
    }

    incrementX(x: number)
    {
        return this.setX(this.position.x + x);
    }

    incrementY(y: number)
    {
        return this.setY(this.position.y + y);
    }

}