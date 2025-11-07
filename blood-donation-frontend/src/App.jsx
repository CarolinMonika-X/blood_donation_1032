import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const defaultForm = {
  name: '',
  bloodGroup: '',
  contact: '',
  city: ''
};

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const cities = ['Delhi', 'Mumbai', 'Chennai', 'Kolkata'];

function App() {
  const [form, setForm] = useState(defaultForm);
  const [donors, setDonors] = useState([]);

  const fetchDonors = async () => {
    const res = await axios.get('http://localhost:5000/api/donors');
    setDonors(res.data);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.name || !form.bloodGroup || !form.contact || !form.city) return;
    await axios.post('http://localhost:5000/api/donors', form);
    setForm(defaultForm);
    fetchDonors();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/donors/${id}`);
    fetchDonors();
  };

  return (
    <div className="container">
      <h1>Blood Donation App</h1>
      <h2>Add Donor</h2>
      <form className="form-box" onSubmit={handleAdd}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
        />
        <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange}>
          <option value="">Select Blood Group</option>
          {bloodGroups.map(bg => (
            <option key={bg} value={bg}>{bg}</option>
          ))}
        </select>
        <input
          name="contact"
          placeholder="Contact Number"
          value={form.contact}
          onChange={handleChange}
        />
        <select name="city" value={form.city} onChange={handleChange}>
          <option value="">Select City</option>
          {cities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
        <button type="submit">Add Donor</button>
      </form>

      <h2>All Donors</h2>
      <button onClick={fetchDonors}>Refresh List</button>
      <ul>
        {donors.map(donor => (
          <li key={donor._id}>
            {donor.name}, {donor.bloodGroup}, {donor.contact}, {donor.city}
            <button onClick={() => handleDelete(donor._id)} style={{marginLeft:10, background:"#b71c1c"}}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
