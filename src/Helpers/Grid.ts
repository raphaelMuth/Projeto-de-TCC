///<reference path="../system/Physics.ts"/>
class Grid {
    tiles: Tile[] = [];

    constructor(worldWidth: number, worldHeight: number) {
        for (var h = (Tile.size / 2); h < worldHeight; h += Tile.size) {
            for (var w = (Tile.size / 2); w < worldWidth; w += Tile.size) {
                var center = new Coordinate(w, h);
                this.tiles.push(new Tile(center));
            }
        }
    }
}

class Tile {
    static size = 200;
    private vertices: Coordinate[] = [];
    private center: Coordinate;

    constructor(center: Coordinate) {
        this.center = center;
        this.vertices[0] = this.center.Copy();
        this.vertices[0].Add({ x: 20, y: -20 });
        this.vertices[1] = this.center.Copy();
        this.vertices[1].Add({ x: 20, y: 20 });
        this.vertices[2] = this.center.Copy();
        this.vertices[2].Add({ x: -20, y: 20 });
        this.vertices[3] = this.center.Copy();
        this.vertices[3].Add({ x:-20, y: -20 });
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