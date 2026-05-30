import { useState, useEffect } from 'react';
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import LoginForm from './components/LoginForm';
import { useApolloClient, useQuery } from '@apollo/client/react';
import { ALL_AUTHORS, ALL_BOOKS } from './queries';
import Recommendations from './components/Recommendations';

const App = () => {
  const [token, setToken] = useState(
    localStorage.getItem('library-user-token'),
  );
  const [page, setPage] = useState('authors');
  const [errorMessage, setErrorMessage] = useState(null);

  const notify = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 5000);
  };

  const resultAuthors = useQuery(ALL_AUTHORS, {
    notifyOnNetworkStatusChange: true,
  });
  const resultBooks = useQuery(ALL_BOOKS, {
    notifyOnNetworkStatusChange: true,
  });

  const client = useApolloClient();

  const refetchAuthors = resultAuthors.refetch;
  const refetchBooks = resultBooks.refetch;

  useEffect(() => {
    if (token) {
      refetchAuthors();
      refetchBooks();
    }
  }, [token, refetchAuthors, refetchBooks]);
  const onLogout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
    setPage('authors');
  };

  const authors = resultAuthors.data?.allAuthors || [];
  const books = resultBooks.data?.allBooks || [];
  return (
    <div>
      {errorMessage && (
        <div style={{ color: 'red', marginBottom: 10 }}>{errorMessage}</div>
      )}
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token ? (
          <>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={() => setPage('recommend')}>recommend</button>
            <button onClick={onLogout}>logout</button>
          </>
        ) : (
          <button onClick={() => setPage('login')}>login</button>
        )}
      </div>

      <Authors show={page === 'authors'} authors={authors} token={token} />

      <Books show={page === 'books'} books={books} />

      <NewBook show={page === 'add'} setPage={setPage} />
      <LoginForm
        show={page === 'login'}
        setToken={setToken}
        setPage={setPage}
        setError={notify}
      />
      <Recommendations show={page === 'recommend'} />
    </div>
  );
};

export default App;
