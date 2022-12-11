/* index.ts
 *
 * Maintained by Michael Pascale <mppascale@mgh.harvard.edu>
 * Last modified: 2022-12-09
 */
import $ from 'jquery';
import dayjs from 'dayjs';
import dayjs_plugin_duration from 'dayjs/plugin/duration';
import dayjs_plugin_customParseFormat from 'dayjs/plugin/customParseFormat';
import { Calendar } from '@fullcalendar/core'

var tlfb_calendar;
var tlfb_date_start = '2022-10-01';
var tlfb_date_end = '2022-12-08';
var tlfb_events;

$(document).ready(function () {
    dayjs.extend(dayjs_plugin_duration);
    dayjs.extend(dayjs_plugin_customParseFormat);

    // Initialize the FullCalendar object.
    tlfb_calendar = new Calendar($("#calendar")[0], {
        initialView: "dayGridMonth",
        validRange: {
            start: tlfb_date_start,
            end: tlfb_date_end
        },
        editable: true,
        // dateClick: dateClick,
        // eventClick: eventClick,
        // select: dateSelect,
        showNonCurrentDates: false,
        fixedWeekCount: true
    });

    tlfb_calendar.render();
});