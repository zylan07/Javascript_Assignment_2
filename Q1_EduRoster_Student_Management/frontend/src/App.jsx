import { useCallback, useEffect, useState } from 'react';
import { studentApi } from './api';
import StudentForm from './components/StudentForm';
import StudentTable from './components/StudentTable';
import FilterBar from './components/FilterBar';

export default function App() {
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState(['CSE']);
  const [filters, setFilters] = useState({ search: '', department: '', year: '', sort: '' });
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const notify = (text, type = 'ok') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 2800);
  };

  // READ - reloads whenever a filter changes
  const load = useCallback(async () => {
    setLoading(true);
    try {
      setStudents(await studentApi.list(filters));
    } catch (e) {
      notify(e.message, 'err');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    studentApi.departments().then(setDepartments).catch(() => {});
  }, []);

  useEffect(() => {
    const t = setTimeout(load, 250); // small debounce for the search box
    return () => clearTimeout(t);
  }, [load]);

  // CREATE + UPDATE
  const save = async (payload) => {
    try {
      if (editing) {
        await studentApi.update(editing._id, payload);
        notify(`Updated ${payload.name}`);
        setEditing(null);
      } else {
        await studentApi.create(payload);
        notify(`Added ${payload.name}`);
      }
      load();
      return true;
    } catch (e) {
      notify(e.message, 'err');
      return false;
    }
  };

  // DELETE
  const remove = async (s) => {
    if (!window.confirm(`Delete ${s.name} (${s.rollNo})?`)) return;
    try {
      const r = await studentApi.remove(s._id);
      notify(r.message);
      if (editing?._id === s._id) setEditing(null);
      load();
    } catch (e) {
      notify(e.message, 'err');
    }
  };

  const avg = students.length ? students.reduce((a, s) => a + s.cgpa, 0) / students.length : 0;

  return (
    <div className="page">
      <header className="topbar">
        <div>
          <h1>
            Edu<span>Roster</span>
          </h1>
          <p>Student Management System · MERN</p>
        </div>
        <div className="pill">
          Avg CGPA <b>{avg.toFixed(2)}</b>
        </div>
      </header>

      <main className="layout">
        <StudentForm
          key={editing?._id || 'new'}
          departments={departments}
          editing={editing}
          onSave={save}
          onCancel={() => setEditing(null)}
        />
        <section className="card">
          <FilterBar departments={departments} filters={filters} setFilters={setFilters} count={students.length} />
          <StudentTable students={students} loading={loading} onEdit={setEditing} onDelete={remove} />
        </section>
      </main>

      {toast && <div className={`toast ${toast.type}`}>{toast.text}</div>}
      <footer>U21CSP12 JavaScript Frameworks · Assignment II · Sathya R V (24CS192)</footer>
    </div>
  );
}
