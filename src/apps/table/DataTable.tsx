import { useState } from 'react';
import users from './user';
import './table.css';
const pageOptions = [5, 10, 20];
export default function DataTable() {
  const [message, setMessage] = useState('Data Table');
  const [usersPerPage, setusersPerPage] = useState(pageOptions[1]);

  const [currPage, setCurrPage] = useState(1);
  const paginatedUsers = users.slice(
    (currPage - 1) * usersPerPage,
    currPage * usersPerPage,
  );
  const totalPages = Math.ceil(users.length / usersPerPage);

  return (
    <div>
      <h1>{message}</h1>
      <table>
        <thead>
          <tr>
            {[
              { label: 'ID', key: 'id' },
              { label: 'Name', key: 'name' },
              { label: 'Age', key: 'age' },
              { label: 'Occupation', key: 'occupation' },
            ].map(({ label, key }) => (
              <th key={key}>{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedUsers.map(({ id, name, age, occupation }) => (
            <tr key={id}>
              <td>{id}</td>
              <td>{name}</td>
              <td>{age}</td>
              <td>{occupation}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <div>
          <button
            onClick={() =>
              setCurrPage((prev) => (prev === 1 ? prev : prev - 1))
            }
          >
            prev
          </button>
          <span>
            page{currPage} of {totalPages}
          </span>{' '}
          <button
            onClick={() =>
              setCurrPage((prev) =>
                prev === totalPages ? totalPages : prev + 1,
              )
            }
          >
            Next
          </button>
        </div>
        <label htmlFor="usersOptions">Users : </label>
        <select
          name="usersOptions"
          value={usersPerPage}
          onChange={(e) => {
            setusersPerPage(+e.target.value);
            setCurrPage(1);
          }}
        >
          {pageOptions.map((val) => (
            <option key={val} value={val}>
              {val}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
