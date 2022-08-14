import { EventDay, EventDayJson } from "./eventday";

export interface EventJson {
    name: string;
    code: string;
    year: number;
    days: EventDayJson[];
}

export class Event {
    constructor(
        public name: string,
        public code: string,
        public year: number,
        public days: EventDay[]
    ){}

    public static fromJson(json: EventJson): Event {
        return new Event(
            json.name,
            json.code,
            json.year,
            json.days.map(day => EventDay.fromJson(day))
        );
    }
}