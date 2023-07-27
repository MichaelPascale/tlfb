/* editor.ts
 *
 * The Editor class defines a type of object that manages the state of the user
 * interface, responds to clicks, opens dialogues, and generally handles
 * "editing" actions.
 *
 * Copyright (c) 2023, Michael Pascale <mppascale@mgh.harvard.edu>
 * Last modified: 2023-07-27
 */

import { Calendar, DateSelectArg, EventClickArg } from "@fullcalendar/core";
import { DateClickArg } from "@fullcalendar/interaction";

import { Modal } from './modal'
import { CalendarEventList, KeyEvent, UseEvent, CalendarEvent } from "./state";

// Keep track of the edit mode.
export class Editor {
    private _mode: 'add-key' | 'add-su' | 'copy' | 'delete' | null;
    private _notification: HTMLElement;

    // The copy buffer stores an event id to be copied.
    private _copy_buffer: CalendarEvent | null = null

    private _calendar: Calendar;

    private _modal_key_event: Modal;
    private _modal_sub_event: Modal;
    private _modal_confirm: Modal;

    private _event_list: CalendarEventList

    public constructor(calendar: Calendar) {
        this._mode = null;
        this._calendar = calendar;

        this._notification = document.getElementById('mode-notification') as HTMLElement

        // Set up event handlers.
        document.querySelectorAll('.tlfb-edit-mode').forEach(x => x.addEventListener('click', (ev) => this.mode(ev)))

        this._calendar.on('dateClick', (ev) => this.click_date(ev))
        this._calendar.on('eventClick', (ev) => this.click_event(ev))
        this._calendar.on('select', (ev) => this.select_range(ev))

        this._modal_key_event = new Modal('modal-key-event')
        this._modal_sub_event = new Modal('modal-substance-event')
        this._modal_confirm = new Modal('modal-confirm')

        this._event_list = new CalendarEventList('2023-04-05', '2021-07-16', this._calendar)
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
                this._mode = 'add-su'
                this._notification.innerHTML = 'Click a date on the calendar to add a <b>substance use event</b>.'
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

    // HANDLE CLICK DATE
    public click_date(ev: DateClickArg) {
        console.log(`Edit.click_date(): ${ev.dateStr}`)
        
        switch (this._mode) {
            case 'add-key':
                this._modal_key_event.populateText({
                    '.subtitle': ev.date.toDateString()
                }).open((data: FormData)=>{
                    this._event_list.add(new KeyEvent(ev.dateStr, data.get('key-text') as string))
                })
                break;
            case 'add-su':
                this._modal_sub_event.populateText({
                    '.subtitle': ev.date.toDateString()
                }).open((data: FormData)=>{
                    this._calendar.addEvent({
                        title: data.get('key-text') as string,
                        start: ev.dateStr
                    })
                })
                break;
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

    // HANDLE SELECT DATE RANGE
    public select_range(ev: DateSelectArg) {
        console.log(`Edit.select_range(): ${ev.startStr} to ${ev.endStr}`)

        const until = new Date()
        until.setDate(ev.end.getDate() - 1)
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
            default:

        }
    }

    // HANDLE CLICK ON EVENT
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

        }

    }


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
                console.log(data)
                data.forEach((v, k)=>console.log(`${v} ${k}`))
                if (data.get('action') == 'single')
                    this._event_list.delete_event(id)
                else
                    this._event_list.delete_group(event.gid)
            }) // FIXME: Second handler for delete group.

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
}
