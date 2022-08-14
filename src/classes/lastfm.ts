export interface ILastFmArtist {
    artist: {
        tags: {
            tag: {name: string}[]
        },
        bio: {
            summary?: string
        }
    }
}

export interface LastFmResponse {
    error?: number;
}

export class LastFmArtist {
    constructor(
        public bio: string = '',
        public tags: string[] = []
    ) {}

    public static fromJson(json: ILastFmArtist): LastFmArtist {
        return new LastFmArtist(
            
            (json.artist.bio.summary ?? "")
                .replace(/<([^</> ]+)[^<>]*?>[^<>]*?<\/\1> */gi, "").trim(),
            json.artist.tags.tag.map(tag => tag.name)
        );
    }
}