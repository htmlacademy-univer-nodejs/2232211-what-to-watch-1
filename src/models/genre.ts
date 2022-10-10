export const Genres = [
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

export type Genre = typeof Genres[number];

export const checkGenre = (genre: string): genre is Genre => Genres.indexOf(genre) >= 0;

export const toGenre = (genre: string): Genre => {
  if (!checkGenre(genre)) {
    throw new Error(`Value ${genre} is not Genre.`);
  }
  return genre;
};
