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

function initializeReadline() {
    let readline = require('readline')
    let rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })
    return rl
}

