import { useState } from 'react';
import BookForm from './BookForm';

// Admin view: add / edit / delete / toggle availability
export default function ManageBooks({ books, genres, onAdd, onUpdate, onToggle, onDelete }) {
  const [selected, setSelected] = useState(null);

  const submit = async (data) => {
    const ok = selected ? await onUpdate(selected._id, data) : await onAdd(data);
    if (ok) setSelected(null);
    return ok;
  };

  return (
    <div className="manage">
      <BookForm key={selected?._id || 'new'} genres={genres} selected={selected} onSubmit={submit} onClear={() => setSelected(null)} />
      <div className="panel">
        <h2>Catalogue ({books.length})</h2>
        <table>
          <thead>
            <tr><th>Title</th><th>Author</th><th>Price</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {books.map((b) => (
              <tr key={b._id}>
                <td><span className="dot" style={{ background: b.coverColor }} />{b.title}</td>
                <td>{b.author}</td>
                <td>₹{b.price}</td>
                <td>
                  <button className={`status ${b.available ? 'yes' : 'no'}`} onClick={() => onToggle(b)} title="Click to toggle">
                    {b.available ? 'Available' : 'Unavailable'}
                  </button>
                </td>
                <td className="acts">
                  <button onClick={() => setSelected(b)}>Edit</button>
                  <button className="del" onClick={() => onDelete(b)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
