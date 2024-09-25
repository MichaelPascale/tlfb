/* file.ts
*
* Handle actions under file dropdown: exporting/importing data,
* summarizing events, and changing TLFB properties
* 
* Copyright (c) 2024, Ivy Zhu <izhu1@mgh.harvard.edu>
* Last modified: 2024-08-19
*/

import { Modal } from './modal'
import { update_properties } from "./main";
import { TLFBProperties, SubstanceList, SubstanceInfo, SubstanceUseList, JSONData, SerializedEvent, UseEventProperties, JSONEvent } from './types'
import { Calendar } from '@fullcalendar/core';
import { CalendarDate, CalendarEvent, UseEvent, NoUseEvent, KeyEvent } from './state';

import * as calculate from './calculate'
import { Editor } from './editor';
import { VERSION } from './constants';

export class File {
    private _current_properties: TLFBProperties;

    private _calendar: Calendar;
    
    private _editor: Editor;

    private _modal_substances: Modal;
    private _modal_properties: Modal;
    private _modal_summary: Modal;
    private _modal_import_json: Modal;
    private _modal_import_csv: Modal;
    private _modal_confirm_import: Modal;

    private _substance_list: SubstanceList;
    private _substances_used: SubstanceUseList;

    public constructor(tlfb_properties: TLFBProperties ,calendar: Calendar, editor: Editor) {
        this._current_properties = tlfb_properties
        this._calendar = calendar

        this._modal_substances = new Modal('modal-select-substances');
        this._modal_properties = new Modal('modal-update-properties');
        this._modal_summary = new Modal('modal-get-summary');
        this._modal_import_json = new Modal('modal-import-json');
        this._modal_import_csv = new Modal('modal-import-csv');
        this._modal_confirm_import = new Modal('modal-confirm-export')

        this._substance_list = require('../substances.json');

        this._editor = editor

        // Check session storage for substance use list and event list (preserve data after page refresh)
        if (sessionStorage.getItem('substancesUsed') === null) {
            this._substances_used = {};
        } else {
            this._substances_used = JSON.parse(sessionStorage.getItem('substancesUsed') as string)
            this._editor.update_substances_used(this._substances_used)
        }

        if (sessionStorage.getItem('eventsList') != null) {
            const optimized_events = JSON.parse(sessionStorage.getItem('eventsList') as string)

            optimized_events.forEach((event: JSONEvent) => {
                event._date = (event._date as {_date: string})._date
            })
            this.deserialize_events_json(optimized_events)
        }

        document.querySelectorAll('.tlfb-file-mode').forEach(x => x.addEventListener('click', (ev) => this.mode(ev)))
    }

    public mode(devt: Event) {
        const clicked = (devt.target as Element).id;

        switch (clicked){
            case 'mode-button-file-properties':
                document.getElementById('properties-warn')!.innerText = ""
                this.change_properties()
                break;
            case 'mode-button-edit-list':
                this.select_substance()
                break;
            case 'mode-button-summarize':
                this.summarize()
                break;
            case 'mode-button-import-json':
                this.import_json()
                break;
            case 'mode-button-import-csv':
                this.import_csv()
                break;
            case 'mode-button-export-json':
                this.export_json()
                break;
            case 'mode-button-export-csv':
                this.export_csv()
                break;
        }
        console.log(`Clicked: ${clicked}`)
    }


    // Change TLFB properties functions:
    public change_properties() {
        this._modal_properties.populateForm({
            "project-name": this._current_properties.pid,
            "cam-id": this._current_properties.subject,
            "record-id": this._current_properties.record,
            "tlfb-event": this._current_properties.timepoint,
            "tlfb-start": this._current_properties.start,
            "tlfb-end": this._current_properties.end,
            "tlfb-keyfield": this._current_properties.keyfield,
            "tlfb-staff": this._current_properties.staff
        })

        this._modal_properties.open((data: FormData)=>{
            const new_tlfb_properties = {
                "subject": data.get('cam-identifier')!.toString(),
                "record": data.get('record-identifier')!.toString(),
                "pid": data.get('project-name')!.toString(),
                "timepoint": data.get('tlfb-event')!.toString(),
                "start": data.get("tlfb-start")!.toString(),
                "end": data.get("tlfb-end")!.toString(),
                "keyfield": data.get("tlfb-keyfield")!.toString(),
                "staff": data.get("tlfb-staff")!.toString(),
            }
            update_properties(this._current_properties, new_tlfb_properties)

            const end_day_after = new Date(this._current_properties.end)
            end_day_after.setDate(end_day_after.getDate() + 1)
            this._calendar.setOption('validRange', {
                start: this._current_properties.start,
                end: end_day_after.toISOString().split("T")[0]
            })
        })
    }

    public missing_properties_warn(missing_tlfb_properties: string[]) {
        let missing_alert = "The following REDCap parameters were not recieved. Please manually fill them in: "
        missing_tlfb_properties.forEach((prop) => {
            missing_alert = missing_alert + prop + ", "
        })
        document.getElementById('properties-warn')!.innerText = missing_alert
        this.change_properties();
    }


    // Substance-use list functions:
    private get_deselected_substances(old_sub_list: SubstanceUseList, new_sub_list: SubstanceUseList) {
        const deselected_methods: string[] = []
        Object.keys(old_sub_list).forEach((category) => {
            if (new_sub_list.hasOwnProperty(category)) {
                old_sub_list[category].forEach((method) => {
                    if (!new_sub_list[category].map(el => el.label).includes(method.label)) {
                        deselected_methods.push(method.label)
                    }
                })
            } else {
                old_sub_list[category].forEach((method) => {
                    deselected_methods.push(method.label)
                })
            }
        })
        return deselected_methods
    }

    private merge_selected_substances(new_sub_list: SubstanceUseList) {
        Object.keys(new_sub_list).forEach((key) => {
            if (this._substances_used.hasOwnProperty(key)) {
                new_sub_list[key].forEach((method) => {
                    const substance_info = this._substance_list.substance[key].find((substance: SubstanceInfo) => substance.label === method.label)!
                    if (!this._substances_used[key].map(el => el.label).includes(substance_info.label)) {
                        this._substances_used[key].push(substance_info)
                    }
                })
            } else {
                this._substances_used[key] = new_sub_list[key]
            }
        })
    }
  
    public select_substance() {
        Object.keys(this._substances_used).forEach((key) => {
            this._substances_used[key].forEach((substance_used) => {
                const substance_index = this._substance_list.substance[key].findIndex(method => method.label === substance_used.label)
                const checkbox = document.getElementById(`${substance_index.toString() + key}`) as HTMLInputElement
                checkbox.checked = true
            })
        })

        this._modal_substances.populateText({
            '.subtitle': this._current_properties.start + " to " + this._current_properties.end
        }).open((data: FormData)=>{
            const substances_checked: {
                [name: string]: SubstanceInfo[]
            } = {}

            // Each checkbox's value is composed of the substance's category and the index of the 
            // substance (ex/ "etoh 0") in that category's array (see substance.json)
            data.forEach((value) => {
                // Break each substance into array with index number and category
                const used = value.toString().split(" ")
                const sub_info = this._substance_list.substance[used[1]][Number(used[0])]
                if (substances_checked.hasOwnProperty(used[1])) {
                        substances_checked[used[1]].push(sub_info)
                } else {
                    substances_checked[used[1]] = [sub_info]
                }
            })

            // If substances were deselected, remove related substance use events
            this.get_deselected_substances(this._substances_used, substances_checked).forEach((method) => {
                this._editor.get_event_list().delete_substance(method)
            })

            this._substances_used = substances_checked
            sessionStorage.setItem('substancesUsed', JSON.stringify(this._substances_used))
            this._editor.update_substances_used(this._substances_used)
        })
    }


    // Summary function:
    public summarize() {
        const weeks: number = this._current_properties.days / 7
        const today: string = (new Date).toISOString().split('T')[0]

        const start = new CalendarDate(this._current_properties.start)
        const end = new CalendarDate(this._current_properties.end)

        // Only use events within given date range (in case events were added before date range change)
        const substance_use_events: CalendarEvent[] = this._editor.get_event_list().get_events().filter((event) => 
            (event.date_object.isAfter(start) || event.date_object.isSameDay(start)) &&
            (event.date_object.isBefore(end)) &&
            (UseEvent.prototype.isPrototypeOf(event))
        )

        // Total number of days each substance was used.
        const etoh_use_days: Number = calculate.calc_days_used(substance_use_events, 'etoh')
        const mj_use_days: Number = calculate.calc_days_used(substance_use_events, 'cb')
        const nic_use_days: Number = calculate.calc_days_used(substance_use_events, 'nic')

        // Total number of days each substance was used, with amount used known.
        const etoh_use_days_amount: Number = calculate.calc_days_used_amount(substance_use_events, 'etoh')

        document.getElementById('tlfb_etoh_total_days')!.innerText = String(etoh_use_days);
        document.getElementById('tlfb_mj_total_days')!.innerText = String(mj_use_days);
        document.getElementById('tlfb_nic_total_days')!.innerText = String(nic_use_days);

        // For alcohol only, report the total number of drinks.
        const etoh_total_units: Number = calculate.calc_total_units(substance_use_events, 'Alcohol', 'standard drinks')

        if (etoh_use_days != etoh_use_days_amount) {
            document.getElementById('tlfb_etoh_total_units')!.innerHTML = String(etoh_total_units) + "+";
        } else {
            document.getElementById('tlfb_etoh_total_units')!.innerHTML = String(etoh_total_units);
        }

        // For all other substances, report the total number of occasions.
        const mj_total_units: Number = calculate.calc_total_occasions(substance_use_events, 'cb')
        const nic_total_units: Number = calculate.calc_total_occasions(substance_use_events, 'nic')

        document.getElementById('tlfb_mj_total_units')!.innerHTML = String(mj_total_units);
        document.getElementById('tlfb_nic_total_units')!.innerHTML = String(nic_total_units);
        
        // Average occasions per use day.
        document.getElementById('tlfb_etoh_avg_unitsday')!.innerHTML = String((+etoh_total_units/+etoh_use_days_amount).toFixed(3));
        document.getElementById('tlfb_mj_avg_unitsday')!.innerHTML = String((+mj_total_units/+mj_use_days).toFixed(3));
        document.getElementById('tlfb_nic_avg_unitsday')!.innerHTML = String((+nic_total_units/+nic_use_days).toFixed(3));

        // Average occasions per week.
        document.getElementById('tlfb_etoh_avg_units')!.innerHTML = String((+etoh_total_units/weeks).toFixed(3));
        document.getElementById('tlfb_mj_avg_units')!.innerHTML = String((+mj_total_units/weeks).toFixed(3));
        document.getElementById('tlfb_nic_avg_units')!.innerHTML = String((+nic_total_units/weeks).toFixed(3));

        // Average days per week.
        document.getElementById('tlfb_etoh_avg_days')!.innerHTML = String(((+etoh_use_days/this._current_properties.days)*7).toFixed(3));
        document.getElementById('tlfb_mj_avg_days')!.innerHTML = String(((+mj_use_days/this._current_properties.days)*7).toFixed(3));
        document.getElementById('tlfb_nic_avg_days')!.innerHTML = String(((+nic_use_days/this._current_properties.days)*7).toFixed(3));

        // Days since last use.
        document.getElementById('tlfb_etoh_last_use')!.innerHTML = String(calculate.calc_days_since_last_use(substance_use_events, "etoh", today));
        document.getElementById('tlfb_mj_last_use')!.innerHTML = String(calculate.calc_days_since_last_use(substance_use_events, "cb", today));
        document.getElementById('tlfb_nic_last_use')!.innerHTML = String(calculate.calc_days_since_last_use(substance_use_events, "nic", today));

        this._modal_summary.open(() => {
            this._modal_confirm_import.open((data: FormData) => {
                if (data.get('select-export-method') === 'json') {
                    this.export_json()
                } else if (data.get('select-export-method') === 'csv'){
                    this.export_csv()
                }
            })
        })
    }


    // Exporting and importing data functions:

    // Deserializing imported events:
    public deserialize_events_json(events: SerializedEvent[]) {
        // Group events with the same gid together to ensure groups are preserved
        const grouped_events = events.reduce((acc: {
            [name : string]: SerializedEvent[]
        }, cur) => {
            if (!acc[String(cur._gid)]) {
                acc[String(cur._gid)] = [cur]
            } else {
                acc[String(cur._gid)].push(cur)
            }
            return acc
        }, {})

        Object.keys(grouped_events).forEach((key) => {
            const serialized_events: CalendarEvent[] = []
            grouped_events[key].forEach((event) => {
                const event_date = (event._date as string).split('T')[0]
                if (event._type === "no-use") {
                    serialized_events.push(new NoUseEvent(event_date))
                } else if (event._type === "key") {
                    serialized_events.push(new KeyEvent(event_date, (event._title as string)))
                } else if (event._type === "use") {
                    const event_properties: UseEventProperties = {
                        "category": event._category as string,
                        "substance": event._substance as string,
                        "methodType": event._methodType as string,
                        "methodTypeOther": event._methodTypeOther as string,
                        "method": event._method as string,
                        "methodOther": event._methodOther as string,
                        "times": Number(event._times),
                        "amount": (event._amount === "unknown") ? event._amount : Number(event._amount),
                        "units": event._units as string,
                        "unitsOther": event._unitsOther as string,
                        "note": event._note as string
                    }
                    serialized_events.push(new UseEvent(event_date, event_properties))
                }
            });
            this._editor.get_event_list().import_events(serialized_events, true)
        })
    }

    public deserialize_events_csv(events: (string | number)[][]) {
        // Group events with the same gid together to ensure groups are preserved
        const grouped_events = events.reduce((acc: {
            [name : string]: (string | number)[][]
        }, cur) => {
            if (!acc[String(cur[4])]) {
                acc[String(cur[4])] = [cur]
            } else {
                acc[String(cur[4])].push(cur)
            }
            return acc
        }, {})

        Object.keys(grouped_events).forEach((key) => {
            const serialized_events: CalendarEvent[] = []
            grouped_events[key].forEach((event) => {
                const event_date = (event[1] as string).split('T')[0]
                if (event[2] === "no-use") {
                    serialized_events.push(new NoUseEvent(event_date))
                } else if (event[2] === "key") {
                    serialized_events.push(new KeyEvent(event_date, (event[5]as string)))
                } else if (event[2] === "use") {
                    const event_properties: UseEventProperties = {
                        "category": event[6] as string,
                        "substance": event[7] as string,
                        "methodType": event[8] as string,
                        "methodTypeOther": event[9] as string,
                        "method": event[10] as string,
                        "methodOther": event[11] as string,
                        "times": Number(event[12]),
                        "amount": (event[13] === "unknown") ? event[13] : Number(event[13]),
                        "units": event[14] as string,
                        "unitsOther": event[15] as string,
                        "note": event[16] as string
                    }
                    serialized_events.push(new UseEvent(event_date, event_properties))
                }
            });
            this._editor.get_event_list().import_events(serialized_events, true)
        })
    }

    // Checking validity of imported data:
    public valid_JSON(json: any): json is JSONData {
        try {
            const valid_data_properties = ["subject", "event", "pid", "start", "end", "staff", "record", "keyfield", "datetime"]
            
            valid_data_properties.forEach((property) => {
                if (!json.hasOwnProperty(property)) {
                    throw new Error()
                } else if (json[property] != null && typeof json[property] != "string") {
                    throw new Error()
                }
            })

            if (json.events.length === 0) {
                return true
            }

            json["events"].forEach((event: any) => {
                if (typeof event != "object") {
                    throw new Error()
                }
            })
            
            const v2_value_use_event_properties = ["category", "substance", "occasions", "amount", "units", "notes"]
            const valid_use_event_properties = ["_category", "_substance", "_methodType", "_method", "_methodOther", "_times", 
                                                "_amount", "_units", "_unitsOther", "_note"]

            // Run if imported data is from version 2
            if (json.events[0].hasOwnProperty('title')) {
                json.events.forEach((event: any) => {
                    if (typeof event.title != "string" || typeof event.type != "string" || 
                        typeof event.start != "string") {
                        throw new Error()
                    }

                    if (event.hasOwnProperty('end') && typeof event.end != "string") {
                        throw new Error()
                    }

                    if (event.type === 'substance-event') {
                        v2_value_use_event_properties.forEach((event_prop) => {
                            if (typeof event[event_prop] != "string") {
                                throw new Error()
                            }
                        })
                    }
                })

                return true
            }

            // Run if imported data is not from version 2
            json.events.forEach((event: any) => {
                if (typeof event._eid != "number" || typeof event._gid != "number") {
                    throw new Error()
                }
                if (typeof event._title != "string" || typeof event._type != "string" || typeof event._date != "string") {
                    throw new Error()
                }

                if (event._type === "use") {
                    valid_use_event_properties.forEach((event_prop) => {
                        if (event_prop === "_times") {
                            if (typeof event[event_prop] != "number") {
                                throw new Error()
                            }
                        } else if(event_prop === "_amount") {
                            if (typeof event[event_prop] != "number" &&  event[event_prop] != "unknown") {
                                throw new Error()
                            }
                        } else if(event_prop === "_unitsOther" || event_prop === "_methodOther" || event_prop === "_methodType" 
                                  || event_prop === "_units") {
                            if (event[event_prop] != null && typeof event[event_prop] != "string") {
                                throw new Error()
                            }
                        } else {
                            if (typeof event[event_prop] != "string") {
                                throw new Error()
                            }
                        }
                    })
                }
            });

            return true
        } catch (err) {
            return false
        }
    }

    public valid_CSV(csv: (string | number)[][]) {
        const title_row = ["Subject", "Event", "pID", "Start", "End", "Staff", "Record", "Keyfield", "Datetime", 
                           "AppVersion", "", "", "", "", "", "", ""]
        const event_title_row = ["Event", "Date", "Type", "eID", 'gID', 'Title', "Category", "Substance", "MethodType", "MethodTypeOther",
                                 "Method", "MethodOther", "Times", "Amount", "Units", "UnitsOther", "Note"]
        const filler_row = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]

        if (JSON.stringify(csv[0]) != JSON.stringify(title_row)  ||
            JSON.stringify(csv[2]) != JSON.stringify(filler_row) ||
            JSON.stringify(csv[3]) != JSON.stringify(event_title_row)) {
            return false
        }
        return true
    }

    // Importing data:
    public import_json() {
        let imported_properties: {[name: string]: string} = {}
        let events: SerializedEvent[] = []
        const imported_substances: {[name: string]: SubstanceInfo[]} = {}

        const this_file = this

        // Get HTML elements to display imported information
        const upload_subject_json = document.getElementById('upload-out-subject')!
        const upload_event_json = document.getElementById('upload-out-event')!
        const upload_start_json = document.getElementById('upload-out-start')!
        const upload_end_json = document.getElementById('upload-out-end')!
        const upload_events_json = document.getElementById('upload-out-events')!
        const upload_earliest_json = document.getElementById('upload-out-earliest')!
        const upload_latest_json = document.getElementById('upload-out-latest')!
        const upload_substances_json = document.getElementById('upload-out-substances')!
        const upload_file_name_json = document.getElementById('filename-upload-json')!
        const warn_element = document.getElementById('json-warn')!

        const import_elements = [upload_subject_json, upload_event_json, upload_start_json, upload_end_json, 
                                 upload_events_json, upload_earliest_json, upload_latest_json, upload_substances_json, 
                                 upload_file_name_json, warn_element]

        this.reset_modal_text(import_elements)
        upload_file_name_json.innerText = "*.json"

        document.getElementById("upload-data-json")!.addEventListener("change", (evt) => {
            this.reset_modal_text(import_elements)
            upload_file_name_json.innerText = (evt.target as HTMLInputElement).files![0].name
   
            const ob_rd = new FileReader();

            ob_rd.onload = function (evt) {
                const ob_data: JSONData = JSON.parse(evt.target!.result as string);
                
                if (!this_file.valid_JSON(ob_data)) {
                    this_file._modal_import_json.reset()
                    warn_element.innerText = "The selected json file does not contain data in an accepted format."
                    return
                }

                imported_properties = {
                    "subject": ob_data.subject,
                    "record": ob_data.record,
                    "pid": ob_data.pid,
                    "timepoint": ob_data.event,
                    "start": ob_data.start,
                    "end": ob_data.end,
                    "keyfield": ob_data.keyfield,
                    "staff": ob_data.staff
                }

                events = ob_data.events

                const is_V2 = (events.length === 0) ? false : ob_data.events[0].hasOwnProperty('title')

                // Map version 2 events into currently accepted format
                if (is_V2) {
                    const updated_events: SerializedEvent[]  = []
                    let eid = 0
                    let gid = 0
                    events.forEach((event) => {
                        const dates = [event.start]

                        // Events with end date signifies repetition 
                        if (event.hasOwnProperty('end')) {
                            let curr = new Date(event.start as string)

                            while (curr.toISOString().split("T")[0] != event.end) {
                                curr.setDate(curr.getDate() + 1)
                                dates.push(curr.toISOString().split("T")[0])
                            }
                        }

                        dates.forEach((date) => {
                            const event_object: {[name: string]: string | number | object | null} = {
                                _title: event.title,
                                _date: date,
                                _eid: eid,
                                _gid: gid,
                            }
                            eid++

                            if (event.type === "key-event") {
                                event_object._type = "key"

                                updated_events.push(event_object)
                            } else if (event.type === "substance-event") {
                                const event_category = (event.category === "mj" || event.category === "cn") ? "cb" : event.category
                                const method = this_file._substance_list.substance[event_category as string].find((sub) => 
                                    (sub.label).toLowerCase() === (event.substance as string).toLowerCase()
                                )

                                event_object._type = "use"
                                event_object._category = event_category
                                event_object._substance = this_file._substance_list.category.find(sub => sub.id === event_category)!.label
                                event_object._times = event.occasions
                                event_object._amount = Number(event.occasions) * Number(event.amount)
                                event_object._units = event.units
                                event_object._unitsOther = null
                                event_object._note = event.notes

                                // Not all V2 substances/methods exist in current version
                                if (method != undefined) {
                                    event_object._method = method.label
                                    event_object._methodType = (method.hasOwnProperty('type')) ? "unknown" : null
                                    event_object._methodOther = null
                                } else {
                                    const method_other = this_file._substance_list.substance[event_category as string].slice(-1)[0]
                                    event_object._method = method_other.label
                                    event_object._methodOther = (event.substance as string)
                                    event_object._methodType = null
                                    event_object._unitsOther = (event.units as string)
                                }
                                updated_events.push(event_object)
                            }
                        })

                        gid++
                    })
                    
                    events = updated_events
                }

                // Populate HTML elements with imported data (red text signifies change from original data)
                upload_subject_json.classList.remove('has-text-danger')
                upload_subject_json.innerText = ob_data.subject
                if (ob_data.subject != this_file._current_properties.subject) {
                    upload_subject_json.classList.add('has-text-danger')
                }

                upload_event_json.classList.remove('has-text-danger')
                upload_event_json.innerText = ob_data.event!
                if (ob_data.event != this_file._current_properties.timepoint) {
                    upload_event_json.classList.add('has-text-danger')
                }
                
                upload_start_json.classList.remove('has-text-danger')
                upload_start_json.innerText = ob_data.start
                if (ob_data.start != this_file._current_properties.start) {
                    upload_start_json.classList.add('has-text-danger')
                }

                upload_end_json.classList.remove('has-text-danger')
                upload_end_json.innerText = ob_data.end
                if (ob_data.end != this_file._current_properties.end) {
                    upload_end_json.classList.add('has-text-danger')
                }

                upload_events_json.innerText = String(ob_data.events.length)

                if (ob_data.events.length > 0) {
                    const earliest_day = ob_data.events.reduce(function(acc: Date, cur: {[name: string]: string | number | object}) {
                        let d = new Date(cur._date as string)
                        return (d < acc) ? d : acc;
                    }, new Date(events[0]._date as string));
                    upload_earliest_json.innerText = earliest_day.toISOString().split("T")[0]
    
                    const latest_day = ob_data.events.reduce(function(acc: Date, cur: {[name: string]: string | number | object}) {
                        let d = new Date(cur._date as string)
                        return (d > acc) ? d : acc;
                    }, new Date(events[0]._date as string));
                    upload_latest_json.innerText = latest_day.toISOString().split("T")[0]
                } else {
                    upload_earliest_json.innerText = "-"
                    upload_latest_json.innerText = "-"
                }

                let substance_string = ""
                events.forEach((event) => {
                    if (event._type === 'use') {
                        event._category = (event._category === "mj" || event._category === "cn") ? "cb" : event._category // V2 substance list has "cb" as "mj"
                        const substance_info = this_file._substance_list.substance[event._category as string].find((substance: SubstanceInfo) => 
                            substance.label === event._method
                        )

                        if (imported_substances.hasOwnProperty(event._category! as string) &&
                        !imported_substances[event._category as string].includes(substance_info!)) {
                                imported_substances[event._category as string].push(substance_info!)                           
                        } else {
                            imported_substances[event._category as string] = [substance_info!]
                        }

                        if (!substance_string.includes(event._method! as string)) {
                            substance_string = substance_string + event._method + ", "
                        }
                    }
                })
                upload_substances_json.innerText = substance_string
            }
            ob_rd.readAsText((evt.target as HTMLInputElement).files![0]);
        })
        this._modal_import_json.open(() => {
            update_properties(this._current_properties, imported_properties)

            const missing_params = Object.keys(imported_properties).filter((key) => 
                imported_properties[key] === null
            )

            if (missing_params.length) {
                this.missing_properties_warn(missing_params)
            } 

            this._calendar.setOption('validRange', {
                start: this._current_properties.start,
                end: this._current_properties.end
            }) 
            this.merge_selected_substances(imported_substances)
            this._editor.update_substances_used(this._substances_used)
            sessionStorage.setItem('substancesUsed', JSON.stringify(this._substances_used))
            this.deserialize_events_json(events)
        })
    }

    public import_csv() {
        let imported_properties: {[name: string]: string} = {}
        let events: (string | number)[][] = []
        const imported_substances: {[name: string]: SubstanceInfo[]} = {}

        const this_file = this

        // Get HTML elements to display imported information
        const upload_subject_csv = document.getElementById('upload-csv-subject')!
        const upload_event_csv = document.getElementById('upload-csv-event')!
        const upload_start_csv = document.getElementById('upload-csv-start')!
        const upload_end_csv = document.getElementById('upload-csv-end')!
        const upload_events_csv = document.getElementById('upload-csv-events')!
        const upload_earliest_csv = document.getElementById('upload-csv-earliest')!
        const upload_latest_csv = document.getElementById('upload-csv-latest')!
        const upload_substances_csv = document.getElementById('upload-csv-substances')!
        const upload_file_name_csv = document.getElementById('filename-upload-csv')!
        const warn_element = document.getElementById('csv-warn')!

        const import_elements = [upload_subject_csv, upload_event_csv, upload_start_csv, upload_end_csv, 
                                 upload_events_csv, upload_earliest_csv, upload_latest_csv, upload_substances_csv, 
                                 upload_file_name_csv, warn_element]

        this.reset_modal_text(import_elements)
        upload_file_name_csv.innerText = "*.csv"

        document.getElementById("upload-data-csv")!.addEventListener("change", (evt) => {
            warn_element.innerText = ""
            this.reset_modal_text(import_elements)
            upload_file_name_csv.innerText = (evt.target as HTMLInputElement).files![0].name

            const ob_rd = new FileReader(); 

            ob_rd.onload = function (evt) {
                const ob_data: string = evt.target!.result as string

                const data: (string | number)[][]  = []

                ob_data.split("\n").forEach((array) => {
                    data.push(array.split(","))
                })

                if (!this_file.valid_CSV(data)) {
                    this_file._modal_import_csv.reset()
                    warn_element.innerText = "The selected csv file does not contain data in an accepted format."
                    return
                }

                const properties_data = data[1]
                events = (data.length > 4) ? data.slice(4, -1) : []

                imported_properties = {
                    "subject": properties_data[0] as string,
                    "record": properties_data[6] as string,
                    "pid": properties_data[2] as string,
                    "timepoint": properties_data[1] as string,
                    "start": properties_data[3] as string,
                    "end": properties_data[4] as string,
                    "keyfield": properties_data[7] as string,
                    "staff": properties_data[5] as string,
                }

                // Populate HTML elements with imported data (red text signifies change from original data)
                upload_subject_csv.classList.remove('has-text-danger')
                upload_subject_csv.innerText = properties_data[0] as string
                if (properties_data[0] != this_file._current_properties.subject) {
                    upload_subject_csv.classList.add('has-text-danger')
                }

                upload_event_csv.classList.remove('has-text-danger')
                upload_event_csv.innerText = properties_data[1] as string
                if (properties_data[1] != this_file._current_properties.timepoint) {
                    upload_event_csv.classList.add('has-text-danger')
                }
    
                upload_start_csv.classList.remove('has-text-danger')
                upload_start_csv.innerText = properties_data[3] as string
                if (properties_data[3] != this_file._current_properties.start) {
                    upload_start_csv.classList.add('has-text-danger')
                }

                upload_end_csv.classList.remove('has-text-danger')
                upload_end_csv.innerText = properties_data[4] as string
                if (properties_data[4] != this_file._current_properties.end) {
                    upload_end_csv.classList.add('has-text-danger')
                }

                upload_events_csv.innerText = String(events.length)

                if (events.length > 0) {
                    const earliest_day = events.reduce(function(acc: Date, cur: (string | number)[]) {
                        let d = new Date(cur[1]);
                        return (d < acc) ? d : acc;
                    }, new Date(events[0][1]));
                    upload_earliest_csv.innerText = earliest_day.toISOString().split("T")[0]

                    const latest_day = events.reduce(function(acc: Date, cur: (string | number)[]) {
                        let d = new Date(cur[1]);
                        return (d > acc) ? d : acc;
                    }, new Date(events[0][1]));
                    upload_latest_csv.innerText = latest_day.toISOString().split("T")[0]
                } else {
                    upload_earliest_csv.innerText = "-"
                    upload_latest_csv.innerText = "-"
                }

                let substance_string = ""
                events.forEach((event) => {
                    if (event[2] === 'use') {
                        const method = ((event[10] as string).includes(".")) ? (event[10] as string).replace(".", ",") : event[10]
                        const substance_info = this_file._substance_list.substance[event[6]].find((substance: SubstanceInfo) => 
                            substance.label === method
                        )
                        if (imported_substances.hasOwnProperty(event[6]) &&
                           !imported_substances[event[6]].includes(substance_info!)) {   
                                imported_substances[event[6]].push(substance_info!)     
                        } else {
                            imported_substances[event[6]] = [substance_info!]
                        }

                        if (!substance_string.includes(event[10] as string)) {
                            substance_string = substance_string + event[10] + ", "
                        }
                    }
                })
                upload_substances_csv.innerText = substance_string
            }
            ob_rd.readAsText((evt.target as HTMLInputElement).files![0]);
        })
        
        this._modal_import_csv.open(() => {
            update_properties(this._current_properties, imported_properties)

            const missing_params = Object.keys(imported_properties).filter((key) => 
                imported_properties[key] === null
            )

            if (missing_params.length) {
                this.missing_properties_warn(missing_params)
            }
            
            this._calendar.setOption('validRange', {
                start: this._current_properties.start,
                end: this._current_properties.end
            }) 

            this.merge_selected_substances(imported_substances)
            this._editor.update_substances_used(this._substances_used)
            sessionStorage.setItem('substancesUsed', JSON.stringify(this._substances_used))
            this.deserialize_events_csv(events)
        })
    }

    // Exporting data:
    public export_json() {
        const file_name = "TLFB-" + this._current_properties.pid + "-" + this._current_properties.subject + "-" + this._current_properties.start + 
                          "-" + this._current_properties.end + ".json";

        const data = {
            subject: this._current_properties.subject,
            event: this._current_properties.timepoint,
            pid: this._current_properties.pid,
            start: this._current_properties.start,
            end: this._current_properties.end,
            staff: this._current_properties.staff,
            record: this._current_properties.record,
            keyfield: this._current_properties.keyfield,
            datetime: new Date(),
            appversion: VERSION,
            events: this._editor.get_event_list().serialize_events('json'),
        }
        const data_json = JSON.stringify(data)
        const json_blob = new Blob([data_json], { type: "application/json" })
        const blob_url = URL.createObjectURL(json_blob)

        const download_anchor = document.createElement("a")
        download_anchor.href = blob_url
        download_anchor.download = file_name

        download_anchor.click()

        URL.revokeObjectURL(blob_url)
    }

    public export_csv() {
        const file_name = "TLFB-" + this._current_properties.pid + "-" + this._current_properties.subject + "-" + this._current_properties.start + 
                          "-" + this._current_properties.end + ".csv";

        const properties_rows: (string | number)[][] = [
            // Header for csv file, "" as placeholders for empty spaces
            ["Subject", "Event", "pID", "Start", "End", "Staff", "Record", "Keyfield", "Datetime", "AppVersion", "", "", "", "", "", "", ""],
            [this._current_properties.subject, this._current_properties.timepoint, this._current_properties.pid, this._current_properties.start, 
             this._current_properties.end, this._current_properties.staff, this._current_properties.record, this._current_properties.keyfield, 
             (new Date).toISOString(), VERSION, "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""] // Empty row for readability 
        ]

        const events_rows = this._editor.get_event_list().serialize_events('csv')
        
        const all_rows = properties_rows.concat(events_rows as (string | number)[][])

        let csv_string = ""

        all_rows.forEach((row) => {
            csv_string = csv_string + row.join(",") + '\n'
        })
        const csv_blob = new Blob([csv_string], { type: 'text/csv' })
        const blob_url = URL.createObjectURL(csv_blob)

        const download_anchor = document.createElement("a")
        download_anchor.href = blob_url
        download_anchor.download = file_name

        download_anchor.click()

        URL.revokeObjectURL(blob_url)
    }


    // Misc. helper functions:
    public reset_modal_text(elements: HTMLElement[]) {
        elements.forEach((element) => {
            element.innerText = ""
        })
    }
}
