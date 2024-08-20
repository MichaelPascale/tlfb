/* editor.ts
 *
 * The Editor class defines a type of object that manages the state of the user
 * interface, responds to clicks, opens dialogues, and generally handles
 * "editing" actions.
 *
 * Copyright (c) 2024, Michael Pascale <mppascale@mgh.harvard.edu>
 *                     Ivy Zhu <izhu1@mgh.harvard.edu>
 * Last modified: 2024-08-19
 */

import { Calendar, DateSelectArg, EventClickArg } from "@fullcalendar/core";
import { DateClickArg } from "@fullcalendar/interaction";

import { Modal } from './modal'
import { CalendarEventList, KeyEvent, UseEvent, CalendarEvent, NoUseEvent } from "./state";

import { SubstanceList, SubstanceInfo, UseEventProperties } from "./types";

// Keep track of the edit mode.
export class Editor {
    private _mode: 'add-key' | 'add-su' | 'no-sub' | 'copy' | 'delete' | null;
    private _notification: HTMLElement;

    // The copy buffer stores an event id to be copied.
    private _copy_buffer: CalendarEvent | null = null

    private _calendar: Calendar;

    private _modal_key_event: Modal;
    private _modal_sub_event: Modal;
    private _modal_confirm: Modal;

    private _event_list: CalendarEventList

    private _substance_list: SubstanceList;
    private _substances_used: {
        [name: string]: Array<SubstanceInfo>
    }

    public constructor(calendar: Calendar) {
        this._mode = null;
        this._calendar = calendar;
        this._substance_list = require('../substances.json');

        this._notification = document.getElementById('mode-notification') as HTMLElement

        this._substances_used = {}

        // Set up event handlers.
        document.querySelectorAll('.tlfb-edit-mode').forEach(x => x.addEventListener('click', (ev) => this.mode(ev)))

        this._calendar.on('dateClick', (ev) => this.click_date(ev))
        this._calendar.on('eventClick', (ev) => this.click_event(ev))
        this._calendar.on('select', (ev) => this.select_range(ev))

        this._modal_key_event = new Modal('modal-key-event')
        this._modal_sub_event = new Modal('modal-substance-event')
        this._modal_confirm = new Modal('modal-confirm')

        const query = new URLSearchParams(window.location.search); 
        const start = (query.get('start') == undefined) ? query.get('start') as string : '2000-01-01'
        const end = (query.get('end') == undefined) ? query.get('end') as string : '2000-01-01'
        this._event_list = new CalendarEventList(start, end, this._calendar)
    } 

    public clear() {
        this._mode = null;
        this._copy_buffer = null;
        this._notification.innerText = 'Click the edit menu to begin adding events.'
    }

    public mode(devt: Event) {

        const clicked = (devt.target as Element).id;

        this.clear()

        switch (clicked){
            case 'edit-mode-key-event':
                this._mode = 'add-key'
                this._notification.innerHTML = 'Click a date on the calendar to add a <b>key date</b>.'
                break;
            case 'edit-mode-substance-event':
                if (Object.keys(this._substances_used).length == 0) {
                    this._notification.innerHTML = 'Please update the <b>substance list</b> to include at least one substance.'
                } else {
                    this._mode = 'add-su'
                    this._notification.innerHTML = 'Click a date on the calendar to add a <b>substance use event</b>.'
                }
                break;
            case 'edit-mode-no-substance':
                this._mode = 'no-sub'
                this._notification.innerHTML = 'Click a date on the calendar on which there was no substances used.'
                break;
            case 'edit-mode-copy':
                this._mode = 'copy'
                this._notification.innerHTML = 'Click an event on the calendar to <b>copy</b>.'
                break;
            case 'edit-mode-delete':
                this._mode = 'delete'
                this._notification.innerHTML = 'Click an event on the calendar to <b>delete</b>.'
                break;
            default:
                throw Error('Edit.mode(): Invalid target received.')
        }

        console.log(`Edit.mode(): ${this._mode}`)
    }


    // Add substance event functions:
    private update_sub_options(options: Array<{value:string, label:string}>, element: Element) {
        // Helper function for updating dropdown options
        element.innerHTML = ""
        options.forEach((option) => {
            element.insertAdjacentHTML(
                'beforeend', 
                `<option value="${option.value}">${option.label}</option>`
            );
        })
    }

    private update_amount() {
        // Toggle amount text box based on if amount is known
        const amount_el = document.getElementById('substance-event-amount') as HTMLInputElement
        const amount_unknown_el = document.getElementById('substance-event-amount-unknown') as HTMLInputElement

        if (amount_unknown_el.checked) {
            amount_el.value = ""
            amount_el.disabled = true
            amount_el.required = false
        } else {
            amount_el.value = ""
            amount_el.disabled = false
            amount_el.required = true
        }
    }

    private update_units(){
        // Toggle units inputs based on if units is known
        const units_el = document.getElementById('substance-event-units') as HTMLInputElement
        const units_other_el = document.getElementById('substance-event-units-other') as HTMLInputElement
        const unknown_units_el = document.getElementById('substance-event-units-unknown') as HTMLInputElement

        if (unknown_units_el.checked) {
            units_other_el.value = ""
            units_el.disabled = true
            units_el.required = false
            units_other_el.disabled = true
            units_other_el.required = false
        } else {
            units_other_el.value = ""
            units_el.disabled = false
            units_el.required = true
            units_other_el.disabled = true
            units_other_el.required = false

            if (!units_el.children.length) {
                units_el.disabled = true
                units_el.required = false
                units_other_el.disabled = false
                units_other_el.required = true
            }

            if (units_el.value === "other_unit") {
                units_other_el.disabled = false
                units_other_el.required = true
            }
        }
    }

    private update_type_options(substance: string, method: string) {
        const type_options_el = document.getElementById('substance-event-type') as HTMLInputElement

        const substance_info: SubstanceInfo | undefined = this._substance_list.substance[substance].find((sub) => sub.label === method)

        if (substance_info != undefined) {
                if (substance_info.hasOwnProperty('type')) {
                    type_options_el.disabled = false
        
                    const type_options: Array<{value:string, label:string}> = []
        
                    substance_info.type!.forEach((type) => {
                        type_options.push({
                            "value": type,
                            "label": type
                        })
                    });
                    type_options.push({"value": "unknown", "label": "unknown"})

                    this.update_sub_options(type_options, type_options_el)
                } else {
                    type_options_el.innerHTML = ""
                    type_options_el.disabled = true
                }
        } else {
            type_options_el.innerHTML = ""
            type_options_el.disabled = true
        }

    }

    private update_unit_options(substance: string, method: string) {
        const units_options_el = document.getElementById('substance-event-units') as HTMLInputElement
        const units_other_el = document.getElementById('substance-event-units-other') as HTMLInputElement

        const unit_options : Array<{value:string, label:string}> = []

        const substance_info: SubstanceInfo | undefined = this._substance_list.substance[substance].find((sub) => sub.label === method)

        if (substance_info != undefined) { 
            if (substance_info.hasOwnProperty('units')) {
                units_options_el.disabled = false
                units_other_el.disabled = true
                units_other_el.required = false
                substance_info.units!.forEach((unit) => {
                    unit_options.push({
                        "value": unit,
                        "label": unit
                    })
                })
                unit_options.push({"value": "other_unit", "label": "other"})
                this.update_sub_options(unit_options, units_options_el)
    
            } else {
                units_options_el.innerHTML = ""
                units_other_el.value = ""
                units_options_el.disabled = true
            }
    
            units_options_el.addEventListener("input", () => {
                if (units_options_el.value == "other_unit") {
                    units_other_el.disabled = false
                    units_other_el.required = true
                } else {
                    units_other_el.value = ""
                    units_other_el.disabled = true
                    units_other_el.required = false
                }
            })
        } else {
            units_options_el.innerHTML = ""
            units_other_el.value = ""
            units_options_el.disabled = true
            units_other_el.disabled = true
            units_other_el.required = false
        }
        this.update_units()
    }

    private update_method_options(substance: string, change_options: boolean) {
        const method_options_el = document.getElementById('substance-event-method') as HTMLInputElement
        const method_other_el = document.getElementById('substance-event-method-other')! as HTMLInputElement

        // If the substance category changes, change_options is true (update options to methods in the new category)
        if (change_options) {
            const method_options : Array<{value:string, label:string}> = []

            this._substances_used[substance].forEach((method) => {
                method_options.push({
                    "value": method.label,
                    "label": method.label
                })
            })
            this.update_sub_options(method_options, method_options_el)
        }

        this.update_unit_options(substance, method_options_el.value)
        this.update_type_options(substance, method_options_el.value)

        if (method_options_el.value.includes('Other')) {
            method_other_el.disabled = false
            method_other_el.required = true
            this._modal_sub_event.setElementClass({
                '#substance-method-other': ['is-hidden', false]
            })
        } else {
            method_other_el.disabled = true
            method_other_el.required = false
            this._modal_sub_event.setElementClass({
                '#substance-method-other': ['is-hidden', true]
            })
        }

        method_options_el.addEventListener('input', () => {
            this.update_method_options(substance, false)
        })
    }

    public substance_event_options() {
        const category_options_el = document.getElementById('substance-event-category') as HTMLInputElement
        const category_options : Array<{value:string, label:string}> = []

        Object.keys(this._substances_used).forEach((key) => {
            const substance : {id : string, label : string} = this._substance_list.category.find(sub => sub.id === key.toString())!
            category_options.push({
                "value": substance.id,
                "label": substance.label
            })
        })

        this.update_sub_options(category_options, category_options_el)
        this.update_method_options(category_options_el.value, true)

        category_options_el.addEventListener('input', () => {
            this.update_method_options(category_options_el.value, true)
        })

        document.getElementById('substance-event-amount-unknown')!.addEventListener('input', () => {
            this.update_amount()
        })

        document.getElementById('substance-event-units-unknown')!.addEventListener('input', () => {
            this.update_units()
        })
    }

    private get_substance_event_properties(data: FormData): UseEventProperties {
        const amount = (data.get('substance-event-amount-unknown') === "unknown") ? "unknown" : Number(data.get('substance-event-amount'))
        const units = (data.get('substance-event-units-unknown') === "unknown") ? "unknown" : data.get('substance-event-units') as string

        const properties : UseEventProperties = {
            "category": data.get('substance-event-category') as string,
            "substance": this._substance_list.category.find(sub => sub.id === data.get('substance-event-category') as string)!.label,
            "methodType": data.get('substance-event-type') as string,
            "method": data.get('substance-event-method') as string,
            "methodOther": data.get('substance-event-method-other') as string,
            "times": Number(data.get('substance-event-occasions')),
            "amount": amount,
            "units": units,
            "unitsOther": data.get('substance-event-units-other') as string,
            "note": data.get('substance-event-notes') as string
        }
        return properties
    }


    // Handle click date:
    public click_date(ev: DateClickArg) {

        console.log(`Edit.click_date(): ${ev.dateStr}`)
        
        switch (this._mode) {
            case 'add-key':
                document.getElementById('add-key-event')!.innerText = "Add to Timeline"
                this._modal_key_event.populateText({
                    '.subtitle': ev.date.toDateString()
                }).open((data: FormData)=>{
                    this._event_list.add(new KeyEvent(ev.dateStr, data.get('key-text') as string))
                })
                break;
            case 'add-su':
                // If the chosen date has a no-use event, then substance use events cannot be added.
                const no_use_events = this._event_list.get_events().filter((event)  => NoUseEvent.prototype.isPrototypeOf(event))
                const no_use_dates = no_use_events.map((event) => event.date)

                this._notification.innerHTML = 'Click a date on the calendar to add a <b>substance use event</b>.'

                if (no_use_dates.includes(ev.dateStr)) {
                    this._notification.innerHTML = 'Please select a valid date for the substance event.'
                } else {
                    this._notification.innerHTML = 'Click a date on the calendar to add a <b>substance use event</b>.'

                    document.getElementById('add-substance-event')!.innerText = "Add to Timeline"

                    this.substance_event_options()
                    this.update_amount()

                    this._modal_sub_event.populateText({
                        '.subtitle': ev.date.toDateString()
                    }).open((data: FormData)=>{
                        const properties : UseEventProperties = this.get_substance_event_properties(data)
                        this._event_list.add(new UseEvent(ev.dateStr, properties))
                    })  
                }
                break;
            case 'no-sub':
                this._event_list.add(new NoUseEvent(ev.dateStr))
            case 'copy':
                if (this._copy_buffer) {
                    const copy = this._copy_buffer.clone()
                    copy.set_date(ev.dateStr).set_gid(this._copy_buffer.gid)
                    this._event_list.add(copy, false)
                }
                break;
            default:

        }
    }


    // Handle select date range:
    public select_range(ev: DateSelectArg) {

        console.log(`Edit.select_range(): ${ev.startStr} to ${ev.endStr}`)

        const until = new Date(ev.endStr)
        until.setDate(ev.end.getDate() - 2)
        const untilStr = until.toISOString().substring(0,10)

        switch (this._mode) {
            case 'add-key':
                this._modal_key_event.populateText({
                    '.subtitle': `${ev.start.toDateString()} to ${until.toDateString()}`
                }).open((data: FormData)=>{

                    const key = new KeyEvent(ev.startStr, data.get('key-text') as string)
                    
                    this._event_list.import_events(key.make_recurrence([1,2,3,4,5,6,7], untilStr))
                })
                break;
            case 'no-sub':
                const key = new NoUseEvent(ev.startStr)

                this._event_list.import_events(key.make_recurrence([1,2,3,4,5,6,7], untilStr))
                break;
            default:

        }
    }


    // Handle click on event:
    public click_event(ev: EventClickArg) {

        console.log(`Edit.click_event(): ${ev.event.title} (event ${ev.event.id} / group ${ev.event.groupId})`)

        switch (this._mode) {
            case 'copy':
                // FIXME: if nothing in buffer, put in buffer.
                //        if something in buffer, duplicate.
                this._copy_buffer = this._event_list.get_event(Number(ev.event.id))
                this._notification.innerHTML = `Click any date to paste the event called <b>${this._copy_buffer.title}</b>.`

                break;
            case 'delete':
                this.delete_event(Number(ev.event.id))
                break;
            default:
                // Edit key/use events on default

                const clicked_event = this._event_list.get_event(Number(ev.event.id))
                if (KeyEvent.prototype.isPrototypeOf(clicked_event)) {
                    const key_event_data: {[name: string]: string} = {
                        "key-text": clicked_event.title
                    }
                    this._modal_key_event.populateForm(key_event_data)

                    document.getElementById('add-key-event')!.innerText = "Update";

                    this._modal_key_event.populateText({
                        '.subtitle': clicked_event.date
                    }).open((data: FormData)=> {
                        const group = this._event_list.get_event_group(Number(ev.event.groupId));
                        group.forEach((event) => {
                            (event as KeyEvent).set_properties({
                                "title": data.get('key-text') as string
                            });
                        })
                        ev.event.setProp('title', data.get('key-text') as string)
                        sessionStorage.setItem('eventsList', JSON.stringify(this._event_list.get_events()))
                    })
                } else if (UseEvent.prototype.isPrototypeOf(clicked_event)) {
                    let use_event_data: {[name: string]: string} = {
                        "substance-event-units-other": (clicked_event as UseEvent).properties.unitsOther,
                        "substance-event-occasions": ((clicked_event as UseEvent).properties.times).toString(),
                        "substance-event-notes": (clicked_event as UseEvent).properties.note,
                        "substance-event-type": (clicked_event as UseEvent).properties.methodType,
                    }

                    if ((clicked_event as UseEvent).properties.amount === "unknown") {
                        (document.getElementById('substance-event-amount-unknown') as HTMLInputElement).checked = true;
                    } else {
                        use_event_data["substance-event-amount"] = ((clicked_event as UseEvent).properties.amount).toString()
                    }

                    if ((clicked_event as UseEvent).properties.units === "unknown") {
                        (document.getElementById('substance-event-units-unknown') as HTMLInputElement).checked = true;
                    } else {
                        use_event_data["substance-event-units"] = ((clicked_event as UseEvent).properties.units)
                    }

                    this.substance_event_options() 
                    this._modal_sub_event.populateForm({ "substance-event-category": (clicked_event as UseEvent).properties.category})
                    this.update_method_options((clicked_event as UseEvent).properties.category, true)
                    this._modal_sub_event.populateForm({ "substance-event-method-other": (clicked_event as UseEvent).properties.methodOther,
                                                         "substance-event-method": (clicked_event as UseEvent).properties.method,})
                    this.update_method_options((clicked_event as UseEvent).properties.category, false)
                    this.update_type_options((clicked_event as UseEvent).properties.category, (clicked_event as UseEvent).properties.method)
                    this.update_unit_options((clicked_event as UseEvent).properties.category, (clicked_event as UseEvent).properties.method)
                    this.update_amount()
                    this._modal_sub_event.populateForm(use_event_data)

                    const units_options_el = document.getElementById('substance-event-units') as HTMLInputElement
                    const units_other_el = document.getElementById('substance-event-units-other') as HTMLInputElement

                    if (units_options_el.value == "other_unit") {
                        units_other_el.disabled = false
                        units_other_el.required = true
                    }

                    document.getElementById('add-substance-event')!.innerText = "Update"

                    this._modal_sub_event.populateText({
                        '.subtitle': clicked_event.date
                    }).open((data: FormData)=>{
                        const properties : UseEventProperties = this.get_substance_event_properties(data);
                        const group = this._event_list.get_event_group(Number(ev.event.groupId));
                        group.forEach((event) => {
                            (event as UseEvent).set_properties(properties);
                        })
                        ev.event.setProp('title', this._event_list.get_event(Number(ev.event.id)).title)
                        sessionStorage.setItem('eventsList', JSON.stringify(this._event_list.get_events()))
                    })
                }
        }

    }


    // Delete event or events (group events):
    private delete_event(id: number) {
        const event = this._event_list.get_event(id)
        const n_siblings = this._event_list.get_event_siblings(id).length

        if (n_siblings > 0) {
            this._modal_confirm.populateText({
                '.modal-card-title': 'Confirm Deletion of Multiple Events',
                '.content': `<p>The event on <b>${event.date}</b> titled <i>${event.title}</i> is related to <b>${n_siblings}</b> other events.</p>` +
                            `<p>Confirm whether you want to delete <u>just this event</u>, or <u>all</u> of the events in the group.</p>`
            }).setElementClass({
                '#delete-all-button': ['is-hidden', false]
            }).open((data: FormData)=>{
                data.forEach((v, k)=>console.log(`${v} ${k}`))
                if (data.get('action') == 'single')
                    this._event_list.delete_event(id)
                else if (data.get('action') == 'multiple')
                    this._event_list.delete_group(event.gid)
            }) 

        } else {
            this._modal_confirm.populateText({
                '.modal-card-title': 'Confirm Event Deletion',
                '.content': `<p>Confirm that you want to delete the event on <b>${event.date}</b> titled <i>${event.title}</i>.</p>`
            }).setElementClass({
                '#delete-all-button': ['is-hidden', true]
            }).open(()=>{
                this._event_list.delete_event(id)
            })
        }
    }


    // Misc. functions:
    public get_event_list(): CalendarEventList {
        return this._event_list
    }

    public update_substances_used(new_list: {[name: string]: Array<SubstanceInfo>}) {
        this._substances_used = new_list
    }
}
