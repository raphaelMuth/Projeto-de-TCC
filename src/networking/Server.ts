/**
 *  
 * Server.js
 *
 *  License: Apache 2.0
 *  author:  Ciarán McCann
 *  url: http://www.ciaranmccann.me/
 */
//<reference path="../../external/socket.io-0.9.d.ts"/>
////<reference path="BandwidthMonitor.ts"/>
declare var require
declare var Util;

//var io;

// HACK
// Had to give up the benfits of types in this instance, as a problem with the way ES6 proposal module system
// works with Node.js modules. http://stackoverflow.com/questions/13444064/typescript-conditional-module-import-export


class GameServer
{
    

    constructor (port)
    {   
    }

    init()
    {
    }

}


declare var exports: any;
var serverInstance = new GameServer(8080);

exports.instance = serverInstance;
