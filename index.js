let world = require('./world')
let writeHeader = require('./game-console')
let directions = require('./directions')
let readline = initializeReadline()

let player = {
    inventory: []
}


writeHeader(world.currentLocation, 'You wake up lying on your back.  You are in a forest.')

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
    else if (takeCommandLength(response) > 0) {
        handleTake(response.substring(takeCommandLength(response) + 1))
    }
    else if (dropCommandLength(response) > 0) {
        handleDrop(response.substring(dropCommandLength(response) + 1))
    }
    else if (response === 'help'){
        displayHelp()
    }
    else {
        let handled = handleLocationAction(response)

        if (!handled)
            handled = handleItemAction(response)

        if (!handled)
            writeHeader(world.currentLocation, 'I don\'t know how to ' + response)
    }
    prompt()
}

function handleNavigation(direction){
    if (world.currentLocation.exits[direction]) {
        world.currentLocation = world.currentLocation.exits[direction]
        writeHeader(world.currentLocation)
    }
    else {
        writeHeader(world.currentLocation, 'You cannot go ' + directions[direction])
    }
}

function handleLocationAction(response) {
    let actions = Object.keys(world.currentLocation.actions)
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
        world.currentLocation.actions[command](item, player.inventory)
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
        item.actions[command](response, world, player.inventory)
        return true
    }
    else {
        return false
    }
}

function handleLook() {
    writeHeader(world.currentLocation, world.currentLocation.advancedDefinition)
    if (world.currentLocation.items.length === 0){
        writeHeader(world.currentLocation, 'There is nothing interesting here.')
    }
    else {
        let itemList = ''
        world.currentLocation.items.forEach(item => itemList += ', a ' + item.name)
        itemList = itemList.substring(2)
        writeHeader(world.currentLocation, 'You see: ' + itemList)
    }
}

function viewInventory() {
    if (player.inventory.length === 0){
        writeHeader(world.currentLocation, 'You got nothin\', bro.')
    }
    else {
        let itemList = ''
        player.inventory.forEach(item => itemList += ', a ' + item.name)
        itemList = itemList.substring(2)
        writeHeader(world.currentLocation, 'You\'re carrying: ' + itemList)
    }
}

function handleTake(response) {
    let item = world.currentLocation.items.find(item => item.name === response)
    if (!item) {
        writeHeader(world.currentLocation, 'There is no ' + response + ' here.')
    }
    else {
        player.inventory.push(item)
        let index = world.currentLocation.items.indexOf(item)
        world.currentLocation.items.splice(index, 1)
        writeHeader(world.currentLocation, 'You take the ' + item.name + '.')
    }

}

function handleDrop(response) {
    let item = player.inventory.find(item => item.name === response)
    if (!item) {
        writeHeader(world.currentLocation, 'You don\'t have a ' + response + '.')
    }
    else {
        world.currentLocation.items.push(item)
        let index = player.inventory.indexOf(item)
        player.inventory.splice(index, 1)
        writeHeader(world.currentLocation, 'You drop the ' + item.name + '.')
    }

}

function takeCommandLength(response) {
    if (response.substring(0,4) === 'take') {
        return 4
    }
    else if (response.substring(0,7) === 'pick up') {
        return 7
    }
    else if (response.substring(0,4) === 'grab') {
        return 4
    }
    else {
        return 0
    }
}

function dropCommandLength(response) {
    if (response.substring(0,4) === 'drop') {
        return 4
    }
    else if (response.substring(0,8) === 'put down') {
        return 8
    }
    else if (response.substring(0,8) === 'set down') {
        return 8
    }
    else {
        return 0
    }
}

function displayHelp(){
    writeHeader(world.currentLocation, "Type n, e, s, or w to navigate around the world.", "Type \"look\" to look around you.")
}

function initializeReadline() {
    let readline = require('readline')
    let rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })
    return rl
}

