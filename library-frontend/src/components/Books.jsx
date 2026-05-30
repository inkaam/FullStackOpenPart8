import { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { ALL_BOOKS } from '../queries';

const Books = (props) => {
  const [selectedGenre, setSelectedGenre] = useState('all genres');

  const { loading, data } = useQuery(ALL_BOOKS);

  if (!props.show) {
    return null;
  }

  if (loading) {
    return <div>loading...</div>;
  }

  const allBooks = data?.allBooks || [];

  const booksToShow =
    selectedGenre === 'all genres'
      ? allBooks
      : allBooks.filter((book) => book.genres.includes(selectedGenre));

  const allGenresWithDupes = allBooks.flatMap((book) => book.genres || []);
  const uniqueGenres = [...new Set(allGenresWithDupes)];

  const handleGenreChange = (genre) => {
    setSelectedGenre(genre);
  };

  return (
    <div>
      <h2>books</h2>

      {selectedGenre !== 'all genres' && (
        <p>
          in genre <strong>{selectedGenre}</strong>
        </p>
      )}

      <table>
        <thead>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
        </thead>
        <tbody>
          {booksToShow.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        {uniqueGenres.map((genre) => (
          <button key={genre} onClick={() => handleGenreChange(genre)}>
            {genre}
          </button>
        ))}
        <button onClick={() => handleGenreChange('all genres')}>
          all genres
        </button>
      </div>
    </div>
  );
};

export default Books;
