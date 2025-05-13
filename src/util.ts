/* util.ts
 *
 * Miscellanous helper functions
 *
 * Copyright (c) 2024, Michael Pascale <mppascale@mgh.harvard.edu>
 * Last modified: 2025-05-13
 */

import { CVT_MS_DAY_DST } from './constants';

// Set the InnerText of an element.
export function set_inner(id: string, text: string | NodeList) {
    const element = document.getElementById(id);
    
    if (element == null)
        throw new Error(`Failed to select element #${id}.`)

    if (text instanceof NodeList)
        text.forEach(x => element.appendChild(x));
    else
        element.innerText = text;
}

export function find_parent_modal(el: Element) {
    const modal = el.closest('.modal');

    if (modal == null)
        throw Error(`find_parent_modal: No modal found in ancestry of ${el}.`);

    return modal;
}

// Given a date string in YYYY-MM-DD format, calculate the following day.
// User specifies end date as last day of calendar but FullCalendar expects date range to be exclusive of the end date.
export function next_date(date: string) {
    const end_day_after = new Date(date)

    // manually add 25 hours by milliseconds to account for DST switch
    end_day_after.setMilliseconds(end_day_after.getMilliseconds() + CVT_MS_DAY_DST)

    return end_day_after.toISOString().split("T")[0]
}