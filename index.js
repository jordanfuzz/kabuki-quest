let charm = require('charm')()
let readline = initializeConsole();
let currentLocation

let directions = {
    n: 'North',
    e: 'East',
    s: 'South',
    w: 'West'
}

let forest = {
    name: 'Forest',
    description: 'You are in a dense forest with a small path headed north.'
}
let shed = {
    name: 'Shed',
    description: 'You are standing in a shed, there is a door that opens to the South'
}
let forestEast = {
    name: 'Forest',
    description: 'The forest isn\'t as dense here.  There is a deep well in front of \n\tyou. You can see a building to the east.'
}

forest.n = shed
shed.s = forest
forest.e = forestEast
forestEast.w = forest

currentLocation = forest

writeHeader(currentLocation, 'You wake up lying on your back.  You are in a forest.', 'Second line', 'Third line')
prompt()

function prompt() {
    readline.question('> ', handleResponse)
}

function handleResponse(response) {
    if (directions[response]) {
        handleNavigation(response)
    }
    else{
        writeHeader(currentLocation, 'You said: ' + response)
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

function writeHeader(location, ...lines) {
    charm.erase('screen')
    charm.position(0,3)
    charm.write('Location: ' + location.name + '\n')
    charm.write('Description: ' + location.description + '\n')
    lines.forEach((line) => charm.write(line+'\n'))
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
