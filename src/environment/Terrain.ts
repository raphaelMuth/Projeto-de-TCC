/**
 * Terrain
 * The terrain class handles the graphical repsentation of the terrain
 * as well as the box2d physic model. Using the map image data the terrain class
 * constructs box2d objects which make up the terrain. It also handles deformations
 *
 */
///<reference path="../system/Physics.ts"/>
///<reference path="../system/Utilies.ts" />
///<reference path="TerrainBoundary.ts"/>
///<reference path="Waves.ts"/>
///<reference path="../Helpers/Grid.ts"/>

class Terrain
{

    grid: Grid;
    lastExplosionAABB: any;
    drawingCanvas: HTMLCanvasElement;
    drawingCanvasContext: CanvasRenderingContext2D;
    bufferCanvas: HTMLCanvasElement;
    bufferCanvasContext: CanvasRenderingContext2D;
    world;
    scale;
    terrainData;
    Offset;

    wave: Waves;

    boundary: TerrainBoundary;

    //Used to batch the deforms to one draw and one box2d regen
    deformTerrainBatchList = []; 

    TERRAIN_RECT_HEIGHT: number;

    constructor (canvas, terrainImage, world, scale)
    {

        //this.skyOffset = 350;
        this.world = world;
        this.scale = scale;

        this.Offset = new b2Vec2(2300, 1300);

        this.drawingCanvas = canvas;
        this.drawingCanvasContext = this.drawingCanvas.getContext("2d");

        this.TERRAIN_RECT_HEIGHT = 5;

        //Used for increased preformance. Its more effectent to draw one canvas onto another
        //instead of a large pixel buffer array 
        this.bufferCanvas = <HTMLCanvasElement>document.createElement('canvas');
        this.bufferCanvas.width = this.Offset.x+(terrainImage.width*1.5);
        this.bufferCanvas.height =  this.Offset.y+(terrainImage.height*1.5);
        this.boundary = new TerrainBoundary(this.bufferCanvas.width+this.Offset.x, this.bufferCanvas.height+100);

        this.bufferCanvasContext = this.bufferCanvas.getContext('2d');

        this.bufferCanvasContext.fillStyle = 'rgba(0,0,0,255)'; //Setup alpha colour for cutting out terrain
        this.bufferCanvasContext.drawImage(terrainImage, this.Offset.x,  this.Offset.y, this.bufferCanvas.width-this.Offset.x, this.bufferCanvas.height-this.Offset.y);

        this.terrainData = this.bufferCanvasContext.getImageData(this.Offset.x, this.Offset.y, this.bufferCanvas.width-this.Offset.x, this.bufferCanvas.height-this.Offset.y);
        this.createTerrainPhysics(0, 0, this.bufferCanvas.width-this.Offset.x, this.bufferCanvas.height-this.Offset.y, this.terrainData.data, world, scale)

        this.bufferCanvasContext.globalCompositeOperation = "destination-out"; // Used for cut out circles

        this.wave = new Waves();
        this.grid = new Grid(this.getWidth(), this.getHeight());
        //this.grid = new Grid(this.bufferCanvas.width, this.bufferCanvas.height);
    }

    getWidth()
    {
       return this.boundary.worldWidth;    
    }

     getHeight()
    {
         return this.boundary.worldHeight;
    }

    // This setup physical bodies from image data 
    createTerrainPhysics(x, y, width, height, data, world, worldScale)
    {
        x = Math.floor(x);
        y = Math.floor(y);

        width = width * 4; // 4 becase of [r,g,b,a]
        height = height;

        var theAlphaByte = 3;
        var rectWidth = 0;
        var rectheight = this.TERRAIN_RECT_HEIGHT; // Every 5 lines is used instead of every px line

        var fixDef = new b2FixtureDef;
        fixDef.density = 1.0;
        fixDef.friction = 1.0;
        fixDef.restitution = 0.0;
        fixDef.shape = new b2PolygonShape;

        var bodyDef = new b2BodyDef;
        bodyDef.type = b2Body.b2_staticBody;

        var bodiesCreated = 0;

        // Used to create a single rect out of a series of consecnative solid 
        var makeBlock = () => {
            //console.log("in xpos and ypos", Physics.pixelToMeters(xPos + Physics.vectorPixelToMeters(this.Offset).x), Physics.pixelToMeters(yPos + Physics.vectorPixelToMeters(this.Offset).y));
            //for (var w = 0; w < rectWidth; w += rectheight) {
            //    var halfWidth = Physics.pixelToMeters(rectheight) / 2;
            //    var halfHeight = Physics.pixelToMeters(rectheight) / 2;
                
            //    fixDef.shape.SetAsBox(halfWidth, halfHeight);

            //    bodyDef.position.x = Physics.pixelToMeters((xPos / 4) - w);
            //    bodyDef.position.y = Physics.pixelToMeters((yPos - rectheight));

            //    var offset = Physics.vectorPixelToMeters(this.Offset);
            //    bodyDef.position.x += offset.x;
            //    bodyDef.position.y += offset.y;
            //    console.log("x => y", bodyDef.position.x, "=>", bodyDef.position.y);
            //    var b = world.CreateBody(bodyDef).CreateFixture(fixDef).GetBody();
            //    b.SetUserData(this);
            //}

            fixDef.shape.SetAsBox((rectWidth / worldScale) / 2, (rectheight / worldScale) / 2);
            bodyDef.position.x = ((xPos / 4) - (rectWidth / 2)) / worldScale;
            bodyDef.position.y = ((yPos - rectheight) / worldScale);

            var offset = Physics.vectorPixelToMeters(this.Offset);
            bodyDef.position.x += offset.x;
            bodyDef.position.y += offset.y;

            var b = world.CreateBody(bodyDef).CreateFixture(fixDef).GetBody();
            b.SetUserData(this);
        }

        //Loops though the image pixel data, looking
        // for constecative NON-alpha pixels. To create the physical blocks out of
        for (var yPos = y; yPos <= height; yPos += rectheight)
        {
            rectWidth = 0;

            for (var xPos = x; xPos <= width; xPos += 4)
            {

                if (data[xPos + (yPos * width) + theAlphaByte] == 255) //if not alpha pixel
                {
                    rectWidth++;

                    //Check if the box spans the full width of the image.
                    if (rectWidth >= this.drawingCanvas.width)
                    {

                        // if so make the box and reset for the next line
                        makeBlock();
                        rectWidth = 0; //reset rect
                    }

                }
                else if (rectWidth > 1)
                    {

                    makeBlock();
                    bodiesCreated++;
                    rectWidth = 0; //reset rect

                }
            }
        }
        Logger.log("Current body count " + bodiesCreated);
    }

    //Adds this deform position to the list so that the deforms 
    //can be batched at the end of the update loop
    addToDeformBatch(x, y, r)
    {
        this.deformTerrainBatchList.push({ xPos: x, yPos: y, radius: r });
    }

    addRectToDeformBatch(x, y, w, h)
    {
        this.deformTerrainBatchList.push({ xPos: x, yPos: y, radius: h, width: w });
    }

    // This allows the terrain image data to be changed.
    // It then calls for the box2d physic terrain to be reconstructed from the new image
    deformRegionBatch()
    {

        var lenghtCache = this.deformTerrainBatchList.length;

        var angle = Math.PI * 2;

        this.bufferCanvasContext.beginPath();
        // Draw cut outs of all batched deformations
        for (var i = 0; i < lenghtCache; i++)
        {
            var tmp = this.deformTerrainBatchList[i];

            if (tmp.width)
            {
                this.bufferCanvasContext.fillRect(tmp.xPos - tmp.width / 2, tmp.yPos, tmp.width, tmp.radius);
            } else
            {
                this.bufferCanvasContext.arc(tmp.xPos, tmp.yPos, tmp.radius, angle, 0, true);
            }


        }

        this.bufferCanvasContext.closePath();
        this.bufferCanvasContext.fill();

        this.terrainData = this.bufferCanvasContext.getImageData(this.Offset.x, this.Offset.y, this.bufferCanvas.width, this.bufferCanvas.height);

        // for each explision in batch find what rects its radius interects and destory them.
        // Then scan image from top of explosion radius down to bottom and fill back in the rects
        for (var i = 0; i < lenghtCache; i++)
        {

            var tmp = this.deformTerrainBatchList[i];
            var normalizedRadis = Math.floor(tmp.radius / this.TERRAIN_RECT_HEIGHT) * this.TERRAIN_RECT_HEIGHT;
            var y = Math.floor(tmp.yPos / this.TERRAIN_RECT_HEIGHT) * this.TERRAIN_RECT_HEIGHT;

            //Setup bounding box, to check which terrain rects intercest the box and need to be removed and recreated.
            var aabb = new b2AABB();
            aabb.lowerBound.Set(
                0,
                Physics.pixelToMeters(y - normalizedRadis)
            );

            aabb.upperBound.Set(
                Physics.pixelToMeters(this.bufferCanvas.width),
                Physics.pixelToMeters( y + normalizedRadis)
            );
            this.lastExplosionAABB = aabb
            //essa parte pega uma area especifica e remove todos os body dela
            // parte especifica essa criada pela aabb setado pela explosao
            Physics.world.QueryAABB( (fixture) =>
            {
                if (fixture.GetBody().GetType() == b2Body.b2_staticBody && fixture.GetBody().GetUserData() instanceof Terrain)
                {
                    this.world.DestroyBody(fixture.GetBody());
                }

                return true;
            }, aabb);

            //essa parte redesenha os caras que foram destruidos agora a pouco
            this.createTerrainPhysics(0, //x
                Physics.metersToPixels(aabb.lowerBound.y) - this.Offset.y,  //y
                this.bufferCanvas.width, //w
                Physics.metersToPixels(aabb.upperBound.y) + (this.TERRAIN_RECT_HEIGHT * 2)- this.Offset.y, //h
                this.terrainData.data,
                this.world,
                this.scale);
        }

        this.deformTerrainBatchList = [];
    }

    update()
    {
        if (this.deformTerrainBatchList.length > 0)
        {
            this.deformRegionBatch();
        }

        this.wave.update();
    }

    draw(ctx)
    {
        //this.drawingCanvasContext.clearRect(0, 0, this.drawingCanvas.width, this.drawingCanvas.height);

        // Here we draw an off screen buffer canvas onto our on screen one
        // this is more effeicent then drawing a pixel buffer onto the canvas
        var y = GameInstance.camera.getY();
        var x = GameInstance.camera.getX();
        var w = this.drawingCanvas.width;
        var h = this.drawingCanvas.height;

        if ( y + this.drawingCanvas.height > this.bufferCanvas.height)
        {
            var diff = (y + this.drawingCanvas.height)-this.bufferCanvas.height;
            h -= diff;
        }

        if ( x + this.drawingCanvas.width > this.bufferCanvas.width)
        {
            var diff = (x + this.drawingCanvas.width)-this.bufferCanvas.width;
            w -= diff;
        }

        //ctx.drawImage(this.bufferCanvas, -300, -300, this.drawingCanvas.width, this.drawingCanvas.height);

        ctx.drawImage(this.bufferCanvas, 
            x,
            y,
            w,
            h,
             0, 
            -5,
            w,
            h
            
            );
        this.drawBoard(ctx);
        
        // this.drawingCanvasContext.drawImage(this.bufferCanvas, 2, -6)
    };
    //function consolar() {
//    var terrainBody = GameInstance.terrain.world.m_island.m_bodies.filter(x => x != null).filter(x => x.GetUserData() instanceof Terrain)[0];
//    console.log({ lower: Physics.vectorMetersToPixels(terrainBody.GetFixtureList().GetAABB().lowerBound), upper: Physics.vectorMetersToPixels(terrainBody.GetFixtureList().GetAABB().upperBound) }, "terrainBody");
//    var wormBody = GameInstance.terrain.world.m_island.m_bodies.filter(x => x != null).filter(x => x.GetUserData() instanceof Worm)[0];
//    console.log({ lower: Physics.vectorMetersToPixels(wormBody.GetFixtureList().GetAABB().lowerBound), upper: Physics.vectorMetersToPixels(wormBody.GetFixtureList().GetAABB().upperBound) }, wormBody.GetUserData().name);
//    Physics.world.QueryAABB((fixture) => {

//        if (fixture.GetBody().GetType() == b2Body.b2_staticBody && fixture.GetBody().GetUserData() instanceof Terrain) {
//            console.log({ lower: Physics.vectorMetersToPixels(fixture.GetAABB().lowerBound), upper: Physics.vectorMetersToPixels(fixture.GetAABB().upperBound) }, "fixture");
//        }

//        return true;
//    }, terrainBody.GetFixtureList().GetAABB());

//}
    
    drawBoard(ctx: CanvasRenderingContext2D) {
        //grid width and height
        var bw = this.getWidth();
        var bh = this.getHeight();
        //padding around grid
        var p = 10;

        for (var x = 0; x <= bw; x += 40) {
            ctx.moveTo(0.5 + x + p, p);
            ctx.lineTo(0.5 + x + p, bh + p);
        }


        for (var x = 0; x <= bh; x += 40) {
            ctx.moveTo(p, 0.5 + x + p);
            ctx.lineTo(bw + p, 0.5 + x + p);
        }

        ctx.strokeStyle = "red";
        ctx.stroke();
    }

}