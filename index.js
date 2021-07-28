// Define Globals
var MODE = '';                  // Event-adding mode (substance event or key date).
var CAL = null;                 // The FullCalendar object.
var CUR_EVT = '';               // The calendar date currently being edited.
var SUBSTANCES = null;          // List of substances.
var SUBSTANCES_BY_CAT = null;   // List of substances by category.
var SUBSTANCE_CAT = null;       // List of substance categories.
var STUDES = null;              // List of studies.
var DATE_FROM = new Date();     // TLFB start date.
var DATE_TO = new Date();       // TLFB end date.
var DATE_30 = new Date();       // 30 days ago.
var DATE_90 = new Date();       // 90 days ago.
var SELECTED_SUBS = [];         // Substances selected in the substance list.

// Helper function. Return a substance object given its label.
function lookup_substance(label) {
    return SUBSTANCES.filter(function (x) {return x.label == label})[0];
}

// Helper function. Update the available substance list dropdown.
function update_substance_options() {
    let selector = $('#substance-event-substance');
    selector.empty();

    SELECTED_SUBS.forEach(label => {
        let sub = lookup_substance(label);
        selector.append(`<option value="${label}">${label} ${sub.alt ? '('+sub.alt+')' : ''}</option>`);
    });

    selector.trigger('change');
}

// Set event handler for when user clicks a calendar date.
function dateClick (ev){
    console.log('dateClick')
    CUR_EVT = ev;

    if (CUR_EVT.date < DATE_FROM || CUR_EVT.date > DATE_TO) {
        alert('The selected date is outside of the date range.');
        return;
    }

    switch (MODE) {
    case 'substance-event':
        if (!SELECTED_SUBS.length) {
            alert('Edit the substance list before adding a substance use event.');
            return;
        }
        update_substance_options();
        $('#substance-event-date').text(ev.date.toDateString());
        $('#form-substance-event')[0].reset();
        $('#substance-event-recurring').prop('disabled', false).trigger('change');
        $('#substance-event-recur-until').prop('min', CUR_EVT.date.toISOString().substr(0,10));
        $('#substance-event-recur-until').prop('max', DATE_TO.toISOString().substr(0,10));
        $('#modal-substance-event').addClass('is-active');
        $('#remove-substance-event').addClass('is-hidden');
        break;
    case 'key-event':
        $('#key-event-date').text(ev.date.toDateString());
        $('#form-key-event')[0].reset();
        $('#modal-key-event').addClass('is-active');
        $('#remove-key-event').addClass('is-hidden');
        break;
    }
};

// Set event handler for when user selects a range of calendar dates.
function dateSelect (ev){
    console.log('dateSelect')
    CUR_EVT = ev;

    if (CUR_EVT.start < DATE_FROM || CUR_EVT.end > DATE_TO) {
        alert('The selected date range extends beyond the allowed date range.');
        return;
    }

    if (MODE == 'key-event') {
        $('#key-event-date').text(`${ev.start.toDateString()} to ${ev.end.toDateString()}`);
        $('#form-key-event')[0].reset();
        $('#modal-key-event').addClass('is-active');
        $('#remove-key-event').addClass('is-hidden');

    }
};

// Set event handler for when user clicks an existing event.
function eventClick (ev){
    CUR_EVT = ev.event;

    switch (CUR_EVT.extendedProps.type) {
    case 'substance-event':
        update_substance_options();
        $('#substance-event-date').text(CUR_EVT.start.toDateString());
        $('#form-substance-event')[0].reset(); // Trigger a change event to update unit list.
        $('#substance-event-substance').val(CUR_EVT.extendedProps.substance).trigger('change');
        $('#substance-event-occasions').val(CUR_EVT.extendedProps.occasions);
        $('#substance-event-amount').val(CUR_EVT.extendedProps.amount);
        $('#substance-event-units').val(CUR_EVT.extendedProps.units);
        $('#substance-event-units-other').val(CUR_EVT.extendedProps.unitsOther);
        // $('#substance-event-recurring').prop('disabled', true);
        $('#substance-event-recur-until').prop('min', CUR_EVT.start.toISOString().substr(0,10));
        $('#substance-event-recur-until').prop('max', DATE_TO.toISOString().substr(0,10));
        $('#modal-substance-event').addClass('is-active');
        $('#remove-substance-event').removeClass('is-hidden');
        break;
    case 'key-event':
        $('#key-event-date').text(CUR_EVT.start.toDateString());
        $('#form-key-event')[0].reset();
        $('#key-event-text').val(CUR_EVT.title);
        $('#modal-key-event').addClass('is-active');
        $('#remove-key-event').removeClass('is-hidden');
        break;
    }
};

// When the document is loaded...
$(document).ready(function () {

    // Initialize the FullCalendar object.
    CAL = new FullCalendar.Calendar($("#calendar")[0], {
        initialView: "dayGridMonth",
        validRange: {
            start: DATE_FROM,
            end: DATE_TO
        },
        editable: true,
        dateClick: dateClick,
        eventClick: eventClick,
        select: dateSelect
    });
    CAL.render();

     // Load list of studies.
     $.getJSON('studies.json', function (data) {
        STUDIES = data;

        if (Object.keys(POST).length) {
            let study = STUDIES.filter(function (x) {return x.name == POST.study})[0];
            let evt_index = study.redcap_events.indexOf(POST.event);

            // Followup visits.
            if (evt_index > 0) {
                DATE_FROM = dayjs(LAST_VISIT.substring(0, 10), 'YYYY-MM-DD').toDate();

            // Screen visit.
            } else {
                DATE_FROM.setDate(DATE_TO.getDate() - study.days[evt_index]);
                DATE_30.setDate(DATE_TO.getDate() - 30);
                DATE_90.setDate(DATE_TO.getDate() - 90);
            }

            let days = dayjs(DATE_TO).diff(DATE_FROM, 'day');
            CAL.setOption('validRange', { start: DATE_FROM, end: DATE_TO });
            $('#days').text(days);
            $('#substance-list-days').text(days);
            $('#date-from').text(DATE_FROM.toDateString());
            $('#date-to').text(DATE_TO.toDateString());
            $('#substance-list-since').text(`Since ${DATE_FROM.toDateString()}`);
        }
        
        $("#login-study").change(function () {
            let val = $(this).val();
            let selector = $('#login-redcap-event');
  
            selector.empty();

            STUDIES.filter((x) => x.id == val)[0].redcap_events.forEach((event)=>{
                selector.append(`<option>${event}</option>`);
            });
           
        }).trigger('change');
    });

    // Load list of substances.
    $.getJSON('substances.json', function (data) {
        SUBSTANCE_CAT = data.category;
        SUBSTANCES_BY_CAT = data.substance;
        SUBSTANCES = Object.entries(SUBSTANCES_BY_CAT).reduce((a, [cat, sub])=>a.concat(sub.map(s=>({...s, cat}))), []);

        // Create substance list.
        SUBSTANCE_CAT.forEach(function (cat) {
            let sl = $('#substance-list');
            let field = $('<div>');
            field.addClass = 'field';
            field.append(`<label class="label">${cat.label}</label>`);

            for (sub of SUBSTANCES_BY_CAT[cat.id]) {
                field.append(`
                    <div class="control">
                      <label class="checkbox">
                        <input type="checkbox" name="${sub.label}"> ${sub.label} ${sub.alt ? '('+sub.alt+')' : ''}
                      </label>
                    </div>`);
            }

            sl.append(field);
        });
    });

    // Update the clock every second.
    setInterval(function () {
        $('#time').text(((new Date()).toTimeString()));
    }, 1000);

    // Set substance-list event handlers.
    $('#close-substance-list').click(function () {
        $('#modal-substance-list').removeClass('is-active');
    });

    $('#form-substance-list').submit(function () {
        $('#modal-substance-list').removeClass('is-active');
        SELECTED_SUBS = $('#form-substance-list').serializeArray().map(chk=>chk.name);

        return false;
    });

    // Set substance-event event handlers.
    $('#close-substance-event').click(function () {
        $('#modal-substance-event').removeClass('is-active');
    });

    $('#form-substance-event').submit(function () {

        $('#modal-substance-event').removeClass('is-active');
        if (CUR_EVT) {
            let subs = $('#substance-event-substance').val();
            let sub = lookup_substance(subs);
            let occas = $('#substance-event-occasions').val();
            let amnt = sub.units?.length ? $('#substance-event-amount').val() : '';
            let units = sub.units?.length ? $('#substance-event-units').val() : '';
            let unitsOther = subs.units?.length ? $('#substance-event-units-other').val() : '';
            let recur = $('#substance-event-recurring').prop('checked');
            let recurOn = $('#substance-event-recur-on').val();
            let recurUntil = $('#substance-event-recur-until').val();

            if (CUR_EVT instanceof FullCalendar.EventApi) {
                CUR_EVT.setExtendedProp('substance', subs);
                CUR_EVT.setExtendedProp('category', sub.cat);
                CUR_EVT.setExtendedProp('occasions', occas);
                CUR_EVT.setExtendedProp('amount', amnt);
                CUR_EVT.setExtendedProp('units', units);
                CUR_EVT.setExtendedProp('unitsOther', unitsOther);
                CUR_EVT.setProp('title',`${subs} ${occas}x ${amnt}${units || unitsOther}`);
                if (recur) {
                    CUR_EVT.setProp('daysOfWeek', recurOn);
                    CUR_EVT.setProp('startRecur', CUR_EVT.start);
                    CUR_EVT.setProp('endRecur', recurUntil);
                }
                
            } else {
                CUR_EVT.type = 'substance-event';
                CUR_EVT.substance = subs;
                CUR_EVT.category  = sub.cat;
                CUR_EVT.occasions = occas;
                CUR_EVT.amount = amnt;
                CUR_EVT.units = units;
                CUR_EVT.unitsOther = unitsOther;
                CUR_EVT.title = `${subs} ${occas}x ${amnt}${units || unitsOther}`;
                CUR_EVT.textColor = '#FFFFFF';
                CUR_EVT.backgroundColor = '#7B68EE';
                if (recur) {
                    CUR_EVT.daysOfWeek = recurOn;
                    CUR_EVT.startRecur = CUR_EVT.date;
                    CUR_EVT.endRecur = recurUntil;
                    CUR_EVT.backgroundColor = '#8070FF';
                }
                CAL.addEvent(CUR_EVT);
            }
        }

        return false;
    });

    $('#substance-event-substance').change(function () {
        // Update the unit list for the current substance.
        let selector = $('#substance-event-units');
        selector.empty();

        $('#substance-event-amount').val('');
        $('#substance-event-units-other').val('');


        let sub = lookup_substance($('#substance-event-substance').val());
        if (sub.units?.length) {
            sub.units.forEach(unit => {
                selector.append(`<option>${unit}</option>`);
            });
            selector.append('option>other</option>');
            $('#substance-event-amount-section').removeClass('is-hidden');
        } else {
            $('#substance-event-amount-section').addClass('is-hidden');
        }
    });

    $('#substance-event-recurring').change(function () {
        if ($('#substance-event-recurring').prop('checked')) {
            $('#substance-event-recurring-section').removeClass('is-hidden');
            $('#substance-event-recur-until').prop('required', true);
        } else {
            $('#substance-event-recurring-section').addClass('is-hidden');
            $('#substance-event-recur-until').prop('required', false);
        }
    });

    $('#remove-substance-event').click(function () {
        $('#modal-substance-event').removeClass('is-active');
        if (CUR_EVT) {
            CUR_EVT.remove();
        }
    });

    // Set key-event event handlers.
    $('#close-key-event').click(function () {
        $('#modal-key-event').removeClass('is-active');
    });

    $('#form-key-event').submit(function () {
        $('#modal-key-event').removeClass('is-active');
        if (CUR_EVT) {
            let text = $('#key-event-text').val();

            if (CUR_EVT instanceof FullCalendar.EventApi) {
                CUR_EVT.setProp('title', text);
            } else {
                CUR_EVT.title = text;
                CUR_EVT.type = 'key-event';
                CUR_EVT.textColor = '#000000';
                CUR_EVT.backgroundColor = '#FF7F50';
                CAL.addEvent(CUR_EVT);
            }
        }

        return false;
    });

    $('#remove-key-event').click(function () {
        $('#modal-key-event').removeClass('is-active');
        if (CUR_EVT) {
            CUR_EVT.remove();
        }
    });

    // Set substance-event event handlers.
    $('#close-summary').click(function () {
        $('#modal-summary').removeClass('is-active');
    });

    // Set button event handlers.
    $('#open-substance-list').click(function () {
        $('#modal-substance-list').addClass('is-active');
    });

    $('#mode-substance-event').click(function () {
        $('#mode-substance-event').addClass('is-success').attr('disabled', true);
        $('#mode-key-event').removeClass('is-success').attr('disabled', false);
        CAL.setOption('selectable', false);
        MODE = 'substance-event';
    });

    $('#mode-key-event').click(function () {
        $('#mode-key-event').addClass('is-success').attr('disabled', true);
        $('#mode-substance-event').removeClass('is-success').attr('disabled', false);
        CAL.setOption('selectable', true);
        MODE = 'key-event';
    });

    $('#open-summary').click(function () {
        
        let events = CAL.getEvents();

        // Prep a downloadable JSON.
        let data = JSON.stringify({
            studyid: POST.participant,
            from: DATE_FROM,
            to: DATE_TO,
            substances: SELECTED_SUBS,
            events: events
        });
        let file = new Blob([data], {type: 'text/json'});
        let link = $('#summary-download')[0];
        link.href = URL.createObjectURL(file);
        link.download = `${POST.participant} ${(new Date()).toISOString()}.json`;
        $('#summary-summary').text(data);

        let substance_events = events.filter(x=>x.extendedProps.type == 'substance-event');
        let substance_events_30 = substance_events.filter(x=>x.start > DATE_30);
        let substance_events_90 = substance_events.filter(x=>x.start > DATE_90);

        // Total number of days each substance was used.
        $('#tlfb_etoh_total_days_90').text(calc_days_used(substance_events_90, 'etoh'));
        $('#tlfb_etoh_total_days_30').text(calc_days_used(substance_events_30, 'etoh'));
        $('#tlfb_mj_total_days_90').text(calc_days_used(substance_events_90, 'mj'));
        $('#tlfb_mj_total_days_30').text(calc_days_used(substance_events_30, 'mj'));
        $('#tlfb_nic_total_days_90').text(calc_days_used(substance_events_90, 'nic'));
        $('#tlfb_nic_total_days_30').text(calc_days_used(substance_events_30, 'nic'));
        $('#tlfb_stim_total_days_90').text(calc_days_used(substance_events_90, 'stim'));
        $('#tlfb_stim_total_days_30').text(calc_days_used(substance_events_30, 'stim'));
        $('#tlfb_coc_total_days_90').text(calc_days_used(substance_events_90, 'coc'));
        $('#tlfb_coc_total_days_30').text(calc_days_used(substance_events_30, 'coc'));
        $('#tlfb_opi_total_days_90').text(calc_days_used(substance_events_90, 'opi'));
        $('#tlfb_opi_total_days_30').text(calc_days_used(substance_events_30, 'opi'));
        $('#tlfb_hall_total_days_90').text(calc_days_used(substance_events_90, 'hall'));
        $('#tlfb_hall_total_days_30').text(calc_days_used(substance_events_30, 'hall'));
        $('#tlfb_diss_total_days_90').text(calc_days_used(substance_events_90, 'diss'));
        $('#tlfb_diss_total_days_30').text(calc_days_used(substance_events_30, 'diss'));
        $('#tlfb_inh_total_days_90').text(calc_days_used(substance_events_90, 'inh'));
        $('#tlfb_inh_total_days_30').text(calc_days_used(substance_events_30, 'inh'));
        $('#tlfb_sdh_total_days_90').text(calc_days_used(substance_events_90, 'sdh'));
        $('#tlfb_sdh_total_days_30').text(calc_days_used(substance_events_30, 'sdh'));
        $('#tlfb_misc_total_days_90').text(calc_days_used(substance_events_90, 'misc'));
        $('#tlfb_misc_total_days_30').text(calc_days_used(substance_events_30, 'misc'));

        // For alcohol only, report the total number of drinks.
        $('#tlfb_etoh_total_units_90').text(calc_total_units(substance_events_90, 'Alcohol', 'standard drinks'));
        $('#tlfb_etoh_total_units_30').text(calc_total_units(substance_events_30, 'Alcohol', 'standard drinks'));

        // For all other substances, report the total number of occasions.
        $('#tlfb_mj_total_units_90').text(calc_total_occasions(substance_events_90, 'mj'))
        $('#tlfb_mj_total_units_30').text(calc_total_occasions(substance_events_30, 'mj'))
        $('#tlfb_nic_total_units_90').text(calc_total_occasions(substance_events_90, 'nic'))
        $('#tlfb_nic_total_units_30').text(calc_total_occasions(substance_events_30, 'nic'))
        $('#tlfb_stim_total_units_90').text(calc_total_occasions(substance_events_90, 'stim'))
        $('#tlfb_stim_total_units_30').text(calc_total_occasions(substance_events_30, 'stim'))
        $('#tlfb_coc_total_units_90').text(calc_total_occasions(substance_events_90, 'coc'))
        $('#tlfb_coc_total_units_30').text(calc_total_occasions(substance_events_30, 'coc'))
        $('#tlfb_opi_total_units_90').text(calc_total_occasions(substance_events_90, 'opi'))
        $('#tlfb_opi_total_units_30').text(calc_total_occasions(substance_events_30, 'opi'))
        $('#tlfb_hall_total_units_90').text(calc_total_occasions(substance_events_90, 'hall'))
        $('#tlfb_hall_total_units_30').text(calc_total_occasions(substance_events_30, 'hall'))
        $('#tlfb_diss_total_units_90').text(calc_total_occasions(substance_events_90, 'diss'))
        $('#tlfb_diss_total_units_30').text(calc_total_occasions(substance_events_30, 'diss'))
        $('#tlfb_inh_total_units_90').text(calc_total_occasions(substance_events_90, 'inh'))
        $('#tlfb_inh_total_units_30').text(calc_total_occasions(substance_events_30, 'inh'))
        $('#tlfb_sdh_total_units_90').text(calc_total_occasions(substance_events_90, 'sdh'))
        $('#tlfb_sdh_total_units_30').text(calc_total_occasions(substance_events_30, 'sdh'))
        $('#tlfb_misc_total_units_90').text(calc_total_occasions(substance_events_90, 'misc'))
        $('#tlfb_misc_total_units_30').text(calc_total_occasions(substance_events_30, 'misc'))





        $('#modal-summary').addClass('is-active');
    });
});
