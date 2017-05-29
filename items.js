let writeHeader = require('./game-console')

exports.lantern = {
    name: 'lantern',
    isLanternLit: false,
    actions: {
        light: (response, world, inventory) => {
            if (inventory.includes(exports.oil)){
                exports.lantern.isLanternLit = true
                world.hallway.description = 'You are standing in the hallway, which is dark except \n\tfor the light cast from the lantern.  There are several\n\tpaintings on the walls.  There is a door at the far end of the hallway.'
                world.hallway.exits.n = world.hallwayNorth
                writeHeader(world.currentLocation, 'You light the lantern.')
            }
            else {
                writeHeader(world.currentLocation, 'You don\'t have any oil!')
            }
        }
    }
}
exports.shovel = {
    name: 'shovel',
    actions: []
}
exports.oil = {
    name: 'oil',
    actions: []
}
exports.key = {
    name: 'key',
    actions: []
}
exports.hamster = {
    name: 'hamster',
    actions: []
}
