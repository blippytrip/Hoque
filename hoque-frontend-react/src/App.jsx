import { useEffect, useState } from "react";

const API = "http://localhost:5000/api";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [form, setForm] = useState({
    name: "",
    age: "",
    complaint: "",
    priority: 1,
    doctorAssigned: ""
  });
  const [message, setMessage] = useState("");

  async function login() {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) return setMessage(data.message || "Login failed");
    localStorage.setItem("token", data.token);
    setToken(data.token);
    setMessage("Login successful");
  }

  function headers() {
    return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
  }

  async function loadDoctors() {
    const res = await fetch(`${API}/doctors`);
    const data = await res.json();
    setDoctors(data);
  }

  async function loadPatients() {
    const res = await fetch(`${API}/patients`, { headers: headers() });
    const data = await res.json();
    setPatients(data.patients || []);
  }

  async function createPatient() {
    const payload = { ...form, age: Number(form.age), priority: Number(form.priority) };
    const res = await fetch(`${API}/patients`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    setMessage(res.ok ? "Patient created" : data.message || "Error");
    if (res.ok) loadPatients();
  }

  async function getPatient(id) {
    const res = await fetch(`${API}/patients/${id}`, { headers: headers() });
    const data = await res.json();
    if (!res.ok) return setMessage(data.message || "Error");
    setSelectedPatientId(id);
    setForm({
      name: data.name || "",
      age: data.age || "",
      complaint: data.complaint || "",
      priority: data.priority || 1,
      doctorAssigned: data.doctorAssigned?._id || data.doctorAssigned || ""
    });
  }

  async function updatePatient() {
    if (!selectedPatientId) return setMessage("Select a patient first");
    const payload = { ...form, age: Number(form.age), priority: Number(form.priority) };
    const res = await fetch(`${API}/patients/${selectedPatientId}`, {
      method: "PATCH",
      headers: headers(),
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    setMessage(res.ok ? "Patient updated" : data.message || "Error");
    if (res.ok) loadPatients();
  }

  async function deletePatient(id) {
    const res = await fetch(`${API}/patients/${id}`, {
      method: "DELETE",
      headers: headers()
    });
    const data = await res.json();
    setMessage(res.ok ? "Patient deleted" : data.message || "Error");
    if (res.ok) loadPatients();
  }

  useEffect(() => {
    loadDoctors();
  }, []);

  useEffect(() => {
    if (token) loadPatients();
  }, [token]);

  if (!token) {
    return (
      <div className="app">
        <h2>React Login</h2>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
        <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" />
        <button onClick={login}>Login</button>
        <pre>{message}</pre>
      </div>
    );
  }

  return (
    <div className="app">
      <h2>React Patient CRUD</h2>
      <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Name" />
      <input value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} placeholder="Age" />
      <input value={form.complaint} onChange={e => setForm({ ...form, complaint: e.target.value })} placeholder="Complaint" />
      <input value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} placeholder="Priority 1-3" />
      <select value={form.doctorAssigned} onChange={e => setForm({ ...form, doctorAssigned: e.target.value })}>
        <option value="">Select doctor</option>
        {doctors.map(d => (
          <option key={d._id} value={d._id}>
            {d.name} ({d.specialization})
          </option>
        ))}
      </select>
      <button onClick={createPatient}>Create</button>
      <button onClick={updatePatient}>Update Selected</button>
      <h3>Patients</h3>
      {patients.map(p => (
        <div key={p._id} className="row">
          <span>{p.name} | {p.status}</span>
          <button onClick={() => getPatient(p._id)}>Detail/Edit</button>
          <button onClick={() => deletePatient(p._id)}>Delete</button>
        </div>
      ))}
      <pre>{message}</pre>
    </div>
  );
}
