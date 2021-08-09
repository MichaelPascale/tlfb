/*
    calculate.js
    Calculate various metrics on the timeline follow-back data.
*/

function calc_use_days(eventlist, category) {

    let use_days = new Set();

    for (let event of eventlist) {
        if (event.extendedProps.category == category)
            use_days.add(event.start.toISOString().substring(0,10));
    }

    return Array.from(use_days);
}

function calc_days_used(eventlist, category) {

    let use_days = calc_use_days(eventlist, category);

    return use_days.length;
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