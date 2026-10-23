export default function FilterBar({ departments, filters, setFilters, count }) {
  const set = (k) => (e) => setFilters({ ...filters, [k]: e.target.value });
  return (
    <div className="filterbar">
      <input
        className="search"
        placeholder="Search by name, roll no or email…"
        value={filters.search}
        onChange={set('search')}
      />
      <select value={filters.department} onChange={set('department')}>
        <option value="">All depts</option>
        {departments.map((d) => (
          <option key={d}>{d}</option>
        ))}
      </select>
      <select value={filters.year} onChange={set('year')}>
        <option value="">All years</option>
        {[1, 2, 3, 4].map((y) => (
          <option key={y} value={y}>
            Year {y}
          </option>
        ))}
      </select>
      <select value={filters.sort} onChange={set('sort')}>
        <option value="">Newest first</option>
        <option value="cgpa">CGPA (high → low)</option>
        <option value="name">Name (A → Z)</option>
        <option value="roll">Roll No</option>
      </select>
      <span className="count">{count} record(s)</span>
    </div>
  );
}
