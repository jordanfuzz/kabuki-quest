let items = require('./items')
let writeHeader = require('./game-console')
let world

let forest = {
    name: 'Forest',
    description: 'You are in a dense forest with a small path headed north.',
    items: [items.key, items.shovel],
    exits: {},
    actions: []
}
let shed = {
    name: 'Shed',
    description: 'You are standing in a shed, there is a door that opens to the South',
    items: [items.lantern],
    exits: {},
    actions: []
}
let forestEast = {
    name: 'Forest',
    description: 'The forest isn\'t as dense here.  There is a deep well in front of \n\tyou. You can see a building to the east.',
    items: [],
    exits: {},
    actions: []
}
let mansionGate = {
    name: 'Mansion Gate',
    description: 'You see a giant gate, there is a mansion behind the gate.',
    items: [],
    isGateLocked: true,
    exits: {},
    actions: {
        unlock: (item, inventory) => {
            if (item !== 'gate') {
                writeHeader(world.currentLocation, 'Unlock what?')
                return
            }
            if (inventory.includes(items.key)) {
                mansionGate.isGateLocked = false
                writeHeader(world.currentLocation, 'You unlock the gate.')
            }
            else
                writeHeader(world.currentLocation, 'You don\'t have a key!')
        },
        open: (item) => {
            if (item !== 'gate'){
                writeHeader(world.currentLocation, 'Open what?')
                return
            }
            if (mansionGate.isGateLocked){
                writeHeader(world.currentLocation, 'It\'s locked.')
            }
            else{
                mansionGate.exits.e = mansion
                mansion.exits.w = mansionGate
                writeHeader(world.currentLocation, 'You open the gate.')
            }
        }
    }
}
let mansion = {
    name: 'Mansion',
    description: 'You are at the front door of the mansion.',
    items: [],
    exits: {},
    actions: []
}
let foyer = {
    name: 'Foyer',
    description: 'You are standing in the mansion foyer.  The room is dark, but there \n\tis enough light coming through the windows to see.',
    items: [items.oil],
    exits: {},
    actions: []
}
let hallway = {
    name: 'Hallway',
    description: 'You are standing in the hallway.  It is too dark to proceed.  You can\n\tsee the dimly lit foyer to the south.',
    items: [],
    exits: {},
    actions: []
}
let hallwayNorth = {
    name: 'Hallway',
    description: 'You are in a dark hallway. There are doorways to the East and North.',
    items: [],
    exits: {},
    actions: []
}
let grandBallroom = {
    name: 'Grand Ballroom',
    description: 'You are in a lovely ballroom.  The lighting is excellent.  You found 12 hamsters.  You win.',
    items: [items.hamster],
    exits: {},
    actions: []
}
let smeagolRoom = {
    name: 'Smeagol Room',
    description: 'It\'s just you and Smeagol here.  You might want to leave.',
    items: [],
    exits: {},
    actions: []
}

forest.exits.n = shed
shed.exits.s = forest
forest.exits.e = forestEast
forestEast.exits.w = forest
forestEast.exits.e = mansionGate
mansionGate.exits.w = forestEast
mansion.exits.n = foyer
foyer.exits.s = mansion
foyer.exits.n = hallway
hallway.exits.s = foyer
hallwayNorth.exits.s = hallway
hallwayNorth.exits.n = grandBallroom
hallwayNorth.exits.e = smeagolRoom
grandBallroom.exits.s = hallwayNorth
smeagolRoom.exits.w = hallwayNorth

world = {
    forest,
    shed,
    forestEast,
    mansionGate,
    mansion,
    foyer,
    hallway,
    hallwayNorth,
    grandBallroom,
    smeagolRoom,
    currentLocation: forest
}

module.exports = world