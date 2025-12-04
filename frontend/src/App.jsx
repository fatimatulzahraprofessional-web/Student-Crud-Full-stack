import { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const API_URL = "http://localhost:5000/api/students";

  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: "", registration: "", semester: "", department: "" });
  const [editingId, setEditingId] = useState(null);

  const fetchStudents = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setStudents(data);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ name: "", registration: "", semester: "", department: "" });
    setEditingId(null);
    fetchStudents();
  };

  const handleEdit = (student) => {
    setForm(student);
    setEditingId(student._id);
  };

  const handleDelete = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchStudents();
  };

  return (
    <div className="container">
      <h1>Student CRUD App</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input type="text" name="registration" placeholder="Registration No" value={form.registration} onChange={handleChange} required />
        <input type="number" name="semester" placeholder="Semester" value={form.semester} onChange={handleChange} required />
        <input type="text" name="department" placeholder="Department" value={form.department} onChange={handleChange} />
        <button type="submit" className="add-btn">{editingId ? "Update Student" : "Add Student"}</button>
      </form>

      <div className="student-list">
        {students.map((student) => (
          <div className="student-card" key={student._id}>
            <div className="info">
              <strong>{student.name}</strong> ({student.registration})<br />
              Semester: {student.semester} | {student.department}
            </div>
            <div>
              <button className="edit" onClick={() => handleEdit(student)}>Edit</button>
              <button className="delete" onClick={() => handleDelete(student._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
