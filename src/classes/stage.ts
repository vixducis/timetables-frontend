import { EventDay } from "./eventday";
import { Show, ShowJson } from "./show";

export interface StageJson {
    stage: string;
    shows: ShowJson[]
}

export class Stage {
    constructor(
        public name: string,
        public shows: Show[]
    ) {}

    public static fromJson(json: StageJson): Stage {
        return new Stage(
            json.stage,
            json.shows.map(show => Show.fromJson(show)).sort((a, b) => {
                if (a.start > b.start) {
                    return 1;
                }
                if (a.start < b.start) {
                    return -1;
                }
                return 0;
            })
        );
    }

    public getStartGap(day: EventDay): number {
        let hours = day.getHours();
        return hours.length > 0 && this.shows.length > 0 
            ? this.shows[0].start.diff(hours[0], "minutes").as("minutes")
            : 0;
    }

    public getEndGap(day: EventDay): number {
        let hours = day.getHours();
        return hours.length > 0 && this.shows.length > 0 
            ? hours[hours.length-1].plus({hours: 1})
                .diff(this.shows[this.shows.length-1].end, "minutes")
                .as("minutes")
            : 0;
    }

    public getGap(idx: number) {
        return this.shows[idx] !== undefined && this.shows[idx+1] !== undefined
            ? this.shows[idx+1].start.diff(this.shows[idx].end, "minutes").as("minutes")
            : 0;
    }
}