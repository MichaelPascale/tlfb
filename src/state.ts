/* state.ts
 *
 * Manage calendar events separately from the calendar UI.
 *
 * Copyright (c) 2023, Michael Pascale <mppascale@mgh.harvard.edu>
 * Last modified: 2023-07-27
 */

import { Calendar } from "@fullcalendar/core";
import { COLOR_WHITE, COLOR_TEXT, COLOR_PURPLE, COLOR_YELLOW } from './constants'; 

type UseEventProperties = {
    category: string;
    substance: string;
    method: string;
    times: number;
    amount: number;
    units: string;
    unitsOther: string;
}

class CalendarDate {
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

    protected readonly _type: 'key' | 'use';

    public constructor(date: string, type: 'key' | 'use') {
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

    public get title() {
        return this._title;
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
    public make_recurrence(weekdays: Array<number>, until: string): Array<CalendarEvent> {

        const events: Array<CalendarEvent> = [];

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

    public get colors(): [string, string] {
        return [COLOR_YELLOW, COLOR_TEXT]
    } 
}

export class UseEvent extends CalendarEvent {
    private _category = '';
    private _substance = '';
    private _method = '';
    private _times = 0;
    private _amount = 0;
    private _units = '';
    private _unitsOther = '';

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
            category:   this._category,
            substance:  this._substance,
            method:     this._method,
            times:      this._times,
            amount:     this._amount,
            units:      this._units,
            unitsOther: this._unitsOther
        };
    }

    public set_properties(properties: UseEventProperties): CalendarEvent {
        this._category   = properties.category;
        this._substance  = properties.substance;
        this._method     = properties.method;
        this._times      = properties.times;
        this._amount     = properties.amount;
        this._units      = properties.units;
        this._unitsOther = properties.unitsOther;
        this.update_title();

        return this;
    }

    // Set the title for the event given the event properties.
    private update_title() {
        this._title = this._category + ' (' + this._substance + ') ' + this._method + ' ' + this._amount + this._units + ' over ' + this._times + ' occasions';
    }
}

// A CalendarEvents object stores an array of calendar events and provides
// a safe interface through which they can be accessed and updated.
export class CalendarEventList {
    private _next_eid: number;
    private _next_gid: number;
    private _events: Array<CalendarEvent>;
    private _fullcalendar: Calendar;

    public readonly start_date: CalendarDate;
    public readonly end_date: CalendarDate;

    // Start and end dates are *inclusive *. 
    public constructor(start: string, end: string, fullcalendar: Calendar,  events: Array<CalendarEvent> | null = null) {
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

    public get_events(): Array<CalendarEvent> {
        return this._events;
    }

    public add(event: CalendarEvent, reassign=true): CalendarEventList {
        this.import_events([event], reassign);
        return this;
    }

    public delete_event(eid: number): CalendarEventList {
        this._events = this._events.filter((event: CalendarEvent) => event.eid != eid);
        this._fullcalendar.getEventById(eid.toString())?.remove()
        return this;
    }

    public delete_group(gid: number): CalendarEventList {
        this._events = this._events.filter((event: CalendarEvent) => event.gid != gid);

        this._fullcalendar.getEvents().forEach(
            (event) => {if (event.groupId == gid.toString()) event.remove()}
        )

        return this;
    }

    // Import events from an array.
    public import_events(events: Array<CalendarEvent>, reassign=true): CalendarEventList {
        
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
        
        return this;
    }

    public serialize_events(as: 'csv' | 'json') {
        switch (as) {
            case 'csv':
                alert('CalendarEvents.serialize_events(\'csv\'): Not implemented.')
                break;

            case 'json':
                alert('CalendarEvents.serialize_events(\'json\'): Not implemented.')
                break;
        }
    }
}