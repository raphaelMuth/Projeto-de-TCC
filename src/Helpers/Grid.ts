﻿///<reference path="../system/Physics.ts"/>
class Grid {
    tiles: Tile[] = [];
    gridSizeExcess = 200;
    mouseClicked: { x: number, y: number };
    //constructor(worldWidth: number, worldHeight: number) {
    //    for (var h = (Tile.size / 2); h < worldHeight; h += Tile.size) {
    //        for (var w = (Tile.size / 2); w < worldWidth; w += Tile.size) {
    //            var center = new Coordinate(w, h);
    //            this.tiles.push(new Tile(center));
    //        }
    //    }
    //}

    constructor(worldWidth: number, worldHeight: number, initialX: number, initialY: number) {
        worldWidth += this.gridSizeExcess;
        worldHeight += this.gridSizeExcess;
        initialX -= this.gridSizeExcess;
        initialY -= this.gridSizeExcess;
        console.log(initialX, initialY, "initials");
        for (var h = (Tile.size / 2); h < worldHeight; h += Tile.size) {
            for (var w = (Tile.size / 2); w < worldWidth; w += Tile.size) {
                var center = new Coordinate(initialX + w, initialY + h);
                this.tiles.push(new Tile(center));
            }
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        for (var i = 0; i < this.tiles.length; i++)
            this.tiles[i].draw(ctx, this.mouseClicked);
    }

}

class Tile {
    static size = 26;
    private vertices: Coordinate[] = [];
    private center: Coordinate;

    constructor(center: Coordinate) {
        this.center = center;
        var halfSize = Tile.size / 2;
        this.vertices[0] = this.center.Copy();
        this.vertices[0].Add({ x: halfSize, y: -halfSize });
        this.vertices[1] = this.center.Copy();
        this.vertices[1].Add({ x: halfSize, y: halfSize });
        this.vertices[2] = this.center.Copy();
        this.vertices[2].Add({ x: -halfSize, y: halfSize });
        this.vertices[3] = this.center.Copy();
        this.vertices[3].Add({ x: -halfSize, y: -halfSize });
    }

    public getCenter(pixels = true) {
        if (pixels)
            return this.center.inPixels();
        else
            return this.center.inMeters();
    }

    public getVertices(pixels = true) {
        return this.vertices.map((vertex, index) => this.getVertice(index, pixels));
    }

    public getVertice(index, pixels = true) {
        var vertex = this.vertices[index];
        if (vertex == null)
            return;

        if (pixels)
            return vertex.inPixels();
        else
            return vertex.inMeters();
    }

    public draw(ctx: CanvasRenderingContext2D, mouseCliked: {x: number, y: number} = null) {

        var halfSize = Tile.size / 2;
        let inXTreshold = false;
        let inYTreshold = false;
        if (mouseCliked) {
            inXTreshold = (mouseCliked.x >= (this.center.getX() - halfSize) && mouseCliked.x <= (this.center.getX() + halfSize));
            inYTreshold = (mouseCliked.y >= (this.center.getY() - halfSize) && mouseCliked.y <= (this.center.getY() + halfSize));
        }

        if (inXTreshold && inYTreshold) {
            ctx.fillRect(this.getVertice(3).getX(), this.getVertice(3).getY(), Tile.size, Tile.size);
        } else {
            ctx.strokeRect(this.getVertice(3).getX(), this.getVertice(3).getY(), Tile.size, Tile.size);
        }
    }
}

class Coordinate{
    private pixels: boolean;
    private x: number;
    private y: number;

    constructor(x: number, y: number, pixels = true) {
        this.pixels = true;
        this.x = x;
        this.y = y;
    }

    getX(): number {
        return this.x;
    }

    getY(): number {
        return this.y;
    }
    Copy(): Coordinate{
        return new Coordinate(this.x, this.y, this.pixels);
    }

    inPixels(): Coordinate {
        if (this.pixels) {
            return this.Copy()
        }

        return new Coordinate(Physics.metersToPixels(this.x), Physics.metersToPixels(this.y), true);
    }

    inMeters(): Coordinate {
        if (!this.pixels) {
            return this.Copy()
        }

        return new Coordinate(Physics.pixelToMeters(this.x), Physics.pixelToMeters(this.y), false);
    }

    Add(v: any) {
        this.x += v.x || 0;
        this.y += v.y || 0;
    }

    Subtract(v: any){
        this.x -= v.x || 0;
        this.y -= v.y || 0;
    }

    Multiply(a) {
        if (a === undefined) a = 0;
        this.x *= a;
        this.y *= a;
    }


}