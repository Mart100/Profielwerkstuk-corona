function ticksToDays(ticks) {
    let days = Math.floor(ticks/options.dayLength)
    return days
}

function daysToTicks(days) {
    let ticks = days*options.dayLength
    return ticks
}