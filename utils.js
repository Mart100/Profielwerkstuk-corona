function ticksToDays(ticks) {
    let days = Math.floor(ticks/simulation.options.dayLength)
    return days
}

function daysToTicks(days) {
    let ticks = days*simulation.options.dayLength
    return ticks
}