import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { LOGIN } from '../queries';

const LoginForm = ({ show, setError, setToken, setPage }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [login] = useMutation(LOGIN, {
    onCompleted: (data) => {
      const token = data.login.value;
      localStorage.setItem('library-user-token', token);
      setToken(token);
      setPage('authors');
      setUsername('');
      setPassword('');
    },
    onError: (error) => {
      console.log('Login virhe:', error);
      if (setError) {
        setError('login failed');
      }
    },
  });
  const submit = (event) => {
    event.preventDefault();
    login({ variables: { username, password } });
  };

  if (!show) return null;

  return (
    <div>
      <form onSubmit={submit}>
        <label>
          username{' '}
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
        <label>
          password{' '}
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
        <button type="submit">login</button>
      </form>
    </div>
  );
};

export default LoginForm;
