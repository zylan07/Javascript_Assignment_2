import BookCard from './BookCard';

export default function BookList({ books, loading }) {
  if (loading) return <p className="muted center">Fetching books…</p>;
  if (!books.length) return <p className="muted center">No books found for this search.</p>;
  return (
    <div className="grid">
      {books.map((b) => (
        <BookCard key={b._id} book={b} />
      ))}
    </div>
  );
}
