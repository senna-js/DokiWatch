import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

interface Chapter {
  id: string;
  title: string;
  url: string;
}

interface Manga {
  id: string;
  name: string;
  alternatives: string;
  author: string;
  status: string;
  updated: string;
  views: string;
  rating: string;
  description: string;
  genres: string[];
  chapters: Chapter[];
}

const Read: React.FC = () => {
  const { mangaId } = useParams<{ mangaId: string }>();
  const [manga, setManga] = useState<Manga | null>(null);

  useEffect(() => {
    const fetchMangaDetails = async () => {
      try {
        const response = await axios.get(`/api/manga?name=${mangaId}`);
        setManga(response.data);
      } catch (error) {
        console.error('Error fetching manga details:', error);
      }
    };

    fetchMangaDetails();
  }, [mangaId]);

  if (!manga) {
    return <p>Loading...</p>;
  }

  console.log("Manga details", manga);

  return (
    <div>
      <h1>{manga.name}</h1>
      <p><strong>Alternatives:</strong> {manga.alternatives}</p>
      <p><strong>Author:</strong> {manga.author ? manga.author.trim() : 'N/A'}</p>
      <p><strong>Status:</strong> {manga.status}</p>
      <p><strong>Updated:</strong> {manga.updated}</p>
      <p><strong>Views:</strong> {manga.views}</p>
      <p><strong>Rating:</strong> {manga.rating || 'N/A'}</p>
      <p><strong>Description:</strong> {manga.description ? manga.description.trim() : 'N/A'}</p>
      <p><strong>Genres:</strong> {manga.genres ? manga.genres.join(', ') : 'N/A'}</p>
      <h2>Chapters</h2>
      <ul>
        {manga.chapters && manga.chapters.length > 0 ? (
          manga.chapters.map((chapter) => (
            <li key={chapter.id}>
              <a href={chapter.url} target="_blank" rel="noopener noreferrer">
                {chapter.title}
              </a>
            </li>
          ))
        ) : (
          <p>No chapters available.</p>
        )}
      </ul>
    </div>
  );
};

export default Read;