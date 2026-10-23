import { useState } from 'react';

const blank = { title: '', author: '', price: '', stock: '', available: true, genre: 'Fiction', publishedYear: '', coverColor: '#7c2d12' };

export default function BookForm({ genres, selected, onSubmit, onClear }) {
  // ManageBooks re-mounts this form (key prop) whenever a different book is selected
  const [book, setBook] = useState(() => (selected ? { ...blank, ...selected } : blank));
  const [error, setError] = useState('');

  const set = (e) => {
    const { name, value, type, checked } = e.target;
    setBook((b) => ({ ...b, [name]: type === 'checkbox' ? checked : value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!book.title.trim() || !book.author.trim()) return setError('Title and author are required');
    if (book.price === '' || Number(book.price) < 0) return setError('Enter a valid price');
    setError('');
    const ok = await onSubmit({
      title: book.title.trim(),
      author: book.author.trim(),
      price: Number(book.price),
      stock: Number(book.stock || 0),
      available: book.available,
      genre: book.genre,
      publishedYear: book.publishedYear ? Number(book.publishedYear) : undefined,
      coverColor: book.coverColor,
    });
    if (ok && !selected) setBook(blank);
  };

  return (
    <form className="panel bookform" onSubmit={submit}>
      <h2>{selected ? 'Edit book' : 'Add a new book'}</h2>
      <label>Title<input name="title" value={book.title} onChange={set} placeholder="Book title" /></label>
      <label>Author<input name="author" value={book.author} onChange={set} placeholder="Author name" /></label>
      <div className="two">
        <label>Price (₹)<input name="price" type="number" min="0" value={book.price} onChange={set} /></label>
        <label>Stock<input name="stock" type="number" min="0" value={book.stock} onChange={set} /></label>
      </div>
      <div className="two">
        <label>
          Genre
          <select name="genre" value={book.genre} onChange={set}>
            {genres.map((g) => <option key={g}>{g}</option>)}
          </select>
        </label>
        <label>Year<input name="publishedYear" type="number" value={book.publishedYear} onChange={set} /></label>
      </div>
      <div className="two">
        <label className="check"><input type="checkbox" name="available" checked={book.available} onChange={set} /> Available for sale</label>
        <label className="color">Cover <input type="color" name="coverColor" value={book.coverColor} onChange={set} /></label>
      </div>
      {error && <p className="error">{error}</p>}
      <div className="btns">
        <button className="primary">{selected ? 'Save changes' : 'Add book'}</button>
        {selected && <button type="button" onClick={onClear}>Cancel</button>}
      </div>
    </form>
  );
}
