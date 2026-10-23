// Search by title or author + genre / stock / sort filters
export default function SearchBar({ query, setQuery, genres }) {
  const update = (key, value) => setQuery((q) => ({ ...q, [key]: value }));

  return (
    <div className="searchbar">
      <div className="search-main">
        <div className="toggle">
          {['all', 'title', 'author'].map((k) => (
            <button key={k} className={query.searchBy === k ? 'on' : ''} onClick={() => update('searchBy', k)}>
              {k === 'all' ? 'Title / Author' : k[0].toUpperCase() + k.slice(1)}
            </button>
          ))}
        </div>
        <input
          value={query.q}
          onChange={(e) => update('q', e.target.value)}
          placeholder={query.searchBy === 'author' ? 'Search by author name…' : query.searchBy === 'title' ? 'Search by book title…' : 'Search books by title or author…'}
        />
      </div>
      <div className="chips">
        <button className={!query.genre ? 'chip on' : 'chip'} onClick={() => update('genre', '')}>
          All
        </button>
        {genres.map((g) => (
          <button key={g} className={query.genre === g ? 'chip on' : 'chip'} onClick={() => update('genre', g)}>
            {g}
          </button>
        ))}
        <label className="instock">
          <input
            type="checkbox"
            checked={query.available === 'true'}
            onChange={(e) => update('available', e.target.checked ? 'true' : '')}
          />
          In stock only
        </label>
        <select value={query.sort} onChange={(e) => update('sort', e.target.value)}>
          <option value="">Newest</option>
          <option value="price_asc">Price: Low → High</option>
          <option value="price_desc">Price: High → Low</option>
          <option value="title">Title A → Z</option>
        </select>
      </div>
    </div>
  );
}
