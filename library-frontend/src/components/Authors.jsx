import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { EDIT_AUTHOR, ALL_AUTHORS } from '../queries';

const Authors = (props) => {
  const [name, setName] = useState('');
  const [born, setBorn] = useState('');

  const [changeBirthYear] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  if (!props.show) {
    return null;
  }

  const authors = props.authors || [];

  const submit = async (event) => {
    event.preventDefault();
    const authorName = name || (authors.length > 0 ? authors[0].name : '');

    changeBirthYear({
      variables: {
        name: authorName,
        setBornTo: Number(born),
      },
    });

    setBorn('');
  };
  return (
    <>
      <div>
        <h2>authors</h2>
        <table>
          <tbody>
            <tr>
              <th></th>
              <th>born</th>
              <th>books</th>
            </tr>
            {authors.map((a) => (
              <tr key={a.id}>
                <td>{a.name}</td>
                <td>{a.born}</td>
                <td>{a.bookCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {props.token && (
        <div>
          <h3>Set birthyear</h3>
          <form onSubmit={submit}>
            <div>
              <label>
                name
                {/* select elementtiin kaikki authorien nimet */}
                <select
                  name="name"
                  value={name}
                  onChange={({ target }) => setName(target.value)}
                >
                  {authors.map((a) => (
                    <option key={a.id} value={a.name}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div>
              <label>
                born
                <input
                  type="number"
                  value={born}
                  onChange={({ target }) => setBorn(target.value)}
                />
              </label>
            </div>
            <button type="submit">update author</button>
          </form>
        </div>
      )}
    </>
  );
};

export default Authors;
