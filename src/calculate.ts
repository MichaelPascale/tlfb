/*
*   calculate.js
*   Calculate various metrics on the timeline follow-back data.
*/

import { UseEvent, CalendarEvent } from "./state";
import { CVT_MS_DAY } from "./constants";


function calc_use_days(eventlist: Array<CalendarEvent>, category: string, include_unknown: boolean): Array<string> {

    let use_days: Set<string> = new Set();
    let use_days_amount: Set<string> = new Set();

    for (let event of eventlist) {
            if((event as UseEvent).properties.category === category){
                use_days.add(event.date.substring(0,10));

                if ((event as UseEvent).properties.amount != "unknown") {
                    use_days_amount.add(event.date.substring(0,10));
                }
            } 
    }

    if (include_unknown) {
        return Array.from(use_days);
    } else {
        return Array.from(use_days_amount);
    }
   
}

export function calc_days_used(eventlist: Array<CalendarEvent>, category: string) {

    let use_days = calc_use_days(eventlist, category, true);

    return use_days.length;
}

// Used to calculate number of days where amount used is known.
export function calc_days_used_amount(eventlist: Array<CalendarEvent>, category: string) {

    let use_days = calc_use_days(eventlist, category, false);

    return use_days.length;
}

export function calc_total_occasions(eventlist: Array<CalendarEvent>, category: string) {

    let total = 0;

    for (let event of eventlist) {
        if((event as UseEvent).properties.category === category){
            total+=Number((event as UseEvent).properties.times)
        } 
    }

    return total;
}

/* For a particular substance and unit of that substance, return the total
 * amount used.
 */
export function calc_total_units(eventlist: Array<CalendarEvent>, substance: string, units: string) {

    let total = 0;

    for (let event of eventlist) {
        if ((event as UseEvent).properties.substance == substance && 
            (event as UseEvent).properties.units == units &&
            (event as UseEvent).properties.amount != "unknown")
            total = total + Number((event as UseEvent).properties.amount);
    }

    return total;
}

export function calc_days_since_last_use(eventlist: Array<CalendarEvent>, category: string, date : string) {
    let use_days_str: Array<string> = calc_use_days(eventlist, category, true);

    if (use_days_str.length < 1)
        return NaN;

    let last_day = use_days_str.reduce(function(acc, cur) {
        let d = new Date(cur);
        return (d > acc) ? d : acc;
    }, new Date(use_days_str[0]));

    return (((new Date(date)).valueOf() - last_day.valueOf()) / CVT_MS_DAY)
}
