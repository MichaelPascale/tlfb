interface CalendarEvent {
    // Event ID
    // A unique identifier for the event.
    eid: number;
    // Group ID.
    // Events are grouped if they belong to the same recurrence.
    gid: number;
    // Event type.
    // The Timeline Follow-back allows for "key events" and substance use events.
    type: 'key' | 'sub';
    // Date of the event.
    date: Date;
    // Is the event recurring?
    recur: Boolean;
};

// A CalendarEvents object stores an array of calendar events and provides
// a safe interface through which they can be accessed and updated.
class CalendarEvents {
    private _next_eid: number;
    private _next_gid: number;
    private _events: Array<CalendarEvent>;
    public readonly start_date: Date;
    public readonly end_date: Date;

    // Start and end dates are *inclusive *. 
    constructor(start: Date, end: Date) {
        this._next_eid = 1;
        this._next_gid = 1;
        this._events = [];
        this.start_date = start;
        this.end_date = end;
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

    public get_events() {
        return this._events;
    }

    public add_event(type: 'key' | 'sub', date: Date) {
        this._events.push({
            eid: this._get_next_eid(),
            gid: this._get_next_gid(),
            type: type,
            date: date,
            recur: false
        });

        return this;
    }

    public delete_event(eid: number) {
        this._events = this._events.filter((event: CalendarEvent) => event.eid != eid);
        return this;
    }

    public delete_group(gid: number) {
        this._events = this._events.filter((event: CalendarEvent) => event.gid != gid);
        return this;
    }

    // Import events from an array.
    public import_events(events: Array<CalendarEvent>) {
        
        // Group IDs must be preserved.
        const gid_mapping = 
            events.reduce((acc: Map<number, number>, cur: CalendarEvent) => {
                if (!acc.has(cur.gid))
                    acc.set(cur.gid, this._get_next_gid());
                return acc;
            }, new Map());


        this._events = 
            this._events.concat(events.map((event: CalendarEvent) => {
                // Events can be assigned a completely new eid.
                event.eid = this._get_next_eid();
                // @ts-ignore
                // Map.prototype.get() can return undefined. That shouldn't happen here.
                event.gid = gid_mapping.get(event.gid);
                return event;
            }));
        
        return this;
    }
};


// TODO: Can you create a runtime "checker" in TypeScript to validate foreign
// objects such as those uploaded in a file?