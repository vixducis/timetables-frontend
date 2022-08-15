import { DateTime } from "luxon";

export interface ShowJson {
    id: number;
    artist: string;
    start: number;
    end: number;
}

export class Show {
    public favorite: boolean = false;
    public rating: null|number = null;
    public comments: string = '';
    
    constructor(
        public id: number,
        public artist: string,
        public start: DateTime,
        public end: DateTime
    ){}

    public static fromJson(json: ShowJson): Show {
        return new Show(
            json.id,
            json.artist,
            DateTime.fromSeconds(json.start),
            DateTime.fromSeconds(json.end)
        );
    }

    public getDuration(): number {
        return this.end.diff(this.start, "minutes").as("minutes");
    }

    public static sortFn(a: Show, b: Show): number {
        if (a.start > b.start) {
            return 1;
        }
        if (a.start < b.start) {
            return -1;
        }
        return 0;
    }
}

export interface ShowDb {
    id: number;
    favorite: boolean;
    rating?: number;
    comment?: string;
}