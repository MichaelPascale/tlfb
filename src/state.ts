/* state.ts
 *
 * Manage calendar events separately from the calendar UI.
 *
 * Copyright (c) 2024, Michael Pascale <mppascale@mgh.harvard.edu>
 *                     Ivy Zhu <izhu1@mgh.harvard.edu>
 * Last modified: 2024-08-08
 */

import { Calendar } from "@fullcalendar/core";
import { COLOR_WHITE, COLOR_TEXT, COLOR_PURPLE, COLOR_YELLOW, COLOR_ORANGE } from './constants'; 

import { JSONEvent, UseEventProperties } from './types'

export class CalendarDate {
    private _date: Date;

    // CalendarDate expects ISO 8601 'YYYY-MM-DD' date and interprets it in UTC.
    public constructor(date: string) {

        if (!(/^\d{4}-\d{2}-\d{2}$/).test(date))
            throw new Error('CalendarDate expects a date in \'YYYY-MM-DD\' format.');

        this._date = new Date(date);

        if (isNaN(this._date.valueOf()))
            throw new Error('CalanderDate received an invalid date.');
    }

    public get Date(): Date {
        return this._date;
    }

    // Weekday where Sunday == 1.
    public get weekday(): number {
        return this._date.getUTCDay() + 1;
    }

    // Day of the month.
    public get day(): number {
        return this._date.getUTCDate();
    }

    // Month where January == 1.
    public get month(): number {
        return this._date.getUTCMonth() + 1;
    }

    // Four digit year.
    public get year(): number  {
        return this._date.getUTCFullYear();
    }

    public toString(): string {
        return this._date.toISOString().substring(0,10)
    }

    public set_day(day: number): CalendarDate {
        this._date.setUTCDate(day);
        return this;
    }

    public isSameDay(date: CalendarDate) {
        return this.year == date.year && this.month == date.month && this.day == date.day;
    }

    public isAfter(date: CalendarDate): boolean {
        return (this.year == date.year && this.month == date.month && this.day > date.day) ||
            (this.year == date.year && this.month > date.month) ||
            (this.year > date.year);
    }

    public isBefore(date: CalendarDate): boolean {
        return (this.year == date.year && this.month == date.month && this.day < date.day) ||
            (this.year == date.year && this.month < date.month) ||
            (this.year < date.year);
    }

    public get next_day() {
        return new CalendarDate(this.toString()).set_day(this.day + 1);
    }

    public get previous_day() {
        return new CalendarDate(this.toString()).set_day(this.day - 1);
    }
}

export abstract class CalendarEvent {

    private _eid = 0;
    private _gid = 0;
    private _date: CalendarDate;
    protected _title = 'Uninitialized CalendarEvent';

    protected readonly _type: 'key' | 'use' | 'no-use';

    public constructor(date: string, type: 'key' | 'use' | 'no-use') {
        this._date = new CalendarDate(date);
        this._type = type;
    }

    public abstract clone(): CalendarEvent;

    public abstract get colors(): [string, string];

    public get eid() {
        return this._eid;
    }

    public get gid() {
        return this._gid;
    }

    public get date() {
        return this._date.toString();
    }

    public get date_object() {
        return this._date
    }

    public get title() {
        return this._title;
    }

    public get type() {
        return this._type
    }

    public set_eid(eid: number): CalendarEvent {
        this._eid = eid;
        return this;
    }

    public set_gid(gid: number): CalendarEvent {
        this._gid = gid;
        return this;
    }

    public set_date(date: string | CalendarDate): CalendarEvent {
        if (date instanceof CalendarDate)
            this._date = date;
        else
            this._date = new CalendarDate(date);
        return this;
    }

    // Recurring events are represented as an array of events with the same gid.
    // The until date for a recurring event is *inclusive*.
    public make_recurrence(weekdays: number[], until: string): CalendarEvent[] {

        const events: CalendarEvent[] = [];

        for (let dt = this._date; !dt.isAfter(new CalendarDate(until)); dt = dt.next_day) {
            if (weekdays.includes(dt.weekday)) {
                events.push(this.clone().set_gid(this.gid).set_eid(this.eid).set_date(dt));
            }
        }

        return events;
    }
}

export class KeyEvent extends CalendarEvent {

    public constructor(date: string, title: string) {
        super(date, 'key');
        this._title = title;
    }

    public clone(): CalendarEvent {
        return new KeyEvent(this.date, this._title);
    }

    public set_properties(properties: {title: string}): CalendarEvent {
        this._title = properties.title;

        return this;
    }

    public get colors(): [string, string] {
        return [COLOR_ORANGE, COLOR_TEXT]
    } 
}

export class UseEvent extends CalendarEvent {
    private _category = '';
    private _substance = '';
    private _methodType = '';
    private _methodTypeOther = "";
    private _method = '';
    private _methodOther = '';
    private _times = 0;
    private _amount = 0;
    private _units = '';
    private _unitsOther = '';
    private _note = '';

    public constructor(date: string, properties: UseEventProperties | null) {
        super(date, 'use');

        if (properties != null)
            this.set_properties(properties);
    }

    public clone(): CalendarEvent {
        return new UseEvent(this.date, this.properties);
    }

    public get colors(): [string, string] {
        return [COLOR_PURPLE, COLOR_WHITE]
    } 

    public get properties(): UseEventProperties {
        return {
            category:        this._category,
            substance:       this._substance,
            methodType:      this._methodType,
            methodTypeOther: this._methodTypeOther,
            method:          this._method,
            methodOther:     this._methodOther,
            times:           this._times,
            amount:          this._amount,
            units:           this._units,
            unitsOther:      this._unitsOther,
            note:            this._note
        };
    }

    public set_properties(properties: UseEventProperties): CalendarEvent {
        this._category       = properties.category;
        this._substance      = properties.substance;
        this._methodType     = properties.methodType;
        this._methodTypeOther = properties.methodTypeOther,
        this._method         = properties.method;
        this._methodOther    = properties.methodOther;
        this._times          = properties.times;
        this._amount         = properties.amount as number;
        this._units          = properties.units;
        this._unitsOther     = properties.unitsOther;
        this._note           = properties.note;
        this.update_title();

        return this;
    }

    // Set the title for the event given the event properties.
    private update_title() {
        let unit : string = this._units
        if (this._unitsOther != null && this._unitsOther != "") {
            unit = this._unitsOther
        } else if(this._units == null) {
            unit = ""
        }
        this._title =  this._method + ' ' + this._times + "x" + " | " + this._amount + " " + unit;
    }
}

export class NoUseEvent extends CalendarEvent {

    public constructor(date: string) {
        super(date, 'no-use');
        this._title = "No substances used";
    }

    public clone(): CalendarEvent {
        return new NoUseEvent(this.date);
    }

    public get colors(): [string, string] {
        return [COLOR_YELLOW, COLOR_TEXT] //
    } 
}

// A CalendarEvents object stores an array of calendar events and provides
// a safe interface through which they can be accessed and updated.
export class CalendarEventList {
    private _next_eid: number;
    private _next_gid: number;
    private _events: CalendarEvent[];
    private _fullcalendar: Calendar;

    public readonly start_date: CalendarDate;
    public readonly end_date: CalendarDate;

    // Start and end dates are *inclusive *. 
    public constructor(start: string, end: string, fullcalendar: Calendar,  events: CalendarEvent[] | null = null) {
        this._next_eid = 1;
        this._next_gid = 1;
        this._events = [];
        this._fullcalendar = fullcalendar;
        this.start_date = new CalendarDate(start);
        this.end_date = new CalendarDate(end);

        if (events != null)
            this.import_events(events);
    }

    private _get_next_eid() {
        const next_eid = this._next_eid;
        this._next_eid++;
        return next_eid;
    }

    private _get_next_gid() {
        const next_gid = this._next_gid;
        this._next_gid++;
        return next_gid;
    }

    public get_event(eid: number) {
        const event = this._events.find((event: CalendarEvent) => event.eid == eid);
        if (event == undefined)
            throw Error(`CalendarEventList.get_event(): Could not find event ${eid}.`)
        return event
    }

    public get_event_group(gid: number) {
        const events = this._events.filter((event: CalendarEvent) => event.gid == gid);
        if (events.length < 1)
            throw Error(`CalendarEventList.get_event_group(): Could not find events in group ${gid}.`)
        return events
    }

    public get_event_siblings(eid: number) {
        const event = this.get_event(eid);
        return this.get_event_group(event.gid).filter((event: CalendarEvent) => event.eid != eid)
    }

    public get_events(): CalendarEvent[] {
        return this._events;
    }

    public add(event: CalendarEvent, reassign=true): CalendarEventList {
        this.import_events([event], reassign);
        return this;
    }

    public delete_event(eid: number): CalendarEventList {
        this._events = this._events.filter((event: CalendarEvent) => event.eid != eid);
        this._fullcalendar.getEventById(eid.toString())?.remove()
        sessionStorage.setItem('eventsList', JSON.stringify(this.get_events()))
        return this;
    }

    public delete_substance(method: string): CalendarEventList {
        const remove_events = this._events.filter((event: CalendarEvent) => event.type === 'use' && (event as UseEvent).properties.method === method)

        this._events = this._events.filter((event: CalendarEvent) => !(event.type === 'use' && (event as UseEvent).properties.method === method))
        
        remove_events.forEach((event: CalendarEvent) => {
            this.delete_event(event.eid)
        })
        sessionStorage.setItem('eventsList', JSON.stringify(this.get_events()))
        return this
    }

    public delete_group(gid: number): CalendarEventList {
        this._events = this._events.filter((event: CalendarEvent) => event.gid != gid);

        this._fullcalendar.getEvents().forEach(
            (event) => {if (event.groupId == gid.toString()) event.remove()}
        )
        sessionStorage.setItem('eventsList', JSON.stringify(this.get_events()))
        return this;
    }

    // Import events from an array.
    public import_events(events: CalendarEvent[], reassign=true): CalendarEventList {

        // Prevent no-use events being placed on dates with substance use events
        const new_no_use = events.filter((event) => NoUseEvent.prototype.isPrototypeOf(event))
        let relevant_events = this.get_events().filter((event) => NoUseEvent.prototype.isPrototypeOf(event) || UseEvent.prototype.isPrototypeOf(event))
        relevant_events = relevant_events.concat(events.filter((event) => UseEvent.prototype.isPrototypeOf(event)))
        const invalid_dates = relevant_events.map((event) => event.date)

        const new_use = events.filter((event) => UseEvent.prototype.isPrototypeOf(event))
        const no_use_events = this.get_events().filter((event)  => NoUseEvent.prototype.isPrototypeOf(event))
        const no_use_dates = no_use_events.map((event) => event.date)

        new_no_use.forEach((event: CalendarEvent) => {
            if (invalid_dates.includes(event.date)) {
                const event_index = events.indexOf(event)
                events.splice(event_index, 1)
            }
        })

        new_use.forEach((event: CalendarEvent) => {
            if (no_use_dates.includes(event.date)) {
                const event_index = events.indexOf(event)
                events.splice(event_index, 1)
            }
        })

        // Group relationships must be preserved.
        const gid_mapping = 
            events.reduce((acc: Map<number, number>, cur: CalendarEvent) => {
                if (cur.gid == null)
                  throw new Error('Event is missing a GID and cannot be imported.');

                if (!acc.has(cur.gid))
                    acc.set(cur.gid, this._get_next_gid());
                    
                return acc;
            }, new Map());

        this._events = 
            this._events.concat(events.map((event: CalendarEvent) => {
                const eid = this._get_next_eid()
                const gid = gid_mapping.get(event.gid)

                // Events can be assigned a completely new eid.
                event.set_eid(eid);
                if (reassign)
                    // @ts-expect-error Map.prototype.get() can return undefined. That shouldn't happen here.
                    event.set_gid(gid);

                this._fullcalendar.addEvent({
                    id: event.eid.toString(),
                    groupId: event.gid.toString(),

                    start: event.date,
                    title: event.title,

                    textColor: event.colors[1],
                    backgroundColor: event.colors[0],
                    borderColor: event.colors[0]
                })

                return event;
            }));
        sessionStorage.setItem('eventsList', JSON.stringify(this.get_events()))
        return this;
    }

    public serialize_events(as: 'csv' | 'json') {
        switch (as) {
            case 'csv':
                const rows: (string | number)[][] = [
                    ["Event", "Date", "Type", "eID", 'gID', 'Title', "Category", "Substance", "MethodType", "MethodTypeOther", "Method", "MethodOther", "Times", 
                     "Amount", "Units", "UnitsOther", "Note"]
                ]
                
                // Create array (representing row) for each event
                let event_count = 0
                this.get_events().forEach((event) => {
                    event_count+=1
                    const event_row = [event_count, event.date, event.type, event.eid, event.gid, event.title]
                    
                    if (event.type === "use") {
                        const event_properties = (event as UseEvent).properties
                        event_row.push(event_properties.category)

                        // Strings with commas cause errors when converting to csv
                        if (event_properties.substance.includes(",")) {
                            event_row.push(event_properties.substance.replace(",", "."))
                        } else {
                            event_row.push(event_properties.substance)
                        }
                        event_row.push(event_properties.methodType, event_properties.method, event_properties.methodOther, 
                                       event_properties.times, event_properties.amount, event_properties.units, event_properties.unitsOther, 
                                       event_properties.note)
                    }

                    rows.push(event_row)
                })

                return rows
                
            case 'json':
                const json_events = JSON.stringify(this.get_events())
                
                const optimized_events = JSON.parse(json_events).map((event: JSONEvent) => {
                        event._date = (event._date as {_date: string})._date
                        return event
                })

                return optimized_events
        }
    }
}
