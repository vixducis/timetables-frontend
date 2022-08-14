import { DateTime } from 'luxon';
import { Stage, StageJson } from './stage';

export interface EventDayJson {
    date: number;
    stages: StageJson[];
} 

export class EventDay {
    private hours: null|DateTime[] = null;

    constructor(
        public date: DateTime,
        public stages: Stage[]
    ) {}

    public static fromJson(json: EventDayJson): EventDay {
        return new EventDay(
            DateTime.fromSeconds(json.date),
            json.stages.map(stage => Stage.fromJson(stage))
        );
    }

    public getHours(): DateTime[] {
        if (this.hours === null) {
            let minimum = this.date.plus({ days: 2 });
            let maximum = this.date.plus({ days: -2 });
            this.stages.forEach(stage => {
                stage.shows.forEach(show => {
                    if(show.start < minimum) {
                        minimum = show.start;
                    }
                    if(show.end > maximum) {
                        maximum = show.end;
                    }
                })
            });
            minimum = minimum.startOf('hour');
            maximum = maximum.minute === 0 
                ? maximum.startOf('hour')
                : maximum.startOf('hour').plus({ hours: 1 });

            this.hours = [];
            for (let i=minimum; i<maximum; i=i.plus({hour: 1})) {
                this.hours.push(i);
            }
        }
        return this.hours;
    }

    public getNumberOfHours(): number {
        return this.getHours().length;
    }
}