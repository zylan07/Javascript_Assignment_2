import { useEffect, useState } from 'react';
import * as api from './services/bookService';
import SearchBar from './components/SearchBar';
import BookList from './components/BookList';
import ManageBooks from './components/ManageBooks';

export default function App() {
  const [view, setView] = useState('shop');
  const [books, setBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [summary, setSummary] = useState({ total: 0, inStock: 0, outOfStock: 0, genres: [] });
  const [query, setQuery] = useState({ q: '', searchBy: 'all', genre: '', available: '', sort: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const flash = (text, bad = false) => {
    setMessage({ text, bad });
    setTimeout(() => setMessage(null), 2500);
  };

  // Shop view: re-query the API whenever the search changes
  useEffect(() => {
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        setBooks(await api.getBooks(query));
      } catch (e) {
        flash(e.message, true);
      }
      setLoading(false);
    }, 250);
    return () => clearTimeout(t);
  }, [query]);

  const refreshAll = async () => {
    const [list, sum] = await Promise.all([api.getBooks({}), api.getSummary()]);
    setAllBooks(list);
    setSummary(sum);
    setBooks(await api.getBooks(query));
  };

  useEffect(() => {
    refreshAll().catch((e) => flash(e.message, true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const run = async (fn, okText) => {
    try {
      const r = await fn();
      flash(okText || r.message);
      await refreshAll();
      return true;
    } catch (e) {
      flash(e.message, true);
      return false;
    }
  };

  return (
    <>
      <header className="masthead">
        <div className="brand">
          <span className="logo">📖</span>
          <div>
            <h1>PageTurn Books</h1>
            <p>Online bookstore · React + Express + MongoDB</p>
          </div>
        </div>
        <div className="stats">
          <div><b>{summary.total}</b>titles</div>
          <div><b>{summary.inStock}</b>in stock</div>
          <div><b>{summary.outOfStock}</b>sold out</div>
        </div>
        <nav>
          <button className={view === 'shop' ? 'active' : ''} onClick={() => setView('shop')}>Browse</button>
          <button className={view === 'manage' ? 'active' : ''} onClick={() => setView('manage')}>Manage Books</button>
        </nav>
      </header>

      <main className="container">
        {view === 'shop' ? (
          <>
            <SearchBar query={query} setQuery={setQuery} genres={summary.genres} />
            <BookList books={books} loading={loading} />
          </>
        ) : (
          <ManageBooks
            books={allBooks}
            genres={summary.genres.length ? summary.genres : ['Fiction']}
            onAdd={(b) => run(() => api.addBook(b), `Added "${b.title}"`)}
            onUpdate={(id, b) => run(() => api.updateBook(id, b), `Updated "${b.title}"`)}
            onToggle={(b) => run(() => api.toggleAvailability(b._id), `"${b.title}" marked ${b.available ? 'unavailable' : 'available'}`)}
            onDelete={(b) => window.confirm(`Delete "${b.title}"?`) && run(() => api.deleteBook(b._id))}
          />
        )}
      </main>

      {message && <div className={`flash ${message.bad ? 'bad' : ''}`}>{message.text}</div>}
      <footer>Assignment II · U21CSP12 · Sathya R V · 24CS192</footer>
    </>
  );
}
