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
    name: 'lantern'
}
let shovel = {
    name: 'shovel'
}
let key = {
    name: 'key'
}

let forest = {
    name: 'Forest',
    description: 'You are in a dense forest with a small path headed north.',
    items: [key, shovel],
    actions: []
}
let shed = {
    name: 'Shed',
    description: 'You are standing in a shed, there is a door that opens to the South',
    items: [lantern],
    actions: []
}
let forestEast = {
    name: 'Forest',
    description: 'The forest isn\'t as dense here.  There is a deep well in front of \n\tyou. You can see a building to the east.',
    items: [],
    actions: []
}
let mansionGate = {
    name: 'Mansion Gate',
    description: 'You see a giant gate, there is a mansion behind the gate.',
    items: [],
    actions: {
        unlock: (response) => { 
            if (!player.inventory.includes(key)) {
                mansionGate.e = mansion
                writeHeader(currentLocation, 'You unlock the gate.')
            }

            else
                writeHeader(currentLocation, 'You don\'t have a key!')
        },
        open: () => { return 'you can\t open the gate, it\s locked' }
    }
}
let mansion = {
    name: 'Mansion',
    description: 'You are at the mansion',
    items: [],
    actions: []
}

forest.n = shed
shed.s = forest
forest.e = forestEast
forestEast.w = forest
forestEast.e = mansionGate

currentLocation = forest

writeHeader(currentLocation, 'You wake up lying on your back.  You are in a forest.', 'Second line', 'Third line')
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
        if (!handleAction(response))
            writeHeader(currentLocation, 'I don\'t know how to ' + response)
        else
            handleAction(response)
    }
    prompt()
}

function handleNavigation(direction){
    if (currentLocation[direction]) {
        currentLocation = currentLocation[direction]
        writeHeader(currentLocation)
    }
    else {
        writeHeader(currentLocation, 'You cannot go ' + directions[direction])
    }
}

function handleAction(response) {
    let actions = Object.keys(currentLocation.actions)
    let command = response.substring(0, response.indexOf(' '))
    console.log(actions, command)
    if (actions.includes(command)) {
        currentLocation.actions[command]()
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


function writeHeader(location, ...lines) {
    charm.erase('screen')
    charm.foreground('cyan')
    charm.position(0,3)
    charm.write('Location: ' + location.name + '\n')
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