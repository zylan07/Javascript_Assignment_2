import { useState } from 'react';

const EMPTY = { rollNo: '', name: '', email: '', phone: '', department: 'CSE', year: 1, cgpa: '' };

// Validates the form on the client before calling the API
function validate(s) {
  const errors = {};
  if (!/^\d{2}[A-Za-z]{2,4}\d{3}$/.test(s.rollNo.trim())) errors.rollNo = 'Format: 24CS192';
  if (s.name.trim().length < 3) errors.name = 'Min 3 characters';
  if (!/^\S+@\S+\.\S+$/.test(s.email)) errors.email = 'Enter a valid email';
  if (s.phone && !/^[6-9]\d{9}$/.test(s.phone)) errors.phone = '10-digit mobile number';
  const g = Number(s.cgpa);
  if (s.cgpa === '' || Number.isNaN(g) || g < 0 || g > 10) errors.cgpa = 'CGPA between 0 and 10';
  return errors;
}

export default function StudentForm({ departments, editing, onSave, onCancel }) {
  // When "Edit" is clicked, App re-mounts this form (key prop) with that student loaded
  const [form, setForm] = useState(() => (editing ? { ...EMPTY, ...editing, phone: editing.phone || '' } : EMPTY));
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    const v = validate(form);
    setErrors(v);
    if (Object.keys(v).length) return;
    setSaving(true);
    const payload = {
      rollNo: form.rollNo.trim().toUpperCase(),
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || undefined,
      department: form.department,
      year: Number(form.year),
      cgpa: Number(form.cgpa),
    };
    const ok = await onSave(payload);
    setSaving(false);
    if (ok && !editing) setForm(EMPTY);
  };

  const field = (name, label, props = {}) => (
    <label className={`field ${errors[name] ? 'has-error' : ''}`}>
      <span>{label}</span>
      <input name={name} value={form[name]} onChange={change} {...props} />
      {errors[name] && <small>{errors[name]}</small>}
    </label>
  );

  return (
    <form className="card form" onSubmit={submit} noValidate>
      <h2>{editing ? `Edit ${editing.rollNo}` : 'Add Student'}</h2>
      {field('rollNo', 'Roll No', { placeholder: '24CS192', disabled: !!editing })}
      {field('name', 'Full Name', { placeholder: 'Sathya R V' })}
      {field('email', 'Email', { type: 'email', placeholder: 'name@kpriet.ac.in' })}
      {field('phone', 'Phone', { placeholder: '9876543210' })}
      <div className="row2">
        <label className="field">
          <span>Department</span>
          <select name="department" value={form.department} onChange={change}>
            {departments.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Year</span>
          <select name="year" value={form.year} onChange={change}>
            {[1, 2, 3, 4].map((y) => (
              <option key={y} value={y}>
                {['I', 'II', 'III', 'IV'][y - 1]}
              </option>
            ))}
          </select>
        </label>
      </div>
      {field('cgpa', 'CGPA', { type: 'number', step: '0.01', min: 0, max: 10, placeholder: '8.50' })}
      <div className="actions">
        <button className="btn primary" disabled={saving}>
          {saving ? 'Saving…' : editing ? 'Update Student' : 'Add Student'}
        </button>
        {editing && (
          <button type="button" className="btn ghost" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
