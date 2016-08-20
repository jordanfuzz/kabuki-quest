let charm = require('charm')()
let readline = initializeConsole()
let currentLocation
let player = {
    inventory: []
}

let directions = {
    n: 'North',
    e: 'East',
    s: 'South',
    w: 'West'
}
let lantern = {
    name: 'lantern',
    isLanternLit: false,
    actions: {
        light: (response) => {
            if (player.inventory.includes(oil)){
                lantern.isLanternLit = true
                hallway.description = 'You are standing in the hallway, which is dark except \n\tfor the light cast from the lantern.  There are several\n\tpaintings on the walls.  There is a door at the far end of the hallway.'
                hallway.exits.n = hallwayNorth
                writeHeader(currentLocation, 'You light the lantern.')
            }
            else {
                writeHeader(currentLocation, 'You don\'t have any oil!')
            }
        }
    }
}
let shovel = {
    name: 'shovel',
    actions: []
}
let oil = {
    name: 'oil',
    actions: []
}
let key = {
    name: 'key',
    actions: []
}
let jim = {
    name: 'Jim',
    actions: []
}

let forest = {
    name: 'Forest',
    description: 'You are in a dense forest with a small path headed north.',
    items: [key, shovel],
    exits: {},
    actions: []
}
let shed = {
    name: 'Shed',
    description: 'You are standing in a shed, there is a door that opens to the South',
    items: [lantern],
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
        unlock: (item) => {
            if (item !== 'gate') {
                writeHeader(currentLocation, 'Unlock what?')
                return
            }
            if (player.inventory.includes(key)) {
                mansionGate.isGateLocked = false
                writeHeader(currentLocation, 'You unlock the gate.')
            }
            else
                writeHeader(currentLocation, 'You don\'t have a key!')
        },
        open: (item) => {
            if (item !== 'gate'){
                writeHeader(currentLocation, 'Open what?')
                return
            }
            if (mansionGate.isGateLocked){
                writeHeader(currentLocation, 'It\'s locked.')
            }
            else{
                mansionGate.exits.e = mansion
                mansion.exits.w = mansionGate
                writeHeader(currentLocation, 'You open the gate.')
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
    items: [oil],
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
    description: 'You are in a lovely ballroom.  The lighting is excellent.  You found Jim.  You win.',
    items: [jim],
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

currentLocation = forest

writeHeader(currentLocation, 'You wake up lying on your back.  You are in a forest.')
prompt()

function prompt() {
    readline.question('> ', handleResponse)
}

function handleResponse(response) {
    response = response.toLowerCase()

    if (directions[response]) {
        handleNavigation(response)
    }
    else if (response === 'bye') {
        process.exit()
    }
    else if (response === 'look') {
        handleLook()
    }
    else if (response === 'inv' || response === 'inventory'){
        viewInventory()
    }
    else if (response.substring(0,4) === 'take') {
        handleTake(response.substring(5))
    }
    else if (response.substring(0,4) === 'drop'){
        handleDrop(response.substring(5))
    }
    else {
        let handled = handleLocationAction(response)

        if (!handled)
            handled = handleItemAction(response)

        if (!handled)
            writeHeader(currentLocation, 'I don\'t know how to ' + response)
    }
    prompt()
}

function handleNavigation(direction){
    if (currentLocation.exits[direction]) {
        currentLocation = currentLocation.exits[direction]
        writeHeader(currentLocation)
    }
    else {
        writeHeader(currentLocation, 'You cannot go ' + directions[direction])
    }
}

function handleLocationAction(response) {
    let actions = Object.keys(currentLocation.actions)
    let command, item
    let spaceIndex = response.indexOf(' ')

    if (spaceIndex != -1) {
        command = response.substring(0, spaceIndex)
        item = response.substring(spaceIndex + 1)
    }
    else {
        command = response
    }

    if (actions.includes(command)) {
        currentLocation.actions[command](item)
        return true
    }
    else {
        return false
    }
}

function handleItemAction(response) {
    let command = response.substring(0, response.indexOf(' '))
    let item = player.inventory.find(item => Object.keys(item.actions).includes(command))
    if (item) {
        item.actions[command]()
        return true
    }
    else {
        return false
    }
}

function handleLook() {
    if (currentLocation.items.length === 0){
        writeHeader(currentLocation, 'There is nothing interesting here.')
    }
    else {
        let itemList = ''
        currentLocation.items.forEach(item => itemList += ', a ' + item.name)
        itemList = itemList.substring(2)
        writeHeader(currentLocation, 'You see: ' + itemList)
    }
}

function viewInventory() {
    if (player.inventory.length === 0){
        writeHeader(currentLocation, 'You got nothin\', bro.')
    }
    else {
        let itemList = ''
        player.inventory.forEach(item => itemList += ', a ' + item.name)
        itemList = itemList.substring(2)
        writeHeader(currentLocation, 'You\'re carrying: ' + itemList)
    }
}

function handleTake(response) {
    let item = currentLocation.items.find(item => item.name === response)
    if (!item) {
        writeHeader(currentLocation, 'There is no ' + response + ' here.')
    }
    else {
        player.inventory.push(item)
        let index = currentLocation.items.indexOf(item)
        currentLocation.items.splice(index, 1)
        writeHeader(currentLocation, 'You take the ' + item.name + '.')
    }

}

function handleDrop(response) {
    let item = player.inventory.find(item => item.name === response)
    if (!item) {
        writeHeader(currentLocation, 'You don\'t have a ' + response + '.')
    }
    else {
        currentLocation.items.push(item)
        let index = player.inventory.indexOf(item)
        player.inventory.splice(index, 1)
        writeHeader(currentLocation, 'You drop the ' + item.name + '.')
    }

}

function showExits(){
    let exits = ''
    Object.keys(currentLocation.exits).forEach(direction => {
        exits += directions[direction] + ', '
    })
    exits = exits.substring(0, exits.length - 2)
    return exits
}

function writeHeader(location, ...lines) {
    charm.erase('screen')
    charm.foreground('cyan')
    charm.position(0,3)
    charm.write('Location: ' + location.name + '\n')
    charm.write('Exits: ' + showExits() + '\n')
    charm.write('Description: ' + location.description + '\n\n')
    charm.foreground('yellow')
    lines.forEach((line) => charm.write(line+'\n'))
    charm.foreground('cyan')
    charm.write('\n--------------------------------------------------------------------------------')
    charm.position(0,30)
}

function initializeConsole() {
    let readline = require('readline')
    let rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })

    charm.pipe(process.stdout)
    charm.reset()
    charm.foreground('cyan')
    return rl;
}

function printLine(someString) {
    charm.write(line+'\n')
}