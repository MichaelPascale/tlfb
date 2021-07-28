/*
    calculate.js
    Calculate various metrics on the timeline-followback data.
*/

function calc_days_used(eventlist, category) {

    let days_used = new Set();

    for (let event of eventlist) {
        if (event.extendedProps.category == category)
            days_used.add(event.start.toDateString());
    }

    return days_used.size;
}

function calc_total_occasions(eventlist, category) {

    let total = 0;

    for (let event of eventlist) {
        if (event.extendedProps.category == category)
            total = total + Number(event.extendedProps.occasions);
    }

    return total;
}

/* For a particular substance and unit of that substance, return the total
 * amount used.
 */
function calc_total_units(eventlist, substance, units) {

    let total = 0;

    for (let event of eventlist) {
        if (event.extendedProps.substance == substance && event.extendedProps.units == units)
            total = total + (Number(event.extendedProps.occasions) * Number(event.extendedProps.amount));
    }

    return total;
}