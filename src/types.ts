/* types.ts
 *
 * Types used throughout the project.
 *
 * Last modified: 2024-08-16
 */

export type TLFBProperties = {
    subject:   string,
    record:    string,
    pid:   string,
    timepoint: string,
    start:     string,
    end:       string,
    keyfield:  string,
    staff:     string,
    days:      number,
}

export type UseEventProperties = {
    category: string;
    substance: string;
    methodType: string;
    methodOther: string;
    method: string;
    times: number;
    amount: number | "unknown";
    units: string;
    unitsOther: string;
    note: string
}

export type SubstanceInfo = {
    label:  string,
    alt?:   string,
    units?: string[],
    type?: string[],
    note?: string,
}

export type SubstanceList = {
    category: {
            id:    string;
            label: string;
    }[],
    substance: {
        [name: string]: SubstanceInfo[]
    }
}

export type SubstanceUseList =  {
    [name: string]: SubstanceInfo[]
}

export type JSONEvent = {
    _eid: number,
    _gid: number,
    _title: string,
    _type: "use" | "no-use" | "key",
    _date: {
        _date: string
    } | string,
    _category?: string,
    _substance?: string,
    _method?: string,
    _times?: number,
    _amount?: number,
    _units?: string,
    _unitsOther?: string,
    _note?: string
}

export type JSONData = {
    subject: string,
    event: string,
    pid: string,
    start: string,
    end: string,
    staff: string,
    record: string,
    keyfield: string,
    datetime: string,
    events: [JSONEvent]
}

export type SerializedEvent = {
    [name: string]: string | number | object | null
}
