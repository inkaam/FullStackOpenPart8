import { useQuery } from '@apollo/client/react';
import { ME, ALL_BOOKS } from '../queries';

const Recommendations = (props) => {
  const userResult = useQuery(ME, {
    skip: !props.show,
  });
  const booksResult = useQuery(ALL_BOOKS, {
    skip: !props.show,
  });

  if (!props.show) {
    return null;
  }

  const user = userResult.data?.me;
  const books = booksResult.data?.allBooks || [];

  if (!user) {
    return <div>Please log in to see recommendations.</div>;
  }

  const favoriteGenre = user.favoriteGenre;

  const recommendedBooks = books.filter((book) =>
    book.genres.includes(favoriteGenre),
  );

  return (
    <div>
      <h2>recommendations</h2>
      <p>
        books in your favorite genre <strong>{favoriteGenre}</strong>
      </p>

      <table>
        <thead>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
        </thead>
        <tbody>
          {recommendedBooks.map((book) => (
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Recommendations;
