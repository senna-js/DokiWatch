export interface AnimeData {
  id: number;
  idMal: number;
  title: {
    romaji: string;
    english: string;
  };
  image: string;
  color: string;
  entryId?: number;
}
