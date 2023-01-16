export const GENRES = [
  'comedy',
  'crime',
  'documentary',
  'drama',
  'horror',
  'family',
  'romance',
  'scifi',
  'thriller'
];

export type Genre = typeof GENRES[number];

export const checkGenre = (genre: string): genre is Genre => GENRES.indexOf(genre) >= 0;

export const toGenre = (genre: string): Genre => {
  if (!checkGenre(genre)) {
    throw new Error(`Value ${genre} is not Genre.`);
  }
  return genre;
};
