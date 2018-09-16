/**
 * The name generator gets a list of famous programmers from wikipeda and randomly assigns them to worms
 *
 */
///<reference path="Utilies.ts" />


module NameGenerator
{
    //defaults
    var randomNamesList = [
                   "Anders Hejlsberg", "Ted Henter", "Andy Hertzfeld", "Rich Hickey", "Grace Hopper", "Dave Hyatt", "Miguel de Icaza", "Roberto Ierusalimschy", "Dan Ingalls", 
                   "Toru Iwatani", "Bo Jangeborg", "Paul Jardetzky", "Lynne Jolitz", "William Jolitz", "Bill Joy", "Mitch Kapor", "Phil Katz", "Alan Kay", "Mel Kaye",
                    "Brian Kernighan", "Dennis Ritchie", "Jim Knopf", "Andre LaMothe", "Leslie Lamport", "Butler Lampson", "Sam Lantinga", "Chris Lattner", "Samuel J Leffler", 
                    "Rasmus Lerdorf", "Linus torvalds"
                ]

    export const randomName = () =>
    {
        if (randomNamesList.length == 0)
            return "Error with genertor";
        return Utilies.pickUnqine(randomNamesList, "names");
    }

}