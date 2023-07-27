/* main.ts
 *
 * Entry point to the timeline followback application.
 *
 * Copyright (c) 2023, Michael Pascale <mppascale@mgh.harvard.edu>
 * Last modified: 2023-07-27
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
import * as state from './state'

import * as util      from './util'
import { CVT_MS_DAY, CAL_HEIGHT_DIFF, RGX_INTEGER, RGX_WORD, RGX_DATE } from './constants'

type TLFBProperties = {
    subject:   string,
    record:    string,
    project:   string,
    timepoint: string,
    start:     string,
    end:       string
};

function get_url_properties() {
    // Fill in those properties defined in the URL query string.
    const query = new URLSearchParams(window.location.search);

    const props: {[key: string]: any}= {};
    
    // REDCap bookmark links will add the record, event, and project.

    const possible = [
        // REDCap bookmark links will add the record, event, and project.
        {name: 'record',  to: 'record',    validator: RGX_INTEGER},
        {name: 'pid',     to: 'project',   validator: RGX_INTEGER},
        {name: 'event',   to: 'timepoint', validator: RGX_WORD},

        {name: 'subject', to: 'subject',   validator: RGX_WORD},
        {name: 'start',   to: 'start',     validator: RGX_DATE},
        {name: 'end',     to: 'end',       validator: RGX_DATE},
    ]
    
    for (const param of possible) {
        if (query.has(param.name)) {
            if (!param.validator.test(query.get(param.name)!))
                alert(`${param.name} misspecified in the URL query.`)
            else
                props[param.to] = query.get(param.name)!
            
            query.delete(param.name)
        }
    }

    if ((props.record || props.project || props.timepoint) &&
        !(props.record && props.project && props.timepoint))
        alert('Some but not all REDCap parameters received. REDCap may be misconfigured.')

    query.forEach((_, key)=>alert(`Unknown parameter specified in URL query: ${key}`))

    console.log('props!', props)
    return props
}

function update_properties(properties: TLFBProperties, updated: (object | TLFBProperties)) {
    Object.assign(properties, updated)

    
    const days_apart = ((new Date(properties.end)).valueOf() - (new Date(properties.start)).valueOf()) / CVT_MS_DAY
    

    util.set_inner(
        'calendar-file-title',
        `${properties.subject} / ${properties.record} at ${properties.timepoint}`
    )

    util.set_inner(
        'calendar-file-subtitle',
        `${properties.start} to ${properties.end} (${days_apart} Days)`
    )
}


    
document.addEventListener('DOMContentLoaded', function() {

    // addEventListener('beforeunload', function (event) { event.preventDefault(); return (event.returnValue = ''); });

    const tlfb_properties: TLFBProperties = {
        subject: '',
        record: '',
        timepoint: '',
        project: '',
        start: '',
        end: ''
    }

    update_properties(tlfb_properties, {subject: 'MX347', record: '10', project: '3456', timepoint: 'redcap_arm_1_visit_1', start: '2023-06-18', end: '2023-07-15'})
    update_properties(tlfb_properties, get_url_properties());

    console.log(tlfb_properties)

    const calendarEl: HTMLElement = document.getElementById('calendar')!;

    const calendar = new Calendar(calendarEl, {
        plugins: [ interactionPlugin, dayGridPlugin ],
        initialView: "dayGridMonth",
        validRange: {
            start: tlfb_properties.start,
            end: tlfb_properties.end
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

    const editor = new Editor(calendar);

    window.addEventListener('resize', function() {
        //resize just happened, pixels changed
        calendar.setOption('height', window.innerHeight - CAL_HEIGHT_DIFF);
    });
    
});
