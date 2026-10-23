function gradeBadge(cgpa) {
  if (cgpa >= 9) return ['Outstanding', 'b-gold'];
  if (cgpa >= 8) return ['Excellent', 'b-teal'];
  if (cgpa >= 7) return ['Good', 'b-blue'];
  return ['Average', 'b-grey'];
}

export default function StudentTable({ students, loading, onEdit, onDelete }) {
  if (loading) return <p className="empty">Loading students…</p>;
  if (!students.length) return <p className="empty">No students match. Add one using the form.</p>;

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Roll No</th>
            <th>Name</th>
            <th>Dept</th>
            <th>Year</th>
            <th>CGPA</th>
            <th>Contact</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => {
            const [label, cls] = gradeBadge(s.cgpa);
            return (
              <tr key={s._id}>
                <td className="mono">{s.rollNo}</td>
                <td>{s.name}</td>
                <td>
                  <span className="dept">{s.department}</span>
                </td>
                <td>{s.year}</td>
                <td>
                  <strong>{Number(s.cgpa).toFixed(2)}</strong> <span className={`badge ${cls}`}>{label}</span>
                </td>
                <td className="contact">
                  {s.email}
                  <br />
                  <small>{s.phone || '—'}</small>
                </td>
                <td>
                  <div className="row-actions">
                    <button className="btn small" onClick={() => onEdit(s)}>
                      Edit
                    </button>
                    <button className="btn small danger" onClick={() => onDelete(s)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
