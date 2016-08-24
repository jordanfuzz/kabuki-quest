let charm = require('charm')()
let directions = require('./directions')

initializeConsole()

function writeHeader(currentLocation, ...lines) {
    charm.erase('screen')
    charm.foreground('cyan')
    charm.position(0,3)
    charm.write('Location: ' + currentLocation.name + '\n')
    charm.write('Exits: ' + showExits(currentLocation) + '\n')
    charm.write('Description: ' + currentLocation.description + '\n\n')
    charm.foreground('yellow')
    lines.forEach((line) => charm.write(line+'\n'))
    charm.foreground('cyan')
    charm.write('\n--------------------------------------------------------------------------------')
    charm.position(0,30)
}

function initializeConsole() {
    charm.pipe(process.stdout)
    charm.reset()
    charm.foreground('cyan')
}

function showExits(currentLocation){
    let exits = ''
    Object.keys(currentLocation.exits).forEach(direction => {
        exits += directions[direction] + ', '
    })
    exits = exits.substring(0, exits.length - 2)
    return exits
}


module.exports = writeHeader