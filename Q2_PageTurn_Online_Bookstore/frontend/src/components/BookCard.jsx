// One book shown as a "cover" + details
export default function BookCard({ book }) {
  return (
    <article className={`book ${book.available ? '' : 'sold-out'}`}>
      <div className="cover" style={{ background: book.coverColor }}>
        <span className="cover-title">{book.title}</span>
        <span className="cover-author">{book.author}</span>
      </div>
      <div className="book-info">
        <h3>{book.title}</h3>
        <p className="author">by {book.author}</p>
        <p className="meta">
          {book.genre}
          {book.publishedYear ? ` · ${book.publishedYear}` : ''}
        </p>
        <div className="price-row">
          <span className="price">₹{book.price.toLocaleString('en-IN')}</span>
          <span className={`stock ${book.available ? 'yes' : 'no'}`}>
            {book.available ? `In stock (${book.stock})` : 'Out of stock'}
          </span>
        </div>
      </div>
    </article>
  );
}
