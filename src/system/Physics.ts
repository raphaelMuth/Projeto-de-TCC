/**
 * This namespace holes the box2d physics world and scale. It provides helper convert methods
 * to increase codebase readablity. It also mangaes the global box2d contactlistner.
 *
 */

///<reference path="../Game.ts"/>
///<reference path="Utilies.ts" />

// Throws to many errors to use
//<reference path="../../external/box2dweb-2.1.d.ts" />

declare var Box2D;
//Global defining of shortened names for box2d types
var b2Vec2 = Box2D.Common.Math.b2Vec2,
    b2BodyDef = Box2D.Dynamics.b2BodyDef,
    b2Body = Box2D.Dynamics.b2Body,
    b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
    b2Fixture = Box2D.Dynamics.b2Fixture,
    b2World = Box2D.Dynamics.b2World,
    b2MassData = Box2D.Collision.Shapes.b2MassData,
    b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
    b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
    b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
    b2AABB = Box2D.Collision.b2AABB,
    b2ContactListener = Box2D.Dynamics.b2ContactListener,
    b2RayCastInput = Box2D.Collision.b2RayCastInput,
    b2DistanceJointDef = Box2D.Dynamics.Joints.b2DistanceJointDef,
    b2RayCastOutput = Box2D.Collision.b2RayCastOutput,
    b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef,
    b2RevoluteJoint = Box2D.Dynamics.Joints.b2RevoluteJoint,
    b2SimplexVertex = Box2D.Collision.b2SimplexVertex,
    b2WorldManifold = Box2D.Collision.b2WorldManifold,
    b2Shape = Box2D.Collision.Shapes.b2Shape;



module Physics
{

    export var worldScale;
    export var world;
    export var debugDraw;

    // For fast acess to all bodies that aren't the terrain
    export var fastAcessList = [];
    export const addToFastAcessList = (body) =>
    {
        fastAcessList.push(body);
    }

    export const removeToFastAcessList = (body) =>
    {
        for (var b in fastAcessList)
        {
            if (fastAcessList[b] === body)
            {
                Utilies.deleteFromCollection(fastAcessList, b);
            }
        }
    }


    export const init = (ctx) =>
    {
        Physics.worldScale = 30;

        // Creating our physics world.
        Physics.world = new b2World(
            new b2Vec2(0, 10),//gravity
            true //allow sleep
        );
        
        //Setting up debug drawing of the physics world
        debugDraw = new b2DebugDraw();
        debugDraw.SetSprite(ctx);
        debugDraw.SetDrawScale(Physics.worldScale);
        debugDraw.SetFillAlpha(0.3);
        debugDraw.SetLineThickness(1.0);
        //debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit | b2DebugDraw.e_aabbBit);
        debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
        //debugDraw.SetFlags( b2DebugDraw.e_aabbBit);
        world.SetDebugDraw(debugDraw);


        // This sets up the world contact listenre
        // when their is a contact we get the user data from the
        // two bodies that are in contact. In the construction of these bodies
        // I have set the this pionter as the user data, which allows me to then call methods
        // on that class as we can see below.
        var listener = new b2ContactListener();
        listener.BeginContact = (contact) =>
        {
            if (contact.GetFixtureA().GetBody().GetUserData() != null &&
                contact.GetFixtureA().GetBody().GetUserData().beginContact != null)
            {
                contact.GetFixtureA().GetBody().GetUserData().beginContact(contact);
            }

            if (contact.GetFixtureB().GetBody().GetUserData() != null &&
                contact.GetFixtureB().GetBody().GetUserData().beginContact != null)
            {
                contact.GetFixtureB().GetBody().GetUserData().beginContact(contact);
            }
        }


        listener.EndContact = (contact) =>
        {
            if (contact.GetFixtureA().GetBody().GetUserData() != null &&
                contact.GetFixtureA().GetBody().GetUserData().endContact != null)
            {
                contact.GetFixtureA().GetBody().GetUserData().endContact(contact);
            }

            if (contact.GetFixtureB().GetBody().GetUserData() != null &&
                contact.GetFixtureB().GetBody().GetUserData().endContact != null)
            {
                contact.GetFixtureB().GetBody().GetUserData().endContact(contact);
            }
        }

        listener.PostSolve = (contact,impulse) =>
        {
            if (contact.GetFixtureA().GetBody().GetUserData() != null &&
                contact.GetFixtureA().GetBody().GetUserData().postSolve != null)
            {
                contact.GetFixtureA().GetBody().GetUserData().postSolve(contact,impulse);
            }

            if (contact.GetFixtureB().GetBody().GetUserData() != null &&
                contact.GetFixtureB().GetBody().GetUserData().postSolve != null)
            {
                contact.GetFixtureB().GetBody().GetUserData().postSolve(contact,impulse);
            }

        }

        listener.PreSolve = (contact) =>
        {
            if (contact.GetFixtureA().GetBody().GetUserData() != null &&
                contact.GetFixtureA().GetBody().GetUserData().preSolve != null)
            {
                contact.GetFixtureA().GetBody().GetUserData().preSolve(contact);
            }

            if (contact.GetFixtureB().GetBody().GetUserData() != null &&
                contact.GetFixtureB().GetBody().GetUserData().preSolve != null)
            {
                contact.GetFixtureB().GetBody().GetUserData().preSolve(contact);
            }

        }

        world.SetContactListener(listener);
    }

    //Checks if the collison is between an obj of type1 and an obj of type2
    export const isCollisionBetweenTypes = (objType1, objType2, contact) =>
    {
        var obj1 = contact.GetFixtureA().GetBody().GetUserData();
        var obj2 = contact.GetFixtureB().GetBody().GetUserData();

        if (
            (obj1 instanceof objType1 || obj1 instanceof objType2)
            &&
            (obj2 instanceof objType1 || obj2 instanceof objType2)
          )
        {
            return true;
        } else
        {
            return false;
        }
    }

    export const shotRay = (startPiontInMeters, endPiontInMeters) =>
    {
        var input = new b2RayCastInput();
        var output = new b2RayCastOutput();
        var intersectionPoint = new b2Vec2();
        var normalEnd = new b2Vec2();
        var intersectionNormal = new b2Vec2();

        endPiontInMeters.Multiply(30);
        endPiontInMeters.Add(startPiontInMeters);

        input.p1 = startPiontInMeters;
        input.p2 = endPiontInMeters;
        input.maxFraction = 1;
        var closestFraction = 1;
        var bodyFound = false;

        var b = new b2BodyDef();
        var f = new b2FixtureDef();
        for (b = Physics.world.GetBodyList(); b; b = b.GetNext())
        {
            for (f = b.GetFixtureList(); f; f = f.GetNext())
            {
                if (!f.RayCast(output, input))
                    continue;
                else if (output.fraction < closestFraction && output.fraction > 0)
                    {
                        //Fixes bug where I was getting extremely small e numbers
                        // in the lower sections of the physics world. It was causing the
                        // ray to shot only a small disntance from the orign of it.
                        if (output.fraction > 0.001)
                        {
                            closestFraction = output.fraction;
                            intersectionNormal = output.normal;
                            bodyFound = true;
                        }
                }
            }

        }
        intersectionPoint.x = startPiontInMeters.x + closestFraction * (endPiontInMeters.x - startPiontInMeters.x);
        intersectionPoint.y = startPiontInMeters.y + closestFraction * (endPiontInMeters.y - startPiontInMeters.y);

        if (bodyFound)
        {
            return intersectionPoint;
        }

        return null;
    }

    export const applyToNearByObjects = (epicenter, effectedRadius, funcToApplyToEach) =>
    {
        var aabb = new b2AABB();
        aabb.lowerBound.Set(epicenter.x - effectedRadius, epicenter.y - effectedRadius);
        aabb.upperBound.Set(epicenter.x + effectedRadius, epicenter.y + effectedRadius);

        Physics.world.QueryAABB( (fixture) =>
        {
            funcToApplyToEach(fixture, epicenter);
            return true;

        }, aabb);
    }

    //Converts pixels to physic world measurement
    export const pixelToMeters = (pixels: number) =>
    {
        return pixels / worldScale;
    }

    //Converts physic world measurement to pixels;
    export const metersToPixels = (meters: number) =>
    {
        return meters * worldScale;
    }

    //Converts a vector in pixels to physic world measurement
    export const vectorPixelToMeters = (vPixels) =>
    {
        return new b2Vec2(vPixels.x / worldScale, vPixels.y / worldScale);
    }

    //Converts a vector in physic world measurement to pixels;
    export const vectorMetersToPixels = (vMeters) =>
    {
        return new b2Vec2(vMeters.x * worldScale, vMeters.y * worldScale);
    }

    export const bodyToDrawingPixelCoordinates = (body) =>
    {
        var pos = body.GetPosition();
        var radius = body.GetFixtureList().GetShape().GetRadius();

        pos.x -= radius;
        pos.y -= radius;

        return Physics.vectorMetersToPixels(pos);

    }

    export const euclideanDistance = (p: any, q: any)=> {
        return Math.sqrt(Math.pow(q.x - p.x, 2) - Math.pow(q.y - p.y, 2) )
    }


    export const getJustTerrainBodies = (): { upperLeft: any, upperRight: any, lowerLeft: any, lowerRight: any, body: any }[] => {
        var arrFiltered = []
        for (var b = Physics.world.GetBodyList(); b; b = b.GetNext()) {
            if (b.GetUserData() instanceof Terrain) {
                var pos = b.GetPosition();

                var upperLeft = pos.Copy();
                var upperRight = pos.Copy();
                var lowerLeft = pos.Copy();
                var lowerRight = pos.Copy();

                var shape = b.GetFixtureList().GetShape();

                var vertices = shape.GetVertices();
                upperLeft.Add(vertices[0]);
                upperRight.Add(vertices[1]);
                lowerLeft.Add(vertices[2]);
                lowerRight.Add(vertices[3]);

                arrFiltered.push({
                    upperLeft: Physics.vectorMetersToPixels(upperLeft),
                    upperRight: Physics.vectorMetersToPixels(upperRight),
                    lowerLeft: Physics.vectorMetersToPixels(lowerLeft),
                    lowerRight: Physics.vectorMetersToPixels(lowerRight),
                    body: b
                });
            }
        }
        return arrFiltered;
    }

    // f é um callback
    export const groupBy = (xs, f) => {
        return xs.reduce((r, v, i, a, k = f(v)) => ((r[k] || (r[k] = [])).push(v), r), {});
    }

    export const terrainTopBodies = () => {
        var bodyLista = Physics.getJustTerrainBodies()
            .sort((a, b) => {
                var posA = a.body.GetPosition();
                var posB = b.body.GetPosition();
                return posA.x - posB.x || posA.y - posB.y
            });

        var grouped = Physics.groupBy(bodyLista, c => Math.floor(Physics.vectorMetersToPixels(c.body.GetPosition()).x));
        var topBodies = [];
        Object.keys(grouped).forEach(key => {

            var top = grouped[key].reduce((min, p) => p.body.GetPosition().y < min.body.GetPosition().y ? p : min, grouped[key][0]);

            if (top != null)
                topBodies.push(top);
        });
       
        return topBodies;
    }

    
}
