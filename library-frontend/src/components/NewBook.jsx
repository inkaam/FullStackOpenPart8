import { useMutation } from '@apollo/client/react';
import { useState } from 'react';
import { ALL_AUTHORS, ALL_BOOKS, CREATE_BOOK } from '../queries';


//// !!
//
// Kun ajoin uudestaan testejä test-chapter5 osiosta, tulee seuraava error:
//
// Error: expect(locator).toBeVisible() failed
// Locator: getByText('Test Book')
// Expected: visible
// Error: strict mode violation: getByText('Test Book') resolved to 2 elements:
//     1) <td>Test Book</td> aka getByRole('cell', { name: 'Test Book', exact: true })
//     2) <td>Classic Test Book</td> aka getByRole('cell', { name: 'Classic Test Book' })

// Call log:
//   - Expect "toBeVisible" with timeout 5000ms
//   - waiting for getByText('Test Book')
//
//Toimi ekalla kerralla ihan oikein, mutta kun ajoi uudestaa alkoi herjaamaan tuosta, eli testi vissiin tunnistaa
// tosi herkästi samankaltaisen osion
////
const NewBook = (props) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [published, setPublished] = useState('');
  const [genre, setGenre] = useState('');
  const [genres, setGenres] = useState([]);

  // refactorQueries välimusitin päivittämistä varten
  const [createBook] = useMutation(CREATE_BOOK, {
    refetchQueries: [{ query: ALL_AUTHORS }, { query: ALL_BOOKS }],
  });
  if (!props.show) {
    return null;
  }

  const submit = async (event) => {
    event.preventDefault();

    await createBook({
      variables: { title, published: Number(published), author, genres },
    });

    setTitle('');
    setPublished('');
    setAuthor('');
    setGenres([]);
    setGenre('');

    if (props.setPage) {
      props.setPage('books');
    }
  };
  const addGenre = () => {
    setGenres(genres.concat(genre));
    setGenre('');
  };

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          <label>
            title
            <input
              value={title}
              onChange={({ target }) => setTitle(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            author
            <input
              value={author}
              onChange={({ target }) => setAuthor(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            published
            <input
              type="number"
              value={published}
              onChange={({ target }) => setPublished(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            genre
            <input
              value={genre}
              onChange={({ target }) => setGenre(target.value)}
            />
          </label>
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>

        <div>genres: {genres.join(' ')}</div>

        <button type="submit">create book</button>
      </form>
    </div>
  );
};

export default NewBook;
