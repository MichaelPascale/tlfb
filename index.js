// Define Globals
// EVENT_NAME, SECONDARY_ID, LAST_VISIT defined in index.php.
const PARAMS = new URLSearchParams(window.location.search);
var MODE = '';                  // Event-adding mode (substance event or key date).
var CAL = null;                 // The FullCalendar object.
var CUR_EVT = '';               // The calendar date currently being edited.
var SUBSTANCES = null;          // List of substances.
var SUBSTANCES_BY_CAT = null;   // List of substances by category.
var SUBSTANCE_CAT = null;       // List of substance categories.
// var DATE_30 = dayjs().startOf('day');       // 30 days ago.
// var DATE_90 = dayjs().startOf('day');       // 90 days ago.
var SELECTED_SUBS = [];         // Substances selected in the substance list.
var DAYS = DEFAULT_DAYS;
var DOWNLOAD = null;

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
    console.log('dateSelect', ev)
    CUR_EVT = ev;

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
        $('#substance-event-notes').val(CUR_EVT.extendedProps.notes);
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

    dayjs.extend(dayjs_plugin_duration);
    dayjs.extend(dayjs_plugin_customParseFormat);

    // Followup visits.
    if (LAST_VISIT) {
        DATE_FROM = dayjs(LAST_VISIT.substring(0, 10), 'YYYY-MM-DD');

    // Screen visit.
    } else {
        DATE_FROM = DATE_TO.subtract(DEFAULT_DAYS, 'days');
        DATE_30 = DATE_TO.subtract(30, 'days');
        DATE_90 = DATE_TO.subtract(90, 'days');
    }

    // Initialize the FullCalendar object.
    CAL = new FullCalendar.Calendar($("#calendar")[0], {
        initialView: "dayGridMonth",
        validRange: {
            start: DATE_FROM.format('YYYY-MM-DD'),
            end: DATE_TO.add(1, 'day').format('YYYY-MM-DD')
        },
        editable: true,
        dateClick: dateClick,
        eventClick: eventClick,
        select: dateSelect
    });
    CAL.render();

    DAYS = dayjs(DATE_TO).diff(DATE_FROM, 'day');
    $('#days').text(DAYS);
    $('#substance-list-days').text(DAYS);
    $('#date-from').text(DATE_FROM.format('MMM DD YYYY'));
    $('#date-to').text(DATE_TO.format('MMM DD YYYY'));
    $('#substance-list-since').text(`Since ${DATE_FROM.format('ddd MMM DD YYYY')}`);

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
    const fn_clock = function () {
        $('#time').text(`Today is ${dayjs().format('dddd, MMM DD YYYY')}`);
        setTimeout(fn_clock, 60000)
    }
    fn_clock();

    // Set login dialog event handlers.
    $('#close-login').click(function () {
        $('#loading').addClass('is-active');
        let dob = $('#login-dob').val();
        let username = $('#login-username').val();

        if (dob && username) {
            $.post('auth.php', {
                pid: PARAMS.get('pid'),
                record: PARAMS.get('record'),
                dob,
                username
            }, function () {
                $('#modal-login').removeClass('is-active');
            }).fail(function (data) {
                $('#login-error-message').text(data.responseText);
                $('#login-error').removeClass('is-hidden');
            }).always(function () {
                $('#loading').removeClass('is-active');
            });
        } else {
            $('#loading').removeClass('is-active');
        }
    });

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
            let notes = $('#substance-event-notes').val();
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
                CUR_EVT.setExtendedProp('notes', notes);
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
                CUR_EVT.notes = notes;
                CUR_EVT.title = `${subs} ${occas}x ${amnt}${units || unitsOther}`;
                CUR_EVT.textColor = '#FFFFFF';
                CUR_EVT.backgroundColor = '#785EF0';
                CUR_EVT.borderColor = '#785EF0';
                if (recur) {
                    CUR_EVT.daysOfWeek = recurOn;
                    CUR_EVT.startRecur = CUR_EVT.date;
                    CUR_EVT.endRecur = recurUntil;
                    CUR_EVT.backgroundColor = '#8060F2';
                    CUR_EVT.borderColor = '#8060F2';
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
                CUR_EVT.textColor = '#FFFFFF';
                CUR_EVT.backgroundColor = '#DC267F';
                CUR_EVT.borderColor = '#DC267F';
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

    // Set summary screen event handlers.
    $('#close-summary').click(function () {
        $('#modal-summary').removeClass('is-active');
    });

    $('#open-summary').click(function () {
        
        let events = CAL.getEvents();

        // Prep a downloadable JSON.
        DOWNLOAD = JSON.stringify({
            subject: SECONDARY_ID,
            event: PARAMS.get('event'),
            pid: PARAMS.get('pid'),
            start: PARAMS.get('start'),
            end: PARAMS.get('end'),
            staff: PARAMS.get('staff'),
            record: PARAMS.get('record'),
            keyfield: PARAMS.get('keyfield'),
            datetime: dayjs().toISOString(),
            events: CAL.getEvents().map(x => ({
                title: x?.title,
                type: x?.extendedProps?.type,
                start: x.start ? dayjs(x.start).format('YYYY-MM-DD') : undefined,
                end: x.end ? dayjs(x.end).format('YYYY-MM-DD') : undefined,
                category: x?.extendedProps?.category,
                substance: x?.extendedProps?.substance,
                occasions: x?.extendedProps?.occasions,
                amount: x?.extendedProps.amount,
                units: x?.extendedProps.units ?? x?.extendedProps.unitsOther
            }))
        });
        let file = new Blob([DOWNLOAD], {type: 'text/json'});
        let link = $('#summary-download')[0];
        link.href = URL.createObjectURL(file);
        link.download = `TLFB-${PARAMS.get('pid')}-${PARAMS.get('subject')}-${PARAMS.get('event')}-${PARAMS.get('start')}-${PARAMS.get('end')}.json`;
        $('#summary-summary').text(DOWNLOAD);

        const substance_events = events.filter(x=>x.extendedProps.type == 'substance-event');
        const weeks = DAYS / 7;

        // Total number of days each substance was used.
        const days_used_etoh = calc_days_used(substance_events, 'etoh');
        const days_used_mj = calc_days_used(substance_events, 'mj');
        const days_used_nic = calc_days_used(substance_events, 'nic');

        $('#tlfb_etoh_total_days').text(days_used_etoh);
        $('#tlfb_mj_total_days').text(days_used_mj);
        $('#tlfb_nic_total_days').text(days_used_nic);

        // For alcohol only, report the total number of drinks.
        const total_units_etoh = calc_total_units(substance_events, 'Alcohol', 'standard drinks');
        $('#tlfb_etoh_total_units').text(total_units_etoh);

        // For all other substances, report the total number of occasions.
        const total_units_mj = calc_total_occasions(substance_events, 'mj');
        const total_units_nic = calc_total_occasions(substance_events, 'nic');
        $('#tlfb_mj_total_units').text(total_units_mj);
        $('#tlfb_nic_total_units').text(total_units_nic);

        // Average occasions per use day.
        $('#tlfb_etoh_avg_unitsday').text((total_units_etoh/days_used_etoh).toFixed(3));
        $('#tlfb_mj_avg_unitsday').text((total_units_mj/days_used_mj).toFixed(3));
        $('#tlfb_nic_avg_unitsday').text((total_units_nic/days_used_nic).toFixed(3));

        // Average occasions per week.
        $('#tlfb_etoh_avg_units').text((total_units_etoh/weeks).toFixed(3));
        $('#tlfb_mj_avg_units').text((total_units_mj/weeks).toFixed(3));
        $('#tlfb_nic_avg_units').text((total_units_nic/weeks).toFixed(3));

        // Average days per week.
        $('#tlfb_etoh_avg_days').text(((days_used_etoh/DAYS)*7).toFixed(3));
        $('#tlfb_mj_avg_days').text(((days_used_mj/DAYS)*7).toFixed(3));
        $('#tlfb_nic_avg_days').text(((days_used_nic/DAYS)*7).toFixed(3));

        $('#tlfb_etoh_last_use').text(calc_days_since_last_use(substance_events, 'etoh', dayjs().startOf('day')));
        $('#tlfb_mj_last_use').text(calc_days_since_last_use(substance_events, 'mj', dayjs().startOf('day')));
        $('#tlfb_nic_last_use').text(calc_days_since_last_use(substance_events, 'nic', dayjs().startOf('day')));

        $('#modal-summary').addClass('is-active');
    });

    $('#save-summary').click(function () {
        $('#loading').addClass('is-active');
        
        $.post('save.php', {
            pid: PARAMS.get('pid'),
            json: DOWNLOAD
        }, function (data) {
            $('#save-summary').attr('disabled', true).addClass('is-success').text('Saved');
            $('#close-summary').remove();

            if (data) {
                $('#summary-error-message').text(data);
                $('#summary-error').removeClass('is-hidden').removeClass('is-danger').addClass('is-warning');
            } else {
                $('#summary-error').addClass('is-hidden');
            }

            $('#summary').text(`Data has been saved successfully for ${SECONDARY_ID}. It is safe to close this window.`)
        }).fail(function (data) {
            $('#summary-error-message').text(data.responseText);
            $('#summary-error').removeClass('is-hidden');

            $('#summary').scrollTop(0);

            (function flash (i) {
                if (i > 0) {
                    $('#summary').toggleClass('has-background-danger');
                    setTimeout(flash, 50, i-1);
                } else {
                    $('#summary').removeClass('has-background-danger'); 
                }
            })(3);

        }).always(function () {
            $('#loading').removeClass('is-active');
        });
    });
});
