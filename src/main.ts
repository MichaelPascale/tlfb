/* main.ts
 *
 * Entry point to the timeline followback application.
 *
 * Copyright (c) 2024, Michael Pascale <mppascale@mgh.harvard.edu>
 *                     Ivy Zhu <izhu1@mgh.harvard.edu>
 * Last modified: 2024-08-16
 */

//?subject=QO10A&start=2022-07-15&end=2022-08-09&keyfield=record_id
//&record=66&event=pilot_v6_20wk_arm_2&pid=28955

// ?subject=[pilot_v0_screening_arm_2][record_cam_id]
// &start=[tlfb_start_date]
// &end=[tlfb_end_date]
// &keyfield=record_id


import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

import { Editor } from './editor'
import { File } from './file'

import { TLFBProperties, SubstanceList } from './types'

import * as util from './util'
import { VERSION, CVT_MS_DAY, CAL_HEIGHT_DIFF, RGX_INTEGER, RGX_WORD, RGX_DATE } from './constants';


function get_url_properties() {
    // Fill in those properties defined in the URL query string.
    const query = new URLSearchParams(window.location.search);

    const props: {[key: string]: any}= {};

    const possible = [
        // REDCap bookmark links will add the record, event, and project ID.
        {name: 'record',    to: 'record',    validator: RGX_INTEGER},
        {name: 'pid',       to: 'pid',       validator: RGX_INTEGER},
        {name: 'event',     to: 'timepoint', validator: RGX_WORD},

        {name: 'subject',   to: 'subject',   validator: RGX_WORD},
        {name: 'start',     to: 'start',     validator: RGX_DATE},
        {name: 'end',       to: 'end',       validator: RGX_DATE},
        {name: 'keyfield',  to: 'keyfield',  validator: RGX_WORD},

        {name: 'staff',     to: 'staff',     validator: RGX_WORD},
    ]

    const missing_params: string[] = []
    
    for (const param of possible) {
        if (query.has(param.name)) {
            if (query.get(param.name) === "") {
                missing_params.push(param.name)
            } else 
            if (!param.validator.test(query.get(param.name)!)){
                // check if dates are entered in yyyy-mm-dd or mm-dd-yyyy format
                if ((param.to === "start" || param.to === "end") 
                     && query.get(param.name)![2] === "-") { // in mm-dd-yyyy format
                    const date_components = query.get(param.name)!.split("-")
                    console.log(date_components)
                    props[param.to] = date_components[2] + "-" + date_components[0] + "-" + date_components[1]
                } else {
                    alert(`${param.name} misspecified in the URL query.`)}
                }
            else    
                props[param.to] = query.get(param.name)!
                   
            // query.delete(param.name)
        } else {
            missing_params.push(param.name)
        }
    }

    if ((props.record || props.pid || props.timepoint) &&
        !(props.record && props.pid && props.timepoint))
        alert('Some but not all REDCap parameters received. REDCap may be misconfigured.')

    // query.forEach((_, key)=>alert(`Unknown parameter specified in URL query: ${key}`))
    
    return [props, missing_params]
}

export function update_properties(properties: TLFBProperties, updated: (object | TLFBProperties)) {
    Object.assign(properties, updated)
    
    const days_apart = ((new Date(properties.end)).valueOf() - (new Date(properties.start)).valueOf()) / CVT_MS_DAY + 1

    properties.days = days_apart

    // Modify title
    const event_title = properties.timepoint.split("_")
    const arm_index = event_title.findIndex(word => word === "arm")
    event_title.splice(arm_index + 1, 1)
    event_title.splice(arm_index, 1)
    const new_event_string = event_title.reduce((acc, cur) => {
        if (cur != "") {
            acc = acc + cur[0].toUpperCase() + cur.slice(1) + " "
        }
        return acc
    }, "")

    util.set_inner(
        'calendar-file-title',
        `${properties.pid} | ${properties.subject} / ${properties.record} at ${new_event_string}`
    )

    util.set_inner(
        'calendar-file-subtitle',
        `${properties.start} to ${properties.end} (${days_apart} Days)`
    )

    // Update URL
    const property_params = [
        {name: 'record',    to: 'record'},
        {name: 'pid',       to: 'pid'},
        {name: 'event',     to: 'timepoint'},
        {name: 'subject',   to: 'subject'},
        {name: 'start',     to: 'start'},
        {name: 'end',       to: 'end'},
        {name: 'keyfield',  to: 'keyfield'},
        {name: 'staff',     to: 'staff'},
    ]

    const query = new URLSearchParams(window.location.search);

    property_params.forEach((param) => {
        query.set(param.name, updated[param.to as keyof typeof updated]);
    })

    const base_url = window.location.href.split("?")[0]
    history.replaceState(base_url, document.title, "?" + query.toString());
}
    
document.addEventListener('DOMContentLoaded', function() {

    const tlfb_properties: TLFBProperties = {
        subject: '',
        record: '',
        timepoint: '',
        pid: '',
        start: '',
        end: '',
        keyfield: '',
        staff: '',
        days: 0
    }

    const url_tlfb_properties = get_url_properties()[0]
    const missing_tlfb_properties = get_url_properties()[1] as string[]

    update_properties(tlfb_properties, url_tlfb_properties);

    const calendarEl: HTMLElement = document.getElementById('calendar')!;

    // FullCalendar end dates are exclusive, add one day so end date shows up
    const end_day_after = new Date(tlfb_properties.end)
    end_day_after.setDate(end_day_after.getDate() + 1)

    const calendar = new Calendar(calendarEl, {
        plugins: [ interactionPlugin, dayGridPlugin ],
        initialView: "dayGridMonth",
        validRange: {
            start: tlfb_properties.start,
            end: end_day_after.toISOString().split("T")[0]
        },

        headerToolbar: {
            left: 'title',
            right: 'prev,next'
        },

        editable: false,
        selectable: true,
        showNonCurrentDates: false,
        fixedWeekCount: true,

        // aspectRatio: 2,
        height: window.innerHeight - CAL_HEIGHT_DIFF,

        // dateClick: fc.click_date,
        // eventClick: fc.click_event,
        // select: fc.select_daterange

    });

    calendar.render();

    util.set_inner('application-version-title', `Timeline-Followback v${VERSION}`);

    const editor = new Editor(calendar);
    const file = new File(tlfb_properties, calendar, editor)

    // Pull up properties modal if there's any missing data from REDCap
    if (missing_tlfb_properties.length > 0) {
        file.missing_properties_warn(missing_tlfb_properties)
    }

    // Populate options for substance list modal
    const _substance_list: SubstanceList = require('../substances.json');
    const _substance_form: Element = document.getElementById("substance-form")!;

    _substance_list.category.forEach(el => {
        _substance_form.insertAdjacentHTML(
            'beforeend',
            `<h5 class="pt-5">${el.label}</h5>`
        );

        _substance_list.substance[el.id].forEach((element, index) => {
            const label = (element.hasOwnProperty('alt')) ? element.label + " (" + element.alt + ")" : element.label 
            _substance_form.insertAdjacentHTML(
                'beforeend',
                `<input class="substance-list" type="checkbox" id="${index.toString() + el.id}" name="${index.toString() + el.id}" 
                value="${index.toString()} ${el.id}">
                <label for="${index.toString() + el.id}">${label}</label><br>`
            );
        });
    });

    // 
    window.addEventListener('resize', function() {
        // Resize just happened, pixels changed
        calendar.setOption('height', window.innerHeight - CAL_HEIGHT_DIFF);
    });
    
});
