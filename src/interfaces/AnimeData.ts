export interface AnimeData {
    mal_id: number,
    title: {
        romaji: string,
        english: string
    }
    image: {
        large: string,
        color: string
    }
}